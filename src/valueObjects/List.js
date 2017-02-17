import {Model} from 'ringa';

class List extends Model {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  /**
   * Build a List.
   *
   * @param name The name of this list. Not the same as the id! Names can exist more than once in Ringa. Ids cannot.
   * @param values Optional POJO with values to populate into this List.
   */
  constructor(name, values) {
    super(name, values);

    this.addProperty('title', '[TITLE NOT SET]');
    this.addProperty('description', '[DESCRIPTION NOT SET]');
    this.addProperty('order', 0);
    this.addProperty('items', []);

    // Set to true when the child items are loading so we can display a loader on the list.
    this.addProperty('loading', true);
    this.addProperty('editing', false);
  }

  //-----------------------------------
  // Properties
  //-----------------------------------
  get itemIds() {
    return this.items.map(item => typeof item === 'string' ? item : item.id);
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  /**
   * Destroy is a Ringa concept (similar to a destructor function) that guarantees that no two objects are allowed to
   * have the same id without a warning in your application. This helps keeps the data in your application normalized
   * and also helps improve performance by eliminating memory leaks. If destroy is not called, and another object with
   * the same id is created, then a warning appears in your console.
   */
  destroy() {
    super.destroy();

    this.destroyAllItems();
  }

  /**
   * Adds an item to the internal array and notifies the display the change has taken place.
   *
   * This is necessary since changing an Array's index cannot easily be watched.
   *
   * @param item
   */
  pushItem(item) {
    this.items.push(item);

    this.notify('items');
  }

  /**
   * Calls destroy on every item in the List. Used when all the items in the list are being reloaded from the server.
   */
  destroyAllItems() {
    this.items.forEach(item => {
      if (item.destroy) item.destroy()
    });
  }

  /**
   * Convert this List into a simple Javascript Object to be sent to the server.
   *
   * Note that our server for this demo only stores the id of the items so we only save that area.
   *
   * @returns {{id: *, title, description, items, order: (number)}}
   */
  serialize() {
    return {
      title: this.title,
      description: this.description,
      items: this.items.map(item => item.id),
      order: this.order
    };
  }
}

/**
 * Convert a simple Javascript object into a list. Used when data is returned from the server.
 *
 * @param obj A POJO.
 * @returns {List} The new List object, ready for injection into the view layer.
 */
List.deserialize = function(obj) {
  return new List(obj.id, obj);
};

export default List;
