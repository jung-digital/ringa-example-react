import {Model} from 'ringa';

//-------------------------------------
// Executors
//-------------------------------------
export function PopLoading ($controller, $ringaEvent, loadingOverlayModel) {
  loadingOverlayModel.pop();
  $controller.notify($ringaEvent, 'loadingOverlayMessagesChanged');
}

export function ShowLoading(message) {
  return ($controller, $ringaEvent, loadingOverlayModel) => {
    loadingOverlayModel.show(message);
    $controller.notify($ringaEvent, 'loadingOverlayMessagesChanged');
  }
}

//-------------------------------------
// Model
//-------------------------------------
export class LoadingOverlayModel extends Model {
  constructor() {
    super('loadingOverlayModel');

    this.messages = [];
  }

  set messages(value) {
    this._messages = value;
    this.notify();
  }

  get messages() {
    return this._messages;
  }

  get showing() {
    return this.messages.length !== 0;
  }

  show(message) {
    this.messages.push(message);
  }

  pop() {
    this.messages.pop();
  }
}
