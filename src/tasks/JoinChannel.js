import last from 'lodash/last';
import Task from './Task';

export default class JoinChannel extends Task {
  type = 'Entrar em canal'
  
  constructor(groupLink) {
    const groupId = last(groupLink.split('/')).replace(/\/#/g, '');
    super(`Entrar no canal ${groupId}`);
    this.groupId = groupId;
    this.groupLink = groupLink;
  }

  run() {
    window.Store.Wap.acceptGroupInvite(this.groupId);
  }
}
