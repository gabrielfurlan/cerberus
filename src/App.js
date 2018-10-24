import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import React, {Component} from 'react';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import AppBar from '@material-ui/core/AppBar';

import DataExport from './containers/DataExport';
import GroupClone from './containers/GroupClone';
import MassiveJoin from './containers/MassiveJoin';
import TaskQueue from './containers/TaskQueue';
import Worker, {ACTIONS} from './Worker';

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
      activeTab: 0,
    };

    this.worker = new Worker();
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

  onClickClone = group => {
    this.worker.push({
      type: ACTIONS.CLONE_GROUP,
      description: `Clonando grupo ${group.contact.name}`,
      size: 1,
      payload: {
        group,
      },
    });
  };

  onClickSend = message => {};

  render() {
    if (this.state.collapsed) {
      return (
        <Button
          onClick={this.onClickOpen}
          variant="fab"
          color="primary"
          aria-label="Abrir"
          style={{
            bottom: 5,
            position: 'fixed',
            right: 5,
          }}
        >
          <AddIcon />
        </Button>
      );
    }

    const tabs = [
      {
        title: 'Fila de execução de tarefas',
        content: <TaskQueue workerState={this.state.workerState} />,
      },
      {
        title: 'Ingresso Massivo em Grupos',
        content: <MassiveJoin onClickJoin={this.onClickJoin} />,
      },
      {
        title: 'Clonagem de Grupos',
        content: <GroupClone onClickClone={this.onClickClone} />,
      },
      {
        title: 'Exportação de dados',
        content: <DataExport />,
      },
      // {
      //   title: 'Configurações',
      //   content: 'TODO',
      // },
    ];

    return (
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          overflow: 'scroll',
          bottom: 0,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          position: 'fixed',
          right: 0,
          width: '100%',
        }}
      >
        <AppBar position="static">
          <Tabs
            value={this.state.activeTab}
            onChange={(event, activeTab) => this.setState({activeTab})}
            scrollable
            scrollButtons="auto"
          >
            {tabs.map((tab, i) => <Tab key={i} label={tab.title} />)}
          </Tabs>
        </AppBar>

        <div style={{flex: 1, padding: 15}}>
          {tabs[this.state.activeTab].content}
        </div>

        <div style={{padding: 5, textAlign: 'right'}}>
          <Button
            variant="contained"
            color="secondary"
            style={{color: 'white', fontSize: 16}}
            onClick={this.onClickClose}
          >
            Fechar funções extras
          </Button>
        </div>
      </div>
    );
  }
}
