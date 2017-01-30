//-------------------------------------
// Executors
//-------------------------------------
export function PopLoading (loadingModel) {
  loadingModel.hide();
}

export function ShowLoading(message) {
  return (loadingModel) => {
    loadingModel.show(message);
  }
}

//-------------------------------------
// Model
//-------------------------------------
export class LoadingModel {
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
