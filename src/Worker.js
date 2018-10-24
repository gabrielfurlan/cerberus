import last from 'lodash/last';
import uuid from 'uuid';
import EventEmitter from 'events';
import Promise from 'bluebird';

export const ACTIONS = {
  MASSIVE_JOIN: 'MASSIVE_JOIN',
};

/**
 * Returns the next wait time before the next WhatsApp API interaction action.
 */

function getNextActionWaitTime() {
  return 1000 + Math.random() * 5000;
}

/**
 * Implements a monitorable action task QUEUE
 *
 * To favor modularity, it's probably best to only implement simple logic here
 */

export default class Worker extends EventEmitter {
  constructor() {
    super();
    console.log('Initialized worker.');

    this.runningTask = null;
    this.tasks = {};
    this.taskQueue = [];
    this.doneTasks = [];

    this.interval = setInterval(this.onInterval, 500);
  }

  /**
   * Returns the worker state for the UI
   */

  getState() {
    return {
      tasks: this.tasks,
      taskQueue: this.taskQueue,
      message: this.message,
      runningTask: this.runningTask,
      doneTasks: this.doneTasks,
    };
  }

  /**
   * Pushes a task onto the queue
   */

  push(task) {
    if (!task.id) {
      task.id = uuid();
    }

    this.tasks[task.id] = task;
    this.taskQueue.push(task.id);
  }

  /**
   * Every INTERVAL ms, check the queue and whether we're running a task. Then
   * execute tasks.
   */

  onInterval = () => {
    // If we're already running, ignore this check.
    if (this.runningTask) {
      return;
    }

    this.message = 'Procurando novas tarefas...';

    this.runNextTask();
  };

  /**
   * Shift the next pending task from the queue
   */

  runNextTask() {
    if (this.runningTask) {
      throw new Error("Can't run two tasks at the same time.");
    }

    if (!this.taskQueue.length) {
      return;
    }

    this.message = 'Iniciando execução de nova tarefa';

    const nextTaskIdToRun = this.taskQueue.shift();
    const taskDefinition = this.tasks[nextTaskIdToRun];

    this.runningTask = taskDefinition;

    taskDefinition.progress = 0;
    taskDefinition.running = true;
    taskDefinition.promise = this.runTask(taskDefinition).then(() => {
      this.runningTask = null;
      this.doneTasks = [taskDefinition, ...this.doneTasks];
    });
  }

  /**
   * Execute a task definition
   */

  runTask(taskDefinition) {
    switch (taskDefinition.type) {
      case ACTIONS.MASSIVE_JOIN: {
        return this.runMassiveJoin(taskDefinition);
      }

      default: {
        return Promise.reject(
          new Error(`Unknown task type ${taskDefinition.type}`),
        );
      }
    }
  }

  /**
   * Joins all groups from a list of groups
   */

  runMassiveJoin(taskDefinition) {
    return Promise.mapSeries(taskDefinition.payload.groups, async groupLink => {
      const groupId = last(groupLink.split('/')).replace(/\/#/g, '');

      console.log(`  -> Joining group ${groupId}`);
      this.message = `Entrando no grupo ${groupId}`;

      try {
        await window.Store.Wap.acceptGroupInvite(groupId);
      } catch (err) {
        console.error(`Failed to join group ${groupId} with error:`, err);
      }

      taskDefinition.progress += 1;

      const waitTime = getNextActionWaitTime();
      this.message = `Esperando por ${waitTime}ms`;
      return Promise.delay(waitTime);
    });
  }
}
