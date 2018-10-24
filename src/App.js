import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import React, {Component} from 'react';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import AppBar from '@material-ui/core/AppBar';

import DataExport from './containers/DataExport';
import GroupClone from './containers/GroupClone';
import ContentSearchAndSend from './containers/ContentSearchAndSend';
import MassiveJoin from './containers/MassiveJoin';
import TaskQueue from './containers/TaskQueue';
import Worker, {ACTIONS} from './Worker';
import SendMeme from './tasks/SendMeme';
import JoinChannel from './tasks/JoinChannel';
import CloneGroup from './tasks/JoinChannel';
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
      activeTab: 0,
    };

    this.worker = new Worker();

    document.onkeydown = function(evt) {
      evt = evt || window.event;
      var isEscape = false;
      if ("key" in evt) {
        isEscape = (evt.key == "Escape" || evt.key == "Esc");
      } else {
        isEscape = (evt.keyCode == 27);
      }
      if (isEscape) {
	this.onClickClose();

      }
    }.bind(this);

    /*
    this.worker.push(new SendMeme({ id: 10 }, 'bob'));
    this.worker.push(new SendMeme({ id: 13 }, 'alice'));
    this.worker.push(new SendMeme({ id: 25 }, 'noone'));

    setTimeout(() => { this.worker.push(new SendMeme({ id: 27 }, 'noone')) }, 7000);
    setTimeout(() => { this.worker.push(new SendMeme({ id: 29 }, 'noone')) }, 6000);

    const rule = new MemeDistribution('447984452092@c.us',
				      [],// { id: 55 }, { id: 57 } ],
				      true,
				      10000,
				      1000);
    this.worker.addRule(rule);
    */
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
    this.setState({
      activeTab: 0,
    });
    groups.forEach((group) => {
      this.worker.push(new JoinChannel(group));
    });
  };

  onClickClone = group => {
    this.setState({
      activeTab: 0,
    });
    this.worker.push(new CloneGroup(group));
  };

  onClickMassImageSend = ({contacts, meme}) => {
    this.setState({
      activeTab: 0,
    });
    contacts.forEach((contact) => {
      this.worker.push(new SendMeme(meme, contact.id._serialized));
    });
  };

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
        title: 'Envio de Material',
        content: (
          <ContentSearchAndSend onClickSend={this.onClickMassImageSend} />
        ),
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
      {
        title: 'Fila de execução de tarefas',
        content: <TaskQueue workerState={this.state.workerState} />,
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
