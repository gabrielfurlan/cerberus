var checkInterval = 200;
var messageLimit = 10;
var limitResetTime = 5000;
var banForeignersInterval = 5000;

function Defense() {
  this.last = {};
  this.messageCount = {};
}

Defense.prototype.onNewMessages = function(chat) {
  var chatId = chat.id._serialized;

  if (!this.fromBrazil(chatId)) {
    this.block(chatId, 'gringo');
  }

  if (!this.messageCount[chatId]) {
    this.messageCount[chatId] = 0;
  }

  var now = this.now();
  if (now - this.last[chatId] > limitResetTime) {
    this.messageCount[chatId] = 0;
    this.last[chatId] = now;
  }

  this.messageCount[chatId] += chat.messages.length;

  if (this.messageCount[chatId] > messageLimit) {
    this.block(chatId, 'flood');
  }
};

Defense.prototype.block = function(chatId, reason) {
  if (chatId.match(/-/)) {
    return;
  }
  if (window.localStorage['whiteList_' + chatId]) {
    return;
  }
  window.WAPI.contactBlock(chatId, function(done) {
    window.localStorage['whiteList_' + chatId] = true;
    console.log('contato bloqueado (' + reason + ')' + chatId);
  });
};

Defense.prototype.run = function() {
  if (window.WAPI.getAllGroups().length == 0) {
    setTimeout(this.run.bind(this), 1000);
    return;
  }
  console.log('Protegido')
  this.banAllForeigners();
};

Defense.prototype.fromBrazil = function(chatId) {
  return chatId.match(/^55/);
};

Defense.prototype.now = function() {
  var date = new Date();
  return date.getTime();
};

Defense.prototype.banForeigners = function(chat) {
  var pqp = chat;
  window.WAPI._getGroupParticipants(chat.id._serialized).then(function(participants) {
    participants.forEach(function(participant) {
      if (!this.fromBrazil(participant.id._serialized)) {
	window.WAPI.removeParticipantGroup(chat.id._serialized, participant.id._serialized);
      }
    }.bind(chat));
  }.bind(chat));
}

Defense.prototype.banAllForeigners = function() {
  window.WAPI.getAllGroups().forEach(function(chat) {
    if (!chat.name) {
      return;
    }
    if (chat.name.match(/teste oraculo/) || window.localStorage.banForeigners) {
      this.banForeigners(chat);
    }
  }.bind(this));
  setTimeout(this.banAllForeigners.bind(this), banForeignersInterval);
}

// For debugging purposes
Defense.prototype.clearWhitelist = function() {
    for (var key in window.localStorage) {
      if (key.match(/^whiteList_/)) {
	console.log(key);
	    delete window.localStorage[key];
	}
    }
}


export default Defense;
