import PopupBaseModel from '../popupBase/PopupBaseModel';

class PopupLoadingModel extends PopupBaseModel {
  constructor() {
    super();

    this.addProperty('messages', []);
  }

  pushMessage(message) {
    this.messages.push(message);

    this.notify('messages');
  }

  popMessage(message) {
    let ix = this.messages.indexOf(message);
    this.messages.splice(ix, 1);

    this.notify('messages');
  }
}

export default PopupLoadingModel;
