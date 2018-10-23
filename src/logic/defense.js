var checkInterval = 200;
var messageLimit = 10;
var limitResetTime = 5000;

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
  console.log('Protegido');
};

Defense.prototype.fromBrazil = function(chatId) {
  return chatId.match(/^55/);
};

Defense.prototype.now = function() {
  var date = new Date();
  return date.getTime();
};

export default Defense;
