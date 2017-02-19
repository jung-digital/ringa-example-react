import {Controller, forEachParallel, iif, event} from 'ringa';

import PopupLoadingController from '../components/popup/loading/PopupLoadingController';
import PopupLoadingModel from '../components/popup/loading/PopupLoadingModel';

import { SerializeLists } from './APISerializers';

import APIController from './APIController';
import AppModel from './AppModel';

import Item from '../valueObjects/Item';
import List from '../valueObjects/List';

export default class AppController extends Controller {
  constructor() {
    super('AppController', undefined, {
      timeout: 5000
    });

    this.addModel(new PopupLoadingModel());
    this.addModel(new AppModel());

    //---------------------------------
    // AppController.SHOW_POPUP
    //---------------------------------
    this.addListener('showPopup', appModel => {
      appModel.windowScrollAllowed = false;
    });

    //---------------------------------
    // AppController.HIDE_POPUP
    //---------------------------------
    this.addListener('hidePopup', appModel => {
      appModel.windowScrollAllowed = true;
    });

    //---------------------------------
    // AppController.REFRESH_LISTS
    //---------------------------------
    this.addListener('refreshLists', [
      APIController.GET_LISTS,
      SerializeLists
    ]);

    //---------------------------------
    // AppController.ADD_ITEM_TO_LIST
    //---------------------------------
    this.addListener('addItemToList', [
      ($ringaEvent) => {
        // Create an empty item to save, which is required by APIController.POST_ITEM
        $ringaEvent.detail.item = new Item();
      },
      APIController.POST_ITEM,
      ($lastPromiseResult, list, autoEdit, appModel) => {
        let newItem = Item.deserialize($lastPromiseResult);
        newItem.parentList = list;

        appModel.startEditItem(newItem);
        list.pushItem(newItem);
      },
      APIController.PUT_LIST
    ]);

    //---------------------------------
    // AppController.ADD_LIST
    //---------------------------------
    this.addListener('addList', [
      ($ringaEvent) => {
        // Create an empty item to save, which is required by APIController.POST_ITEM
        $ringaEvent.detail.list = new List();
      },
      APIController.POST_LIST,
      ($lastPromiseResult, list, autoEdit, appModel) => {
        let newList = List.deserialize($lastPromiseResult);
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
        $ringaEvent.detail.itemId = item.id;
        $ringaEvent.detail.listId = item.parentList.id;
        $ringaEvent.detail.list = item.parentList;
        let ix = item.parentList.items.indexOf(item);
        item.parentList.items.splice(ix, 1);
      },
      APIController.DELETE_ITEM,
      APIController.PUT_LIST,
      AppController.REFRESH_LIST
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
        event(AppController.ADD_ITEM_TO_LIST, {autoEdit: true}),
        (appModel, item) => {appModel.endEditItem(item);})
    ]);

    //---------------------------------
    // AppController.INITIALIZE
    //---------------------------------
    this.addListener('initialize', [
      PopupLoadingController.show('Loading Lists...'),
      AppController.REFRESH_LISTS,
      appModel => {appModel.initialized = true;},
      PopupLoadingController.hide(),
      forEachParallel('lists', 'list', AppController.REFRESH_ITEMS_FOR_LIST)
    ]);

    this.addListener('click', [
      (appModel, $ringaEvent) => {
        if ($ringaEvent.event.target.nodeName === 'INPUT') {
          return;
        }

        appModel.endEditItem();
        appModel.endEditList();
      }
    ]);
  }

  busMounted() {
    // We cannot dispatch until we know for sure the event bus (in this case DOM node)
    // is ready to dispatch our event!
    this.dispatch('initialize');
  }
}
