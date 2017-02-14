import {Model} from 'ringa';

export default class FormBaseModel extends Model {
  constructor() {
    super();

    this.addProperty('validationErrors', []);
  }

  get valid() {
    return this.validationErrors.length === 0;
  }
}
