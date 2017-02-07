export function ProcessLists($lastEvent, applicationModel) {
  // initialize -> ringaEvent
  // getLists -> ringaEvent.detail.$lastEvent
  // GET -> ringaEvent.detail.$lastEvent.detail.$lastEvent
  console.log('SETTING LISTS', $lastEvent.detail.$lastEvent.lastPromiseResult);
  applicationModel.lists = $lastEvent.detail.$lastEvent.lastPromiseResult;
}
