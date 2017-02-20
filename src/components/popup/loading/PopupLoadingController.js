import PopupBaseController from '../PopupBaseController';
import PopupLoadingModel from './PopupLoadingModel';

import {event} from 'ringa';

/**
 * Here we extend another controller! This allows us to add to its threads at runtime.
 */
class PopupLoadingController extends PopupBaseController {
  constructor() {
    super();

    this.addModel(new PopupLoadingModel());

    /**
     * getThreadFactoryFor lets us manipulate a thread setup by our base class. Here we tack a new
     * command onto the end of the thread.
     */
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

/**
 * Create a static function that allows us to return a custom formatted executor for use in a Controller thread.
 */
PopupLoadingController.show = (message) => {
  return event('showPopup', { message });
};

/**
 * Create a static function that allows us to return a custom formatted executor for use in a Controller thread.
 */
PopupLoadingController.hide = (message) => {
  message = message || 'REMOVEALL';

  return event('hidePopup', { message });
};

export default PopupLoadingController;
