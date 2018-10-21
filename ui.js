let SELECTED_IMAGE = undefined;

function UI() { }

function getBase64Image(img) {
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  var dataURL = canvas.toDataURL("image/png");
  return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

function handleChangeSearchInput(e) {
  const value = e.value;
  if(value.length) {
    _active();
    e.focus();
  } else {
    _disable();
  }
}

function _active() {
    const modal = document.querySelector('#cib-modal');
    const choose = document.querySelector('#choose');
    modal.classList.add('-active');
    choose.classList.remove('-hide');
}

function _disable() {
    const modal = document.querySelector('#cib-modal');
    const choose = document.querySelector('#choose');
    modal.classList.remove('-active');
    choose.classList.add('-hide');
}

function _handleSelectImage(e) {
  SELECTED_IMAGE = e.value;
}

UI.prototype.run = function () {
  setTimeout( function () {
  const d = document.createElement('div');
  d.id = 'cib-target';

  const c = window.WAPI.getAllContacts();

  // Carrega json da api
  let i = [];
  const x = new XMLHttpRequest();
  const u = 'https://ursal.dev.org.br/api/memes/';
  x.open("GET", u);
  x.send();
  x.onreadystatechange=(e)=>{
    i = x.responseText
  }
  
  const r = {
    "name": "Luke",
    "images": i,
    "contacts": c
  };
  console.log(r);
  const s = document.createElement('script');
  s.id = 'template';
  s.type = 'x-tmpl-mustache';
  s.text = `    
  <section id='cib-modal'>
    <div class="search-wrapper">
      <h1>{{ name }}, procure seu conteúdo!</h1>
      <form id="cib-search">
        <input autocomplete="off" onkeyup="handleChangeSearchInput(this)" oplaceholder="pesquise" id="term" name="term" />
        <button type="submit">GO!</button>
      </form>
    </div>
    <div class="choose-wrapper">
      <form id="choose" class="-hide">
        <ul>
          {{#images}}
          <li class='choose-item'>
            <input class='meme-check-input' onclick="_handleSelectImage(this)" type="radio" id="meme_{{name}}" name="meme[]" value="{{url}}" />
            <label for="meme_{{name}}" ><img src='{{url}}' /></label>
          </li>
          {{/images}}
        </ul>
        <button type="submit">buscar</button>
      </form>
    </div>
    <div class="send-wrapper">
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
        <button type="submit">enviar</button>
      </form>
    </div>
  </section>
`;

  document.body.appendChild(d);
  document.body.appendChild(s);

    var t = $('#template').html();
    Mustache.parse(t);
    var rendered = Mustache.render(t, r);
    $('#cib-target').html(rendered);

    $('#cib-search').submit(function(e) {
      e.preventDefault();
      console.log('buscou');
    });

    $('#choose').submit(function(e) {
      e.preventDefault();
      const i = jQuery(e.currentTarget).find(":checked").parent().find("img");

      console.log('escolheu');
    });

    $('#send').submit(function(e) {
      e.preventDefault();
      console.log(jQuery(e.currentTarget).find(":checked"));
    });

    console.log("Carregamento UI Finalizada")
  }, 3000);
}


function render() {
  
}