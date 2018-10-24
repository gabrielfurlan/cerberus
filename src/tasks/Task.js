import uuid from 'uuid';

export default class Task {
  constructor(name) {
    this.id = uuid();
    this.name = name;    
  }

  run() {
    // Should be implemented by subclass
  }
  
}
