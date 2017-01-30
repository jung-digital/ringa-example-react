import Ringa, { notify } from 'ringa';

import { ShowLoading, PopLoading, LoadingOverlayModel} from './modules/LoadingOverlayModule';

import {ProcessLists} from './commands/APICallProcessing';

import APIController from './APIController';
import ApplicationModel from './models/ApplicationModel';

export default class RingaExampleApplicationController extends Ringa.Controller {
  constructor(domNode) {
    super('RingaExampleApplicationController', domNode);

    this.api = new APIController(domNode);

    this.injections.loadingOverlayModel = new LoadingOverlayModel();
    this.injections.model = new ApplicationModel();

    this.addListener('initialize', [
      ShowLoading('Loading Lists'),
      APIController.GET_LISTS,
      ProcessLists,
      notify('viewListsUpdated'),
      PopLoading
    ]);

    this.dispatch('initialize');
  }
}
