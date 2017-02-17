import {Model} from 'ringa';

class List extends Model {
  constructor(name, values) {
    super(name, values);

    this.addProperty('title', '[TITLE NOT SET]');
    this.addProperty('description', '[DESCRIPTION NOT SET]');
    this.addProperty('order', 0);
    this.addProperty('items', []);

    // Set to true when the child items are loading so we can display a loader on the list.
    this.addProperty('loading', true);
  }

  get itemIds() {
    return this.items.map(item => typeof item === 'string' ? item : item.id);
  }

  pushItem(item) {
    this.items.push(item);

    this.notify('items');
  }

  serialize() {
    console.log('SERIALIZING');
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      items: this.items.map(item => item.id),
      order: this.order
    };
  }
}

List.deserialize = function(obj) {
  return new List(obj.id, obj);
};

export default List;
