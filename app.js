var checkInterval = 200;

function App() {
    this.modules = [];
}

App.prototype.register = function(module) {
    this.modules.push(module);
}

App.prototype.check = function () {
    const chats = window.WAPI.getUnreadMessages();
    chats.forEach(function (chat) {
	this.modules.forEach(function(module) {
	    if (module.onNewMessages) {
		module.onNewMessages(chat);
	    }
	});
    }.bind(this));
    
    setTimeout(this.check.bind(this), checkInterval);
}

App.prototype.run = function() {
    if (!window.WAPI) {
	setTimeout(this.run.bind(this), 100);
	return;
    }
    this.modules.forEach(function(module) {
	if (module.run) {
	    module.run();
	}
    });
    this.check();
}
