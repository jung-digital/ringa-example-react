import {Controller} from 'ringa';

import PopupBaseModel from './PopupBaseModel';

export default class PopupController extends Controller {
  constructor() {
    super();

    this.injections.popupModel = () => this.modelWatcher.find(PopupBaseModel);

    this.addListener('showPopup', popupModel => {
      popupModel.opacity = 1;
      popupModel.show = true;
    });

    this.addListener('hidePopup', (popupModel, done) => {
      let i = setInterval(() => {
        popupModel.opacity -= 0.01;

        if (popupModel <= 0) {
          popupModel.opacity = 0;
          popupModel.show = false;

          clearInterval(i);
          done();
        }
      }, 7);
    });
  }
}
