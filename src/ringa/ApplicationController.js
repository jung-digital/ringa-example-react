import Ringa from 'ringa';

import { ShowLoading, PopLoading, LoadingOverlayModel } from './modules/LoadingOverlayModule';

import { ProcessLists } from './commands/APICallProcessing';

import APIController from './APIController';
import ApplicationModel from './models/ApplicationModel';

export default class ApplicationController extends Ringa.Controller {
  constructor(domNode) {
    super('ApplicationController', domNode);

    this.addModel(new LoadingOverlayModel());
    this.addModel(new ApplicationModel());

    this.addListener('initialize', [
      () => {
        console.log('yep');
      },
      ShowLoading('Loading Lists'),
      APIController.GET_LISTS,
      ProcessLists,
      PopLoading
    ]);
  }

  busMounted() {
    this.dispatch('initialize');
  }
}
