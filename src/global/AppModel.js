import {Model} from 'ringa';

export default class AppModel extends Model {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor() {
    super();

    this.addProperty('loadCount', 0);
    this.addProperty('lists', []);
    this.addProperty('windowScrollAllowed', true);

    this.addProperty('initialized', false);
    this.addProperty('editItem', null); // Can only edit one item at once, so this is on the app model!
    this.addProperty('editList', null); // Can only edit one list at once, so this is on the app model!
  }

  //-----------------------------------
  // Properties
  //-----------------------------------
  get loading() {
    return this.loadCount !== 0;
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  sortList() {

  }

  notify(what) {
    if (what === 'lists') {
      this.sortList();
    }

    super.notify(what);
  }

  pushList(list) {
    this.lists.push(list);
    list.order = this.lists.length - 1;

    this.notify('lists');
  }

  removeListById(id) {
    let ix;

    this.lists.forEach((list, _ix) => {
      if (list.id === id) {
        ix = _ix;
      }
    });

    this.lists.splice(ix, 1);

    this.notify('lists');
  }

  startEditItem(item) {
    item.editing = true;
    this.editItem = item;
  }

  endEditItem() {
    if (this.editItem) {
      this.editItem.editing = false;
      this.editItem = undefined;
    }
  }

  startEditList(list) {
    list.editing = true;
    this.editList = list;
  }

  endEditList() {
    if (this.editList) {
      this.editList.editing = false;
      this.editList = undefined;
    }
  }
}
