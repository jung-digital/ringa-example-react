import {Controller, interval} from 'ringa';

import PopupBaseModel from './PopupBaseModel';

export default class PopupController extends Controller {
  constructor() {
    super();

    this.injections.popupModel = () => this.modelWatcher.find(PopupBaseModel);

    this.addListener('showPopup', popupModel => {
      popupModel.opacity = 1;
      popupModel.show = true;
    });

    this.addListener('hidePopup', [
      interval(popupModel => popupModel.opacity > 0, popupModel => {
        popupModel.opacity -= 0.01;
      }, 7),
      popupModel => {
        popupModel.show = false;
      }]);
  }
}
