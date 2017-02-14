import List from '../valueObjects/List';

export function SerializeLists($ringaEvent, appModel) {
  if (appModel.lists) {
    appModel.lists.forEach(list => {
      list.destroy();
    });
  }

  appModel.lists = $ringaEvent.lastPromiseResult.map(List.deserialize);
}
