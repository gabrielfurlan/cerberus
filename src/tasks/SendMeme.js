import Task from './Task';

export default class SendMeme extends Task {
  type = 'Envio de Meme'
  
  constructor(meme, recipient) {
    var memeId = meme.id;
    // TODO we can get thumb from base64 encoded that is inside meme
    super(`Enviar ${memeId} para ${recipient}`);
    this.memeId = memeId;
    this.recipient = recipient;
  }

  run() {
    console.log('sending meme ' + this.memeId + ' to ' + this.recipient);
    fetch('https://ursal.dev.org.br/api/memes/' + this.memeId + '/')
      .then(res => res.json())
      .then(data => {
	window.WAPI.sendImage(data, this.recipient, 'imagename', '', console.log);
      });
  }
}
