import SendMeme from '../tasks/SendMeme';

export default class MemeDistribution {
  constructor(recipient, memes, channel, period, startDelay) {
    this.recipient = recipient;
    this.name = 'Distribue meme para ' + recipient
    this.memes = memes || [];
    this.channel = channel;
    this.params = this.makeParams(channel);
    this.period = period;
    this.next = new Date().getTime() + startDelay;
    this.sent = {};
  }
  
  consumed() {
    return this.memes.length == 0 && !this.channel;
  }

  getTasks() {
    return new Promise((resolve, reject) => {
      var now = new Date().getTime();
      if (this.next > now) {
	resolve([]);
	return;
      }
      this.schedule();
      if (this.memes.length > 0) {
	this.sent[this.memes[0].id] = true;
	resolve([ new SendMeme(this.memes.shift(), this.recipient) ]);
	return;
      }
      if (!this.channel) {
	resolve([]);
	return;
      }
      this.loadFromChannel().then((memes) => {
	resolve(memes.map((meme) => new SendMeme(meme, this.recipient)));
      });
    });
  }

  schedule() {
    var now = new Date().getTime();
    var margin = this.period / 4;
    this.next = now + this.period;
    this.next += Math.random() * margin - margin / 2;
  }

  makeParams(channel) {
    return '?'
  }

  loadFromChannel() {
    return fetch('https://antifa.agency/api/memes/' + this.params)
      .then(res => res.json())
      .then(memes => {
	while (memes.length > 0 && this.sent[memes[0].id]) {
	  memes.shift();
	}
	if (memes.length == 0) {
	  return [];
	}
	this.sent[memes[0].id] = true;
	return [ memes[0] ];
      });
  }
}
