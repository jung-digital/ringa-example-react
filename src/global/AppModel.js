import {Model} from 'ringa';

export default class AppModel extends Model {
  constructor() {
    super();

    this.addProperty('loadCount', 0);
    this.addProperty('lists', []);
    this.addProperty('windowScrollAllowed', true);

    this.addProperty('editItem', null); // Can only edit one item at once, so this is on the app model!
    this.addProperty('editList', null); // Can only edit one list at once, so this is on the app model!
  }

  get loading() {
    return this.loadCount !== 0;
  }
}
