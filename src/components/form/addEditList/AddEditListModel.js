import FormBaseModel from '../FormBaseModel';
import List from '../../../valueObjects/List';

export default class AddEditListModel extends FormBaseModel {
  constructor() {
    super();

    this.addProperty('list', new List());
  }
}
