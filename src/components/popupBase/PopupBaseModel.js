import {Model} from 'ringa';

export default class PopupModel extends Model {
  constructor() {
    super();

    this.addProperty('show', false);
    this.addProperty('overlay', false);
    this.addProperty('opacity', 0);
  }
}
