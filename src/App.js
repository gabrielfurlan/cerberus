import React, {Component} from 'react';

import Button from './components/Button';
import MassiveJoin from './containers/MassiveJoin';
import Tabs from './components/Tabs';
import TaskQueue from './containers/TaskQueue';
import Worker, {ACTIONS} from './Worker';
import SendMeme from './tasks/SendMeme';
import MemeDistribution from './rules/MemeDistribution';

// This line executes the old jQuery application
import './logic/legacy-run';

/**
 * Application entry-point
 */

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: true,
    };

    this.worker = new Worker();
    console.log('push');
    this.worker.push(new SendMeme({ id: 10 }, 'bob'));
    this.worker.push(new SendMeme({ id: 13 }, 'alice'));
    this.worker.push(new SendMeme({ id: 25 }, 'noone'));

    setTimeout(() => { this.worker.push(new SendMeme({ id: 27 }, 'noone')) }, 7000);
    setTimeout(() => { this.worker.push(new SendMeme({ id: 29 }, 'noone')) }, 6000);

    const rule = new MemeDistribution('a channel',
				      [ { id: 55 }, { id: 57 } ],
				      false,
				      10000,
				      1000);
    this.worker.addRule(rule);
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState({
        workerState: this.worker.getState(),
        now: new Date().getTime(),
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  /*
   * Global UI
   */

  onClickOpen = () => {
    this.setState({
      collapsed: false,
    });
  };

  onClickClose = () => {
    this.setState({
      collapsed: true,
    });
  };

  /*
   * Actions
   */

  onClickJoin = groups => {
    this.worker.push({
      type: ACTIONS.MASSIVE_JOIN,
      description: `Entrando em ${groups.length} grupos`,
      size: groups.length,
      payload: {
        groups,
      },
    });
  };

  onClickSend = message => {};

  render() {
    if (this.state.collapsed) {
      return (
        <div
          onClick={this.onClickOpen}
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            bottom: 0,
            height: 20,
            padding: 20,
            position: 'fixed',
            right: 0,
            color: 'white',
            textAlign: 'right',
          }}
        >
          +
        </div>
      );
    }

    return (
      <div
        style={{
          color: 'white',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          overflow: 'scroll',
          bottom: 0,
          height: '100%',
          padding: 0,
          position: 'fixed',
          right: 0,
          width: '100%',
          color: 'white',
        }}
      >
        <div style={{padding: 15}}>
          <Button
            style={{color: 'white', fontSize: 16}}
            onClick={this.onClickClose}
          >
            Fechar funções extras
          </Button>

          <hr />

          <Tabs
            tabs={[
              {
                title: 'Fila de execução de tarefas',
                content: <TaskQueue workerState={this.state.workerState} />,
              },
              {
                title: 'Ingresso Massivo em Grupos',
                content: <MassiveJoin onClickJoin={this.onClickJoin} />,
              },
              {
                title: 'Configurações',
                content: 'TODO',
              },
            ]}
          />
        </div>
      </div>
    );
  }
}
