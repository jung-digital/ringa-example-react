import Ringa from 'ringa';

import PopupLoadingController from './popupLoading/PopupLoadingController';
import PopupLoadingModel from './popupLoading/PopupLoadingModel';

import { ProcessLists } from '../ringa/executors/APICallProcessing';

import APIController from '../ringa/APIController';
import ApplicationModel from './AppModel';

export default class ApplicationController extends Ringa.Controller {
  constructor() {
    super();

    this.addModel(new PopupLoadingModel());
    this.addModel(new ApplicationModel());

    this.addListener('initialize', [
      PopupLoadingController.show('Loading Lists...'),
      APIController.GET_LISTS,
      (done) => {
        setTimeout(done, 1000);
      },
      ProcessLists,
      PopupLoadingController.hide()
    ]);

    this.addListener('showPopup', appModel => {
      appModel.windowScrollAllowed = false;
    });

    this.addListener('hidePopup', appModel => {
      appModel.windowScrollAllowed = true;
    });
  }

  busMounted() {
    this.dispatch('initialize');
  }
}
