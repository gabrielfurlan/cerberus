import Task from './Task';

export default class JoinChannel {
  constructor(groupLink) {
    const groupId = last(groupLink.split('/')).replace(/\/#/g, '');
    super(`Entrar no canal ${groupId}`);
    this.groupId = groupId;
    this.groupLink = groupLink;
  }

  run() {
    await window.Store.Wap.acceptGroupInvite(this.groupId);
  }
}
