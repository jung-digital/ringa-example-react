import {Model} from 'ringa';

export default class AppModel extends Model {
  constructor() {
    super();

    this.addProperty('lists', []);
    this.addProperty('windowScrollAllowed', true);
  }
}
