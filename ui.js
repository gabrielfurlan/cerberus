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
  // const x = new XMLHttpRequest();
  // const u = 'https://jsonplaceholder.typicode.com/posts';
  // x.open("GET", u);
  // x.send();
  // x.onreadystatechange=(e)=>{
  //   console.log(x.responseText)
  // }
  
  const r = {
    "name": "Luke",
    "images": [
      { name: '1', url: 'https://www.obrasilfelizdenovo.com/wp-content/themes/bootstrap-basic/img/PROPOSTAS_TOPO.jpg' },
      { name: '2', url: 'https://www.obrasilfelizdenovo.com/wp-content/uploads/2018/10/haddad-futuro.jpg' },
      { name: '3', url: 'https://www.obrasilfelizdenovo.com/wp-content/themes/bootstrap-basic/img/PROPOSTAS_TOPO.jpg' },
      { name: '4', url: 'https://www.obrasilfelizdenovo.com/wp-content/themes/bootstrap-basic/img/PROPOSTAS_TOPO.jpg' },
      { name: '5', url: 'https://www.obrasilfelizdenovo.com/wp-content/uploads/2018/10/bolsonaro-cristao-honesto-patriota.jpg' },
      { name: '6', url: 'https://www.obrasilfelizdenovo.com/wp-content/uploads/2018/10/haddad-futuro.jpg' },
      { name: '7', url: 'https://www.obrasilfelizdenovo.com/wp-content/themes/bootstrap-basic/img/PROPOSTAS_TOPO.jpg' },
      { name: '8', url: 'https://www.obrasilfelizdenovo.com/wp-content/uploads/2018/10/haddad-futuro.jpg' },
      { name: '9', url: 'https://www.obrasilfelizdenovo.com/wp-content/uploads/2018/10/bolsonaro-cristao-honesto-patriota.jpg' },
      { name: '10', url: 'https://www.obrasilfelizdenovo.com/wp-content/themes/bootstrap-basic/img/PROPOSTAS_TOPO.jpg' },
      { name: '11', url: 'https://www.obrasilfelizdenovo.com/wp-content/themes/bootstrap-basic/img/PROPOSTAS_TOPO.jpg' },
      { name: '12', url: 'https://www.obrasilfelizdenovo.com/wp-content/themes/bootstrap-basic/img/PROPOSTAS_TOPO.jpg' },
      { name: '13', url: 'https://www.obrasilfelizdenovo.com/wp-content/themes/bootstrap-basic/img/PROPOSTAS_TOPO.jpg' },
      { name: '14', url: 'https://www.obrasilfelizdenovo.com/wp-content/themes/bootstrap-basic/img/PROPOSTAS_TOPO.jpg' },
      { name: '15', url: 'https://www.obrasilfelizdenovo.com/wp-content/uploads/2018/10/haddad-futuro.jpg' },
      { name: '16', url: 'https://www.obrasilfelizdenovo.com/wp-content/uploads/2018/10/bolsonaro-cristao-honesto-patriota.jpg' },
      { name: '17', url: 'https://www.obrasilfelizdenovo.com/wp-content/uploads/2018/10/bolsonaro-cristao-honesto-patriota.jpg' },
    ],
    "contacts": c
  };
  const s = document.createElement('script');
  s.id = 'template';
  s.type = 'x-tmpl-mustache';
  s.text = `    
  <section id='cib-modal'>
    <h1>{{ name }}, procure seu conteúdo!</h1>
    <form id="cib-search">
      <input autocomplete="off" onkeyup="handleChangeSearchInput(this)" oplaceholder="pesquise" id="term" name="term" />
      <button type="submit">GO!</button>
    </form>
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
      var base64 = getBase64Image(i[0]);
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