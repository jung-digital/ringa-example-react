import List from '../valueObjects/List';

export function SerializeLists($ringaEvent, appModel) {
  if (appModel.lists) {
    appModel.lists.forEach(list => {
      list.destroy();
    });
  }

  $ringaEvent.detail.lists = appModel.lists = $ringaEvent.lastPromiseResult.map(List.deserialize);
}
