import Ringa, { event } from 'ringa';

import { ShowLoading, PopLoading, LoadingModel} from './modules/LoadingOverlayModule';

import {ProcessLists} from './commands/APICallProcessing';

import APIController from './APIController';
import ApplicationModel from './models/ApplicationModel';

export default class RingaExampleApplicationController extends Ringa.Controller {
  constructor(domNode) {
    super('RingaExampleApplicationController', domNode);

    this.api = new APIController(domNode);

    this.injections.loadingModel = new LoadingModel();
    this.injections.model = new ApplicationModel();

    this.addListener('initialize', [
      ShowLoading('Loading Lists'),
      APIController.GET_LISTS,
      ProcessLists,
      PopLoading
    ]);

    this.dispatch('initialize');
  }
}
