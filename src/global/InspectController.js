import {Controller, iif} from 'ringa';
import {domNodeToNearestReactComponent, domNodeToNearestReactComponentDomNode, walkReactParents} from 'react-ringa';
import InspectModel from './InspectModel';

/**
 * The InspectController monitors mouse movements using capture and then inspects the item you have selected.
 */
export default class InspectController extends Controller {
  /**
   * Constructs the InspectController. Constructed and attached in App.js.
   */
  constructor() {
    super();

    this.addModel(new InspectModel());

    let isDebugEvent = (event) => {
      return event.altKey && event.shiftKey;
    };

    let inspectingDOMNode;

    let highlight = (event, inspectModel) => {
      let target = domNodeToNearestReactComponentDomNode(event.target);

      if (inspectingDOMNode === target) {
        return;
      } else if (inspectingDOMNode) {
        inspectingDOMNode.className = inspectingDOMNode.className.replace(' inspecting', '');
      }

      let cn = target.className;

      if (cn.indexOf('inspectingDOMNode') === -1) {
        target.className += ' inspecting';
      }

      inspectingDOMNode = event.target;

      let component = domNodeToNearestReactComponent(inspectingDOMNode);

      if (component) {
        let components = walkReactParents(component);
        let controllersByClass = {};
        let componentsByClass = {};
        let injectionsByKey = {};
        let modelsByName = {};

        let arr = ['Ringa Inspect', 'React Components:'];
        components.forEach(component => {
          componentsByClass[component.constructor.name] = component;

          let substr = '';

          if (component.$ringaControllers) {
            substr += component.$ringaControllers.map(controller => controller.constructor.name).join(', ');

            component.$ringaControllers.forEach(controller => {
              controllersByClass[controller.constructor.name] = controller;

              for (var key in controller.injections) {
                injectionsByKey[key] = controller.injections[key];
              }

              if (controller.modelWatcher) {
                controller.modelWatcher.models.forEach(model => {
                  modelsByName[model.name] = model;
                });
              }
            });
          }

          if (component.constructor.name) {
            arr.push(' - ' + component.constructor.name + (substr !== '' ? ` (Attached Controllers: ${substr})` : ''));
          }
        });

        arr.push('[BREAK]');
        arr.push('Injections: ' + Object.keys(injectionsByKey).sort().join(', '));
        arr.push('[BREAK]');
        arr.push('Models: ' + Object.keys(modelsByName).sort().join(', '));
        arr.push('Click now to console log');

        inspectModel.inspectee = {
          stack: arr,
          all: {
            componentsByClass,
            controllersByClass,
            injectionsByKey,
            modelsByName
          }
        };

        /**
         * Do we display the inspector at the top or bottom?
         */
        inspectModel.top = event.pageY > window.innerHeight / 2;
      }

      event.stopPropagation();
    };

    let unhighlight = (event, inspectModel) => {
      if (inspectingDOMNode) {
        inspectingDOMNode.className = inspectingDOMNode.className.replace(' inspecting', '');
      }

      inspectModel.inspectee = null;
    };

    let stopPropagation = (event) => {
      event.stopPropagation();
    };

    let inspect = (event, inspectModel) => {
      console.log(inspectModel.inspectee.all);

      event.stopPropagation();
    };

    this.addListener('mousemove', iif(isDebugEvent, highlight, unhighlight), true);
    this.addListener('mousedown', iif(isDebugEvent, stopPropagation), true);
    this.addListener('mouseup',   iif(isDebugEvent, inspect), true);
    this.addListener('click',     iif(isDebugEvent, stopPropagation), true);
  }
}
