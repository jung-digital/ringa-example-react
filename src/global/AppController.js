import {Controller, forEachParallel, iif, event} from 'ringa';

import PopupLoadingController from '../components/popup/loading/PopupLoadingController';

import { SerializeLists } from './APISerializers';

import APIController from './APIController';
import AppModel from './AppModel';

import Item from '../valueObjects/Item';
import List from '../valueObjects/List';

/**
 * The AppController is where all the major events in the demo are first caught.
 *
 * Each event triggers an executor tree, and in many cases those trees trigger other trees as well.
 */
export default class AppController extends Controller {
  /**
   * Constructs the AppController. Constructed in App.js.
   */
  constructor() {
    /**
     * We pass 'undefined' for the bus, which defaults to using the document as the bus. So all events
     * are attached to the document.
     *
     * Note the timeout. If any command takes longer than 5000 milliseconds, then an error will be
     * generated and shown in the console.
     *
     * 'throttle' can be used to force every executor to take between a minimum and a maximum amount of time (randomized), so you
     * can simulate a slow device or slow connections. Note that throttle only applies to this controller
     * so you can custom throttle each section of your application without bogging the entire thing down.
     */
    super('AppController', undefined, Object.assign({
      timeout: 5000
    }, window.__generalControllerOptions));

    /**
     * Here we add two models to our Controller. By default if no name or id is provided, they will have them assigned.
     *
     * 'id' default is the constructor name and an incrementing number
     * 'name' default is the camelcase of the constructor name, like so:
     *
     * AppModel.id === 'AppModel###'
     * AppModel.name === 'appModel'
     *
     * You can request these objects by name or id as a function argument various functions in executors.
     */
    this.addModel(new AppModel());

    //---------------------------------
    // AppController.SHOW_POPUP
    //---------------------------------
    /**
     * Simple executor that blocks window scrolling when a popup is shown.
     *
     * Note that this event is caught here and in PopupBaseController.
     */
    this.addListener('showPopup', appModel => {
      appModel.windowScrollAllowed = false;
    });

    //---------------------------------
    // AppController.HIDE_POPUP
    //---------------------------------
    /**
     * Allows scrolling when the popup is hidden.
     *
     * Note that this event is caught here and in PopupBaseController.
     */
    this.addListener('hidePopup', appModel => {
      appModel.windowScrollAllowed = true;
    });

    //---------------------------------
    // AppController.REFRESH_LISTS
    //---------------------------------
    /**
     * Refreshes the lists and then serializes the POJO result into List value objects.
     */
    this.addListener('refreshLists', [
      APIController.GET_LISTS,
      SerializeLists
    ]);

    //---------------------------------
    // AppController.ADD_ITEM_TO_LIST
    //---------------------------------
    /**
     * Adds an item to a list and begins editing of it in the display.
     */
    this.addListener('addItemToList', [
      /**
       * The simplest executor is a function and here we are requesting that the $ringaEvent be injected.
       */
      ($ringaEvent, list, appModel) => {
        // Create an empty item to save, which is required by APIController.POST_ITEM
        let newItem = $ringaEvent.detail.item = new Item();
        newItem.parentList = list;

        // These two lines set properties on Ringa Model objects, which automatically updates the view components
        // that are watching them.
        appModel.startEditItem(newItem);
        list.pushItem(newItem);
      },
      /**
       * Dispatch an event to our APIController. The $ringaEvent.detail object above is automatically merged into
       * the new events detail property so that the 'item' property is transferred to APIController.
       */
      APIController.POST_ITEM,
      /**
       * Once our result comes back from the call, it is stored in $lastPromiseResult. Note that we are requesting
       * multiple injections.
       */
      ($lastPromiseResult, item) => {
        item.id = $lastPromiseResult.id;
      },
      /**
       * Now we can go ahead and save the update to the list!
       */
      APIController.PUT_LIST
    ]);

    //---------------------------------
    // AppController.ADD_LIST
    //---------------------------------
    /**
     * Add new list to the application. Similar to addItemToList above.
     */
    this.addListener('addList', [
      ($ringaEvent) => {
        // Create an empty item to save, which is required by APIController.POST_ITEM
        $ringaEvent.detail.list = new List();
      },
      APIController.POST_LIST,
      ($lastPromiseResult, list, autoEdit, appModel) => {
        let newList = List.deserialize($lastPromiseResult);

        // Update the display!
        if (autoEdit) {
          appModel.startEditList(newList);
        }
        newList.loading = false;
        appModel.pushList(newList);
      }
    ]);

    //---------------------------------
    // AppController.DELETE_LIST
    //---------------------------------
    this.addListener('deleteList', [
      APIController.DEL_LIST,
      /**
       * Here we do not do the splice ourselves. The reason is so that we can call notify() and update any watchers.
       */
      (appModel, listId) => {
        appModel.removeListById(listId);
      }
    ]);

    //---------------------------------
    // AppController.REFRESH_ITEMS_FOR_LIST
    //---------------------------------
    this.addListener('refreshItemsForList', [
      ($detail, list) => {
        $detail.itemIds = list.itemIds;
      },
      /**
       * iif is one of the more powerful features of Ringa. It executes another executor based on the truthiness
       * of a callback. Notice that the callback requests itemIds be injected, which we set above!
       */
      iif(itemIds => itemIds && itemIds.length > 0, APIController.GET_ITEMS),
      iif($lastPromiseResult => $lastPromiseResult, ($lastPromiseResult, list) => {
        list.destroyAllItems();

        list.items = $lastPromiseResult.map(item => {
          item = Item.deserialize(item);
          item.parentList = list;
          return item;
        });
      }),
      list => {
        // Once all that is done, we can update our loading state to false and remove the spinner!
        list.loading = false;
      }
    ]);

    //---------------------------------
    // AppController.REFRESH_LIST
    //---------------------------------
    this.addListener('refreshList', [
      (listId, $ringaEvent, appModel) => {
        appModel.lists.forEach((list, ix) => {
          if (list.id === listId) {
            $ringaEvent.detail.ix = ix;
          }
        });
      },
      APIController.GET_LIST,
      ($lastPromiseResult, ix, $ringaEvent, appModel) => {
        appModel.lists[ix].destroy();

        $ringaEvent.detail.list = appModel.lists[ix] = List.deserialize($lastPromiseResult);
      },
      AppController.REFRESH_ITEMS_FOR_LIST,
      (appModel) => {
        appModel.notify('lists');
      }
    ]);

    //---------------------------------
    // AppController.SAVE_LIST
    //---------------------------------
    this.addListener('saveList', [
      iif(autoAddItem => autoAddItem, AppController.ADD_ITEM_TO_LIST),
      APIController.PUT_LIST,
      (appModel, list) => {
        appModel.endEditList(list);
      }
    ]);

    //---------------------------------
    // AppController.REMOVE_ITEM
    //---------------------------------
    this.addListener('removeItem', [
      (item, $ringaEvent) => {
        // Provide for DELETE_ITEM
        $ringaEvent.detail.itemId = item.id;
        $ringaEvent.detail.listId = item.parentList.id;
        // Provide for PUT_LIST
        $ringaEvent.detail.list = item.parentList;
        let ix = item.parentList.items.indexOf(item);
        item.parentList.removeItemByIx(ix);
      },
      APIController.DELETE_ITEM,
      APIController.PUT_LIST
    ]);

    //---------------------------------
    // AppController.SAVE_ITEM
    //---------------------------------
    this.addListener('saveItem', [
      ($detail, appModel, item) => {
        $detail.list = item.parentList;
      },
      iif(item => item.title === '', AppController.REMOVE_ITEM, APIController.PUT_ITEM),
      iif((item, autoAddNewItem) => item.title !== '' && autoAddNewItem,
        /**
         * event() allows us to attach a custom detail object.
         */
        /* truthy */  event(AppController.ADD_ITEM_TO_LIST, {autoEdit: true}),
        /* falsey */  (appModel, item) => {appModel.endEditItem(item);})
    ]);

    //---------------------------------
    // AppController.INITIALIZE
    //---------------------------------
    /**
     * This is where the application starts up!
     */
    this.addListener('initialize', [
      PopupLoadingController.show('Loading Lists...'), // Show the loader
      AppController.REFRESH_LISTS,                     // Load all the lists
      appModel => {appModel.initialized = true;},      // Set our initialized flag
      PopupLoadingController.hide(),                   // Hide the loader, which does a fade out
      forEachParallel('lists', 'list', AppController.REFRESH_ITEMS_FOR_LIST) // Load all the lists items
    ]);

    /**
     * Since the AppController is attached to the document, it can listen to events like click.
     *
     * Here we say we want to listen to all click events during the capture phase so that if the user
     * is not selecting an input element and editing is in progress, it cancels the edit.
     */
    this.addListener('click', [
      (appModel, $ringaEvent) => {
        if ($ringaEvent.event.target.nodeName === 'INPUT') {
          return;
        }

        let t = $ringaEvent.event.target;

        // Watch out for the Inspector pane!
        while (t) {
          if (t.className.indexOf('inspector')) {
            return;
          }

          t = t.parentNode;
        }

        if (appModel.editing) {
          $ringaEvent.event.stopPropagation();

          appModel.endEditItem();
          appModel.endEditList();
        }
      }
    ], true /* useCapture */);
  }

  /**
   * busMounted is called when the bus has been successfully attached to the Controller and it is safe to dispatch
   * events.
   */
  busMounted() {
    // We cannot dispatch until we know for sure the event bus (in this case DOM node)
    // is ready to dispatch our event!
    this.dispatch('initialize');
  }
}
