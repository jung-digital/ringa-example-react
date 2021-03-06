import {Model} from 'ringa';
import _ from 'lodash';

/**
 * Item is a Ringa Model that contains the values for a single item in a list.
 */
class Item extends Model {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(name, values) {
    super(name, values);

    // DTO
    this.addProperty('title', '');
    this.addProperty('order', 0);

    // State management
    this.addProperty('editing', false);
    this.addProperty('saving', false);
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  serialize() {
    return {
      title: this.title
    };
  }

  toString() {
    return 'Item: ' + this.title;
  }
}

Item.deserialize = function(obj) {
  return new Item(obj.id, obj);
};

Item.mock = function () {
  var item = new Item();

  item.id = Date.now().toString() + Math.random();
  item.title = _.sampleSize(['Lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'Suspendisse', 'ac '], 2).join(' ');

  return item;
};

export default Item;
