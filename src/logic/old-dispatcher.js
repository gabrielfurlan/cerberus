var minimumWaitTime = 2000;
var averageWaitTime = 5000;

function Dispatcher() {
    this.queue = [];
    this.scheduled = [];
}

Dispatcher.prototype.send = function(message) {
    this.queue.push(message);
}

Dispatcher.prototype.schedule = function(delay, messages) {
    var time = new Date().getTime() + delay;
    for (var i=0; i< messages.length; i++) {
	this.scheduled.push([time, messages[i]]);
    }
    this.schedules.sort(function(a, b) {
	return a[0] - b[0];
    });
}    

Dispatcher.prototype.sendScheduled = function() {
    var now = new Date().getTime();
    while (this.scheduled.length > 0 && this.scheduled[0][0] <= now) {
	this.send(this.scheduled.shift()[1]);
    }
}

Dispatcher.prototype.cycle = function() {
    this.sendScheduled();
    
    if (this.queue.length > 0) {
	this.dispatch(this.queue.shift());
    }

    var waitTime = minimumWaitTime + Math.random() * (averageWaitTime - minimumWaitTime) * 2;
    setTimeout(this.check.bind(this), waitTime);
}

Dispatcher.prototype.dispatch = function(message) {
    // TODO
}

Dispatcher.prototype.run = function() {
    this.cycle();
}
