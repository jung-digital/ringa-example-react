import {Model} from 'ringa';

/**
 * Models can be super simple! In this case we just have three properties with defaults.
 */
export default class PopupBaseModel extends Model {
  constructor() {
    super();

    this.addProperty('show', false);
    this.addProperty('overlay', false);
    this.addProperty('opacity', 0);
  }
}
