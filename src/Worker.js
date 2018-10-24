import last from 'lodash/last';
import uuid from 'uuid';
import EventEmitter from 'events';
import Promise from 'bluebird';

/**
 * Implements a monitorable action task QUEUE
 *
 * To favor modularity, it's probably best to only implement simple logic here
 */

export default class Worker {
  constructor() {
    console.log('Initialized worker.');

    // Configuration
    this.minimumWaitTime = 2000;
    this.averageWaitTime = 5000;
    this.maxDoneSize = 30;

    // The queue to be run
    this.queue = [];
    // Latest executed tasks
    this.done = [];
    // Rules are task generators
    this.rules = [];

    this.message = '';

    this.cycle();
  }

  /**
   * Returns the worker state for the UI
   */
  getState() {
    return {
      queue: this.taskQueue,
      message: this.message,
      done: this.done,
      rules: this.rules,
    };
  }
  
  /**
   * Pushes a task onto the queue
   */
  push(task) {
    console.log('queueing task ' + task.id);
    this.queue.push(task);
  }
  
  /**
   * Add a new rule
   */
  addRule(rule) {
    console.log('adding rule');
    this.rules.push(rule);
  }

  /**
   * Run one cycle and schedule next cycle
   */
  cycle() {
    try {
      this.checkRules();
      if (this.queue.length > 0) {
	var task = this.queue.shift();
	this.runTask(task);
      }
    } finally {
      var waitTime = this.minimumWaitTime + Math.random() * (this.averageWaitTime - this.minimumWaitTime) * 2;
      setTimeout(() => { this.cycle() }, waitTime)
    }
  }

  /**
   * Execute one task
   */
  runTask(task) {
    console.log('running task ' + task.id);
    task.run();
    this.done.push(task);
    // trim old done history
    while (this.done.length > this.maxDoneSize) {
      this.done.shift();
    }
  }

  /**
   * Acquire new tasks from rules
   */
  checkRules() {
    var i = 0;
    while (i < this.rules.length) {
      this.rules[i].getTasks().then((tasks) => {
	tasks.forEach((task) => this.push(task));
      });
      if (this.rules[i].consumed()) {
	this.rules.splice(i, 1);
      } else {
	i += 1;
      }
    }
  }
}
