import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import LinearProgress from '@material-ui/core/LinearProgress';
import React, {Component} from 'react';

export default class TaskQueue extends Component {
  render() {
    if (!this.props.workerState) {
      return <div>Fila inicializando...</div>;
    }

    const queue = this.props.workerState.queue;
    const tasks = this.props.workerState.tasks;
    const done = this.props.workerState.done;

    const tasksToRender = queue.map(taskId => {
      return tasks[taskId];
    });

    const taskEls = tasksToRender.map(taskDefinition => {
      return (
        <li key={taskDefinition.id}>
          <strong>{taskDefinition.type}</strong> - {taskDefinition.description}
        </li>
      );
    });

    const doneTaskEls = done.map(taskDefinition => {
      return (
        <li key={taskDefinition.id}>
          <strong>{taskDefinition.type}</strong> - {taskDefinition.description}
        </li>
      );
    });

    return (
      <div>
        <h1 style={{textAlign: 'center', marginBottom: 15, fontWeight: 'bold'}}>
          {this.props.workerState.message}
        </h1>

        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            Fila de execução - {taskEls.length} tarefas na fila
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <ul>{taskEls}</ul>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            Tarefas executadas - {doneTaskEls.length} tarefas executadas
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <ul>{doneTaskEls}</ul>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  }
}
