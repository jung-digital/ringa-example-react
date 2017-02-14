import List from '../valueObjects/List';

export function SerializeLists($ringaEvent, appModel) {
  appModel.lists = $ringaEvent.lastPromiseResult.map(List.deserialize);
}
