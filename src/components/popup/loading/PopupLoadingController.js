import PopupBaseController from '../PopupBaseController';
import PopupLoadingModel from './PopupLoadingModel';

import {event} from 'ringa';

class PopupLoadingController extends PopupBaseController {
  constructor() {
    super();

    this.addModel(new PopupLoadingModel());

    this.getThreadFactoryFor('showPopup').add((popupLoadingModel, message) => {
      popupLoadingModel.pushMessage(message);
    });

    this.getThreadFactoryFor('hidePopup').add((popupLoadingModel, message) => {
      if (message === 'REMOVEALL') {
        popupLoadingModel.messages = [];
      } else {
        popupLoadingModel.popMessage(message);
      }
    });
  }
}

PopupLoadingController.show = (message) => {
  return event('showPopup', { message });
};

PopupLoadingController.hide = (message) => {
  if (!message) {
    message = 'REMOVEALL';
  }

  return event('hidePopup', { message });
};

export default PopupLoadingController;
