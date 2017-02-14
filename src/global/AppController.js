import {Controller} from 'ringa';

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
      ($ringaEvent) => {
        // Create an empty item to save, which is required by APIController.POST_ITEM
        $ringaEvent.detail.item = new Item();
      },
      APIController.POST_ITEM,
      ($lastPromiseResult, list) => {
      console.log(list);
        list.pushItem(Item.deserialize($lastPromiseResult));
      }
    ]);

    this.addListener('deleteList', [
      APIController.DEL_LIST,
      AppController.REFRESH_LISTS
    ]);

    // AppController.INITIALIZE
    this.addListener('initialize', [
      PopupLoadingController.show('Loading Lists...'),
      AppController.REFRESH_LISTS,
      PopupLoadingController.hide()
    ]);
  }

  busMounted() {
    // We cannot dispatch until we know for sure the bus is ready to distribute our event!
    this.dispatch('initialize');
  }
}
