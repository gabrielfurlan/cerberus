function UI() { }

// UI.prototype.check = function () {
//     window.WAPI.sendImage = function(imgBase64, chatid, filename, caption, done) {}
// }

UI.prototype.run = function () {
  const t = document.createElement('div');
  t.id = 'target';

  const s = document.createElement('script');
  s.id = 'template';
  s.type = 'x-tmpl-mustache';
  s.text = "Hello {{ name }}!";
  document.body.appendChild(t);
  document.body.appendChild(s);
  setTimeout( function () {
    var template = $('#template').html();
    Mustache.parse(template);   // optional, speeds up future uses
    var rendered = Mustache.render(template, {name: "Luke"});
    console.log(rendered);
    $('#target').html(rendered);

    console.log("Carregamento UI Finalizada")
  }, 2000)
}
