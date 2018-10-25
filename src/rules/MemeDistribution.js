import SendMeme from '../tasks/SendMeme';
import querystring from 'querystring';

export default class MemeDistribution {
  constructor(recipient, memes, channel, period, randomize, startDelay, keepSending) {
    this.recipient = recipient;
    this.name = 'Distribue meme para ' + recipient
    this.memes = memes || [];
    this.period = period;
    this.randomize = randomize;
    this.keepSending = keepSending;
    
    if (keepSending) {
      this.params = this.makeParams(channel);
    } else {
      this.params = this.makeParams({});
    }
    this.next = new Date().getTime() + startDelay;
    this.sent = {};
  }
  
  consumed() {
    return this.memes.length == 0 && !this.keepSending;
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
      if (!this.keepSending) {
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
    if (this.randomize) {
      this.next += Math.random() * margin - margin / 2;
    }
  }

  makeParams(channel) {
    params = '?uuid=' + window.localStorage.cerberusId;
    if (this.keepSending) {
      params += '&keepSending=true';
      params += '&period=' + this.period;
    }
    if (channel) {
      params += '&' + querystring.stringify(
        compactObject({
          collections: channel.collections.join(',') || null,
          tags: channel.tags.join(',') || null,
          emotions: channel.emotions.join(',') || null,
          themes: channel.themes.join(',') || null,
          types: channel.types.join(',') || null,
          contents: channel.contents.join(',') || null,
          targets: channel.targets.join(',') || null,
        })
      );
    }
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
