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
      <div style={{display: 'flex'}}>
        <div style={{flex: 1}}>
          <h2>Fila de execução - {taskEls.length} tarefas na fila</h2>
          <hr />
          {this.props.workerState.message}
          <hr />
          <ul>{taskEls}</ul>

          <hr />
          {runningTask && (
            <div>
              <h2>Tarefa em execução</h2>
              <hr />
              <strong>{runningTask.type}</strong> - {runningTask.description} -{' '}
              {runningTask.progress} / {runningTask.size}
            </div>
          )}
        </div>

        <div style={{flex: 1}}>
          <h2>Tarefas executadas - {doneTaskEls.length} tarefas executadas</h2>
          <hr />
          <ul>{doneTaskEls}</ul>
        </div>
      </div>
    );
  }
}
