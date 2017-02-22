import {Model} from 'ringa';

export default class AppModel extends Model {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(name) {
    super(name);

    this.addProperty('lists', []);
    this.addProperty('windowScrollAllowed', true);
    this.addProperty('tempMessage', true);

    this.addProperty('initialized', false);
    this.addProperty('editItem', null);
    this.addProperty('editList', null);
    this.addProperty('showInspector', false);
  }

  //-----------------------------------
  // Properties
  //-----------------------------------
  get editing() {
    return this.editItem || this.editList;
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
