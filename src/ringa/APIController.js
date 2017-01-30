import Ringa from 'ringa';

let API_ROOT = process.env.API_ROOT || 'http://localhost:9000';

/**
 * APIController
 */
export default class APIController extends Ringa.Controller {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(domNode) {
    super('API', domNode, {
      timeout: 2000
    });

    // API Events, used below via apiEvent
    this.addListener('GET', ($ringaEvent, url) => {
      let idParam = $ringaEvent.detail.idParam;
      if (idParam && !$ringaEvent.detail[idParam]) {
        throw new Error(`GET Parameter was not provided on RingaEvent detail! ${idParam}`);
      }

      return this.request({url, type: 'GET', id: $ringaEvent.detail[idParam]});
    });

    this.addListener('POST', ($ringaEvent, url, bodyParam) => {
      if (!$ringaEvent.detail[bodyParam]) {
        throw new Error(`POST Parameter was not provided on RingaEvent detail! ${bodyParam}`);
      }

      return this.request({url, type: 'POST', body: $ringaEvent.detail[bodyParam]});
    });

    this.addListener('PUT', ($ringaEvent, url, bodyParam) => {
      if (!$ringaEvent.detail[bodyParam]) {
        throw new Error(`PUT Parameter was not provided on RingaEvent detail! ${bodyParam}`);
      }

      return this.request({url, type: 'PUT', body: $ringaEvent.detail[bodyParam]});
    });

    this.addListener('DELETE', ($ringaEvent, url, idParam) => {
      if (!$ringaEvent.detail[idParam]) {
        throw new Error(`DELETE Parameter was not provided on RingaEvent detail! ${idParam}`);
      }

      return this.request({url, type: 'DELETE', id: $ringaEvent.detail[idParam]});
    });

    this.addListener('getLists', Ringa.event('GET', {
      url: '/list'
    }));

    this.addListener('getList', Ringa.event('GET', {
      url: '/list',
      idParam: 'id'
    }));

    this.addListener('delList', Ringa.event('DELETE', {
      url: '/list',
      idParam: 'id'
    }));

    this.addListener('postList', Ringa.event('POST', {
      url: '/lists',
      bodyParam: 'list'
    }));

    this.addListener('putList', Ringa.event('PUT', {
      url: '/lists',
      bodyParam: 'list'
    }));

    this.addListener('getItems', Ringa.event('GET', {
      url: '/items'
    }));

    this.addListener('getItem',  Ringa.event('GET', {
      url: '/item',
      idParam: 'id'
    }));

    this.addListener('delItem',  Ringa.event('DELETE', {
      url: '/lists',
      idParam: 'id'
    }));

    this.addListener('postItem', Ringa.event('POST', {
      url: '/lists',
      bodyParam: 'item'
    }));

    this.addListener('putItem',  Ringa.event('PUT', {
      url: '/lists',
      bodyParam: 'item'
    }));
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  request(props) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();


      let url = `${API_ROOT}${props.url}`;

      if (props.id) {
        url = `${url}/${props.id}`;
      }

      console.log(url);
      xhr.open(props.type, url, true);

      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.setRequestHeader('Accept', 'application/json');

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          console.error('API Error', xhr);

          reject(xhr.response);
        }
      };

      xhr.send(props.body ? JSON.stringify(props.body) : undefined);
    });
  }
}
