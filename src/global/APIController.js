import Ringa, {event} from 'ringa';

let API_ROOT = process.env.API_ROOT || 'http://localhost:9000';

/**
 * APIController
 */
export default class APIController extends Ringa.Controller {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(domNode) {
    super('APIController', domNode, {
      timeout: 5000
    });

    //------------------------------------
    // GET, POST, PUT, DELETE
    //------------------------------------

    // APIController.GET
    this.addListener('GET', ($ringaEvent, url) => {
      let idParam = $ringaEvent.detail.idParam;
      if (idParam && !$ringaEvent.detail[idParam]) {
        throw new Error(`GET Parameter '${idParam}' was not provided on RingaEvent detail!`);
      }

      return this.request({url, type: 'GET', id: $ringaEvent.detail[idParam]});
    });

    // APIController.POST
    this.addListener('POST', ($ringaEvent, url, bodyParam) => {
      if (!$ringaEvent.detail[bodyParam]) {
        throw new Error(`POST Parameter '${bodyParam}' was not provided on RingaEvent detail!`);
      }

      return this.request({url, type: 'POST', body: $ringaEvent.detail[bodyParam]});
    });

    // APIController.PUT
    this.addListener('PUT', ($ringaEvent, url, bodyParam) => {
      if (!$ringaEvent.detail[bodyParam]) {
        throw new Error(`PUT Parameter '${bodyParam}' was not provided on RingaEvent detail! `);
      }

      return this.request({url, type: 'PUT', body: $ringaEvent.detail[bodyParam], id: $ringaEvent.detail[bodyParam].id});
    });

    // APIController.DELETE
    this.addListener('DELETE', ($ringaEvent, url, idParam) => {
      if (!$ringaEvent.detail[idParam]) {
        throw new Error(`DELETE Parameter '${idParam}' was not provided on RingaEvent detail!`);
      }

      return this.request({url, type: 'DELETE', id: $ringaEvent.detail[idParam]});
    });

    //------------------------------------
    // Lists / Items CRUD
    //------------------------------------

    // APIController.GET_LISTS
    this.addListener('getLists', event(APIController.GET, {
      url: '/list'
    }));

    // APIController.GET_LIST
    this.addListener('getList', event(APIController.GET, {
      url: '/list',
      idParam: 'listId'
    }));

    // APIController.DEL_LIST
    this.addListener('delList', event(APIController.DELETE, {
      url: '/list',
      idParam: 'listId'
    }));

    // APIController.POST_LIST
    this.addListener('postList', event(APIController.POST, {
      url: '/list',
      bodyParam: 'list' // Expect dispatched RingaEvent::detail to have a 'list' property
    }));

    // APIController.PUT_LIST
    this.addListener('putList', event(APIController.PUT, {
      url: '/list',
      bodyParam: 'list' // Expect dispatched RingaEvent::detail to have a 'list' property
    }));

    // APIController.GET_ITEMS
    this.addListener('getItems', event(APIController.GET, {
      url: '/items',
      idParam: 'itemIds'
    }));

    // APIController.DELETE_ITEM
    this.addListener('deleteItem', event(APIController.DELETE, {
      url: '/items',
      idParam: 'itemId'
    }));

    // APIController.POST_ITEM
    this.addListener('postItem', event(APIController.POST, {
      url: '/items',
      bodyParam: 'item' // Expect dispatched RingaEvent::detail to have a 'item' property
    }));

    // APIController.PUT_ITEM
    this.addListener('putItem',  event(APIController.PUT, {
      url: '/items',
      bodyParam: 'item' // Expect dispatched RingaEvent::detail to have a 'item' property
    }));
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  request(props) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      let url = `${API_ROOT}${props.url}`;

      if (props.body && props.body.serialize) {
        props.body = props.body.serialize();
      }

      if (props.id) {
        url = `${url}/${props.id}`;
      }

      console.log(`${props.type} ${url}`, props.body);

      xhr.open(props.type, url, true);

      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.setRequestHeader('Accept', 'application/json');

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          let parsedResponse;

          try {
            parsedResponse = xhr.response ? JSON.parse(xhr.response) : undefined;
          } catch (error) {

          }

          console.log('API RESULT', props, parsedResponse);

          resolve(parsedResponse);
        } else {
          console.error('API Error', xhr);

          reject(JSON.parse(xhr.response));
        }
      };

      xhr.send(props.body ? JSON.stringify(props.body) : undefined);
    });
  }
}
