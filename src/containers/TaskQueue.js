import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import React, {Component} from 'react';

export default class TaskQueue extends Component {
  render() {
    if (!this.props.workerState) {
      return <div>Fila inicializando...</div>;
    }

    const taskQueue = this.props.workerState.taskQueue;
    const tasks = this.props.workerState.tasks;
    const runningTask = this.props.workerState.runningTask;
    const doneTasks = this.props.workerState.doneTasks;

    const tasksToRender = taskQueue.map(taskId => {
      return tasks[taskId];
    });

    const taskEls = tasksToRender.map(taskDefinition => {
      return (
        <li key={taskDefinition.id}>
          <strong>{taskDefinition.type}</strong> - {taskDefinition.description}
        </li>
      );
    });

    const doneTaskEls = doneTasks.map(taskDefinition => {
      return (
        <li key={taskDefinition.id}>
          <strong>{taskDefinition.type}</strong> - {taskDefinition.description}
        </li>
      );
    });

    return (
      <div>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            Fila de execução - {taskEls.length} tarefas na fila
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            {this.props.workerState.message}
            <ul>{taskEls}</ul>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        {runningTask && (
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              Tarefa em execução
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <strong>{runningTask.type}</strong> - {runningTask.description} -{' '}
              {runningTask.progress} / {runningTask.size}
            </ExpansionPanelDetails>
          </ExpansionPanel>
        )}

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
