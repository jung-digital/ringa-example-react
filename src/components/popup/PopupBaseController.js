import {Controller, interval} from 'ringa';

import PopupBaseModel from './PopupBaseModel';

export default class PopupBaseController extends Controller {
  constructor() {
    super();

    // Custom injections can be a function. When they are a function they are evaluated dynamically.
    this.injections.popupModel = () => this.modelWatcher.find(PopupBaseModel);

    //---------------------------------
    // SHOW_POPUP
    //---------------------------------
    this.addListener('showPopup', popupModel => {
      popupModel.opacity = 1;
      popupModel.show = true;
    });

    //---------------------------------
    // HIDE_POPUP
    //---------------------------------
    this.addListener('hidePopup', [
      /**
       * The interval() executor runs every N millis (7 in this case) and runs an executor until
       * the condition is met. So in this case the opacity is decreased until it hits 0 and then
       * we set popupModel.show to false.
       *
       * Note: you should use CSS3 transitions for this. This is only for demonstration.
       */
      interval(popupModel => popupModel.opacity > 0, popupModel => {
        popupModel.opacity -= 0.01;
      }, 7),
      popupModel => {
        popupModel.show = false;
      }]);
  }
}
