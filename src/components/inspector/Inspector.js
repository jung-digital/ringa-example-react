import React from 'react';
import {depend, dependency} from 'react-ringa';
import AppModel from '../../global/AppModel';
import {InspectorModel} from 'ringa';
import classnames from 'classnames';

import './Inspector.scss';

export default class Inspector extends React.Component {
  constructor(props) {
    super(props);

    depend(this, dependency(AppModel, 'showInspector'));
    depend(this, dependency(InspectorModel, 'threads'))

    this.commitHandler = this.commitHandler.bind(this);
  }

  renderThread(thread) {
    return <div key={thread.id} className="object" onClick={() => {console.log(thread)}}>{thread.name}</div>;
  }

  renderExecutor(executor) {
    return <div key={executor.id} className="object" onClick={() => {console.log(executor)}}>{executor.name}</div>;
  }

  renderRingaObject(ringaObject) {
    return <div key={ringaObject.id} className="object" onClick={() => {console.log(ringaObject)}}>{ringaObject.name}</div>;
  }

  ringaObjectSort(a, b) {
    return a.name > b.name ? 1 : -1;
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

    let d = (v) => {
      return isNaN(v) ? undefined : v;
    };

    return <div className={c}>
      <div className="inspector-content">
        <div>Ringa Inspector</div>

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

              <div className="commit" onClick={this.commitHandler}>Commit...</div>
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

  commitHandler() {
    window.__generalControllerOptions.throttle.min = parseInt(this.refs.tMin.value);
    window.__generalControllerOptions.throttle.max = parseInt(this.refs.tMax.value);
    window.__apiControllerOptions.throttle.min = parseInt(this.refs.tMinApi.value);
    window.__apiControllerOptions.throttle.max = parseInt(this.refs.tMaxApi.value);

    window.updateQuery();
  }
}
