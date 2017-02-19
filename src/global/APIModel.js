import {Model} from 'ringa';

export default class APIModel extends Model {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor() {
    super();

    this.addProperty('calls', 0);
    this.addProperty('activeCalls', 0);
  }
}
