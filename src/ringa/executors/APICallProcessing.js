export function ProcessLists($lastEvent, appModel) {
  // initialize -> ringaEvent
  // getLists -> ringaEvent.detail.$lastEvent
  // GET -> ringaEvent.detail.$lastEvent.detail.$lastEvent
  appModel.lists = $lastEvent.detail.$lastEvent.lastPromiseResult;
}
