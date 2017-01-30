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
export class LoadingOverlayModel {
  constructor() {
    this.messages = [];
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
