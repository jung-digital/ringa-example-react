import React from 'react';
import {depend, dependency} from 'react-ringa';
import AppModel from '../../global/AppModel';
import {InspectorModel} from 'ringa';
import classnames from 'classnames';

import './Inspector.scss';

let d = (v) => {
  return isNaN(v) ? '' : v;
};

export default class Inspector extends React.Component {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(props) {
    super(props);

    depend(this, dependency(AppModel, 'showInspector'));
    depend(this, dependency(InspectorModel, 'threads'))

    this.commitHandler = this.commitHandler.bind(this);
    this.resetHandler = this.resetHandler.bind(this);
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  renderThread(thread) {
    return <div key={thread.id} className="object" onClick={() => {console.log(thread)}}>{thread.toString()}</div>;
  }

  renderExecutor(executor) {
    return <div key={executor.id} className="object" onClick={() => {console.log(executor)}}>{executor.toString()}</div>;
  }

  renderRingaObject(ringaObject) {
    return <div key={ringaObject.id} className="object" onClick={() => {console.log(ringaObject)}}>{ringaObject.toString()}</div>;
  }

  ringaObjectSort(a, b) {
    return a.toString().toLowerCase() > b.toString().toLowerCase() ? 1 : -1;
  }

  render() {
    let showInspector = this.state.showInspector;

    if (!this.state.inspectorModel) {
      return null;
    }

    let {inspectorModel} = this.state;

    let c = classnames({
      inspector: true,
      show: showInspector
    });

    return <div className={c}>
      <div className="inspector-content">
        <div>Ringa Inspector (use the application and watch updates here)</div>

        <div className="panels">
          <div className="panel settings">
            <div className="title">Throttle Settings</div>
            <div className="subtitle">Slows every executor</div>
            <div className="panel-content">
              <div className="detail">
                <div className="label">Min (ms)</div>
                <input ref="tMin" defaultValue={d(window.__generalControllerOptions.throttle.min)} placeholder="0" />
              </div>

              <div className="detail">
                <div className="label">Max (ms)</div>
                <input ref="tMax" defaultValue={d(window.__generalControllerOptions.throttle.max)} placeholder="0" />
              </div>

              <div className="detail">
                <div className="label">API Min (ms)</div>
                <input ref="tMinApi" defaultValue={d(window.__apiControllerOptions.throttle.min)} placeholder="0" />
              </div>

              <div className="detail">
                <div className="label">API Max (ms)</div>
                <input ref="tMaxApi" defaultValue={d(window.__apiControllerOptions.throttle.max)} placeholder="0" />
              </div>

              <div className="btn reset" onClick={this.resetHandler}>Reset</div>
              <div className="btn commit" onClick={this.commitHandler}>Commit...</div>
            </div>
          </div>
          <div className="panel threads">
            <div className="title">Active Threads ({inspectorModel.threads.length})</div>
            <div className="subtitle">Click to console log</div>
            <div className="panel-content">
              {inspectorModel.threads.map(this.renderThread)}
            </div>
          </div>
          <div className="panel executors">
            <div className="title">Active Executors ({inspectorModel.executors.length})</div>
            <div className="subtitle">Click to console log</div>
            <div className="panel-content">
              {inspectorModel.executors.map(this.renderExecutor)}
            </div>
          </div>
          <div className="panel ringa-objects">
            <div className="title">Ringa Objects ({inspectorModel.ringaObjects ? inspectorModel.ringaObjects._list.length : 'N/A'})</div>
            <div className="subtitle">Click to console log</div>
            <div className="panel-content">
              {inspectorModel.ringaObjects ? inspectorModel.ringaObjects._list.sort(this.ringaObjectSort).map(this.renderRingaObject) : 'N/A'}
            </div>
          </div>
        </div>
      </div>
    </div>;
  }

  resetHandler() {
    window.__generalControllerOptions.throttle.min = undefined;
    window.__generalControllerOptions.throttle.max = undefined;
    window.__apiControllerOptions.throttle.min = undefined;
    window.__apiControllerOptions.throttle.max = undefined;

    this.refs.tMin.value = this.refs.tMax.value = this.refs.tMinApi.value = this.refs.tMaxApi.value = '';

    window.updateQuery();

    this.forceUpdate();
  }

  commitHandler() {
    let tMin = Math.min(parseInt(this.refs.tMin.value), 100);
    let tMax = Math.min(Math.max(tMin, parseInt(this.refs.tMax.value)), 200);
    let tMinApi = Math.min(parseInt(this.refs.tMinApi.value), 1000);
    let tMaxApi = Math.min(Math.max(tMinApi, parseInt(this.refs.tMaxApi.value)), 2000);

    window.__generalControllerOptions.throttle.min = tMin;
    window.__generalControllerOptions.throttle.max = tMax;
    window.__apiControllerOptions.throttle.min = tMinApi;
    window.__apiControllerOptions.throttle.max = tMaxApi;

    this.refs.tMin.value = d(tMin);
    this.refs.tMax.value = d(tMax);
    this.refs.tMinApi.value = d(tMinApi);
    this.refs.tMaxApi.value = d(tMaxApi);

    window.updateQuery();
  }
}
