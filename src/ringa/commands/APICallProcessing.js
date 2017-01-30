export function ProcessLists($lastEvent, model) {
  // initialize -> ringaEvent
  // getLists -> ringaEvent.detail.$lastEvent
  // GET -> ringaEvent.detail.$lastEvent.detail.$lastEvent
  model.lists = $lastEvent.detail.$lastEvent.lastPromiseResult;

  console.log('PROCESSING', model);
}
