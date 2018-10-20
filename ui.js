function UI() { }

// UI.prototype.check = function () {
//     window.WAPI.sendImage = function(imgBase64, chatid, filename, caption, done) {}
// }

UI.prototype.run = function () {
  setTimeout( function () {
  const d = document.createElement('div');
  d.id = 'target';

  const c = window.WAPI.getAllContacts();

  const r = {
    "name": "Luke",
    "images": [
      { name: '1', url: 'https://www.obrasilfelizdenovo.com/wp-content/uploads/2018/10/haddad-futuro.jpg' },
      { name: '2', url: 'https://www.obrasilfelizdenovo.com/wp-content/uploads/2018/10/bolsonaro-cristao-honesto-patriota.jpg' },
      { name: '3', url: 'https://www.obrasilfelizdenovo.com/wp-content/themes/bootstrap-basic/img/PROPOSTAS_TOPO.jpg' }
    ],
    "contacts": c
  };
  const s = document.createElement('script');
  s.id = 'template';
  s.type = 'x-tmpl-mustache';
  s.text = `<h1>Compartilhar {{ name }}!</h1>
  <form id="search">
    <input id="term" name="term" />
    <button type="submit">buscar</button>
  </form>
  <h2>Resultados</h2>
  <form id="choose">
    <ul>
    {{#images}}
      <li>
        <input type="checkbox" id="meme_{{name}}" name="meme[]" value="{{name}}" />
        <img width=100 heigth=100 src='{{url}}' />
      </li>
    {{/images}}
    </ul>
    <button type="submit">enviar</button>
  </form>
  <h2>Destinatários</h2>
  <form id="send">
    <ul>
      {{#contacts}}
      <li key={{id._serialized}}>
        <input
          type="checkbox"
          id=send-message-{{id._serialized}}
        />
        <label htmlFor=send-message-{{contact.id._serialized}}>
          {{formattedName}} - {{id._serialized}}
        </label>
      </li>
      {{/contacts}}
    </ul>
  </form>`;

  document.body.appendChild(d);
  document.body.appendChild(s);

    var t = $('#template').html();
    Mustache.parse(t);
    var rendered = Mustache.render(t, r);
    $('#target').html(rendered);

    $('#search').submit(function(e) {
      e.preventDefault();
      console.log('buscou');
    });

    $('#send').submit(function(e) {
      e.preventDefault();
      console.log('enviou');
    });

    console.log("Carregamento UI Finalizada");
  }, 2000);

}
