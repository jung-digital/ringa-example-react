import {Controller, forEachParallel, iif} from 'ringa';

import PopupLoadingController from '../components/popup/loading/PopupLoadingController';
import PopupLoadingModel from '../components/popup/loading/PopupLoadingModel';

import { SerializeLists } from './APISerializers';

import APIController from './APIController';
import AppModel from './AppModel';

import Item from '../valueObjects/Item';

export default class AppController extends Controller {
  constructor() {
    super();

    this.addModel(new PopupLoadingModel());
    this.addModel(new AppModel());

    // AppController.SHOW_POPUP
    this.addListener('showPopup', appModel => {
      appModel.windowScrollAllowed = false;
    });

    // AppController.HIDE_POPUP
    this.addListener('hidePopup', appModel => {
      appModel.windowScrollAllowed = true;
    });

    // AppController.REFRESH_LISTS
    this.addListener('refreshLists', [
      APIController.GET_LISTS,
      SerializeLists
    ]);

    // AppController.ADD_ITEM_TO_LIST
    this.addListener('addItemToList', [
      ($ringaEvent, autoEdit) => {
        // Create an empty item to save, which is required by APIController.POST_ITEM
        $ringaEvent.detail.item = new Item();
      },
      APIController.POST_ITEM,
      ($lastPromiseResult, list, autoEdit) => {
        let newItem = Item.deserialize($lastPromiseResult);
        list.pushItem(newItem);
        newItem.parentList = list;
        newItem.editing = autoEdit;
      },
      APIController.PUT_LIST
    ]);

    // AppController.DELETE_LIST
    this.addListener('deleteList', [
      APIController.DEL_LIST,
      AppController.REFRESH_LISTS
    ]);

    // AppController.REFRESH_ITEMS_FOR_LIST
    this.addListener('refreshItemsForList', [
      ($detail, list) => {
        $detail.itemIds = list.itemIds;

        list.loading = true;
      },
      iif(itemIds => itemIds && itemIds.length > 0, APIController.GET_ITEMS),
      iif($lastPromiseResult => $lastPromiseResult, ($lastPromiseResult, list) => {
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

    // AppController.REFRESH_LIST
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
        $ringaEvent.detail.list = appModel.lists[ix] = $lastPromiseResult;
      },
      AppController.REFRESH_ITEMS_FOR_LIST,
      (appModel) => {
        appModel.notify('lists');
      }
    ]);

    // AppController.SAVE_ITEM
    this.addListener('saveItem', [
      APIController.PUT_ITEM
    ]);

    // AppController.REMOVE_ITEM
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

    // AppController.INITIALIZE
    this.addListener('initialize', [
      PopupLoadingController.show('Loading Lists...'),
      AppController.REFRESH_LISTS,
      PopupLoadingController.hide(),
      forEachParallel('lists', 'list', AppController.REFRESH_ITEMS_FOR_LIST)
    ]);
  }

  busMounted() {
    // We cannot dispatch until we know for sure the bus is ready to distribute our event!
    this.dispatch('initialize');
  }
}
