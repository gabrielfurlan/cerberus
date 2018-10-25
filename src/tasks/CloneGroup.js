import Task from './Task';

export default class CloneGroup extends Task {
  type = 'Clonar grupo'
  
  constructor(group) {
    super(`Clonando grupo ${group.contact.name}`),
    this.group = group;
  }

  run() {
    const groupContacts = this.group.groupMetadata.participants.map(
      participant => participant.id._serialized,
    );

    console.log(`  -> Cloning group ${this.group.contact.name}`);
    console.log(`  -> Adding participants:`);
    groupContacts.forEach(contact => {
      console.log(`     ${contact}`);
    });

    window.WAPI.createGroup(this.group.contact.name, groupContacts);
  }
}
