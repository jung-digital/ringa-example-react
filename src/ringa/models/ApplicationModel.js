import {Model} from 'ringa';

export default class ApplicationModel extends Model {
  constructor() {
    super('applicationModel');

    this.lists = [];
  }

  set lists(value) {
    this._lists = value;

    this.notify('lists');
  }

  get lists() {
    return this._lists;
  }
}
