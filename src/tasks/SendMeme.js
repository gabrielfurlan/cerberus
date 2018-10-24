import Task from './Task';

export default class SendMeme extends Task {
  constructor(meme, recipient) {
    var memeId = meme.id;
    // TODO we can get thumb from base64 encoded that is inside meme
    super(`Enviar ${memeId} para ${recipient}`);
    this.memeId = memeId;
    this.recipient = recipient;
  }

  run() {
    console.log('sending meme ' + this.memeId + ' to ' + this.recipient);
    // TODO get message from server and send to recipient
  }
}
