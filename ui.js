function UI() { }

// UI.prototype.check = function () {
//     window.WAPI.sendImage = function(imgBase64, chatid, filename, caption, done) {}
// }

UI.prototype.run = function () {
  const t = document.createElement('div');
  t.id = 'target';

  const j = {
    "name": "Luke",
    "images": [
      { name: '1', url: 'https://www.obrasilfelizdenovo.com/wp-content/uploads/2018/10/haddad-futuro.jpg' },
      { name: '2', url: 'https://www.obrasilfelizdenovo.com/wp-content/uploads/2018/10/bolsonaro-cristao-honesto-patriota.jpg' },
      { name: '3', url: 'https://www.obrasilfelizdenovo.com/wp-content/themes/bootstrap-basic/img/PROPOSTAS_TOPO.jpg' }
    ]
  };

  const s = document.createElement('script');
  s.id = 'template';
  s.type = 'x-tmpl-mustache';
  s.text = `<h1>Compartilhar {{ name }}!</h1>
  <form id="search">
    <input id="term" name="term" />
    <button type="submit">buscar</button>
  </form>
  <form id="send">
    <ul>
    {{#images}}
      <li>
        <input type="checkbox" id="meme_{{name}}" name="meme[]" value="{{name}}" />
        <img width=100 heigth=100 src='{{url}}' />
      </li>
    {{/images}}
    </ul>
    <button type="submit">enviar</button>
  </form>`;

  document.body.appendChild(t);
  document.body.appendChild(s);

  setTimeout( function () {
    var template = $('#template').html();
    Mustache.parse(template);
    var rendered = Mustache.render(template, j);
    $('#target').html(rendered);

    $('#search').submit(function(evt) {
      evt.preventDefault();
      console.log('buscou');
    });

    $('#send').submit(function(evt) {
      evt.preventDefault();
      console.log('enviou');
    });

    console.log("Carregamento UI Finalizada")
  }, 2000);

}
