import FormBaseController from '../FormBaseController';
import AddEditListModel from './AddEditListModel';

import {event} from 'ringa';

class PopupLoadingController extends FormBaseController {
  constructor() {
    super();

    this.addModel(new AddEditListModel());

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
