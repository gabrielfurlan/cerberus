import uuid from 'uuid';

export default class Task {
  type = 'Tarefa de tipo desconhecido'
  
  constructor(description) {
    this.id = uuid();
    this.description = description;
  }

  run() {
    // Should be implemented by subclass
  }
  
}
