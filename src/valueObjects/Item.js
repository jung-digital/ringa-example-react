import {Model} from 'ringa';
import _ from 'lodash';

/**
 * Item is a Ringa Model that contains the values
 */
class Item extends Model {
  constructor(name, values) {
    super(name, values);

    this.addProperty('title', '[TITLE NOT SET]');
    this.addProperty('description', '[DESCRIPTION NOT SET]');
    this.addProperty('order', 0);
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
