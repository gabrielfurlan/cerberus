import App from './app';
import Defense from './defense';
import UI from './jquery-ui';

var app = new App();

app.register(new Defense());
app.register(new UI());
app.run();
