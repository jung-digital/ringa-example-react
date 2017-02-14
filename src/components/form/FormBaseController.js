import {Controller} from 'ringa';

import FormBaseModel from './FormBaseModel';

export default class FormBaseController extends Controller {
  constructor() {
    super();

    // This Controller assumes that the class that extends it (e.g. AddEditItemForm) will add
    // its own model that extends FormBaseModel. As a result, our injection is a callback that
    // finds the model dynamically since we do not know what that model is right now.
    this.injections.formModel = () => this.modelWatcher.find(FormBaseModel);
  }
}
