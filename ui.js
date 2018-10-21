let SELECTED_IMAGE = undefined;

window.addEventListener("keydown", function(e){
  if(e.keyCode === 69 && e.altKey && e.shiftKey) document.getElementById("cib-target").classList.remove('-hide');
  if(e.keyCode === 27) document.getElementById("cib-target").classList.add('-hide');
});

function UI() {}

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

function _handleSelectImage(e) {
  const value = e.value;
  console.log('value', value)
  SELECTED_IMAGE = value;
  console.log('SELECTED_IMAGE', SELECTED_IMAGE)
  const contacts = document.querySelector('#cib-send');
  console.log('contacts', contacts)
  console.log(contacts)
  contacts.classList.remove('-hide')
}

function _active() {
    const modal = document.querySelector('#cib-modal');
    const choose = document.querySelector('#choose');
    modal.classList.add('-active');
    choose.classList.remove('-hide');
}

function _handleContactChange(e, contacts) {

  console.log(e);

  // contacts.map(c => console.log(c));

}

function _disable() {
    const modal = document.querySelector('#cib-modal');
    const choose = document.querySelector('#choose');
    modal.classList.remove('-active');
    choose.classList.add('-hide');
}

UI.prototype.run = function () {
  setTimeout( function () {
  const d = document.createElement('div');
  d.id = 'cib-target';
  d.classList.add('-hide')

  const c = window.WAPI.getAllContacts();
  let filteredContacts = c;

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
    "images": [
      { name: '1', url: 'https://www.obrasilfelizdenovo.com/wp-content/uploads/2018/10/haddad-futuro.jpg' },
      { name: '2', url: 'https://www.obrasilfelizdenovo.com/wp-content/uploads/2018/10/bolsonaro-cristao-honesto-patriota.jpg' },
      { name: '3', url: 'https://www.obrasilfelizdenovo.com/wp-content/themes/bootstrap-basic/img/PROPOSTAS_TOPO.jpg' }
    ],
    "contacts": filteredContacts
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
        <input onkeyup="handleChangeSearchInput(this)" oplaceholder="pesquise" id="term" name="term" />
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
        </form>
      </div>
      <div class="send-wrapper">
        <form id="cib-send" class="-hide">
          <h2>Destinatários</h2>
          <input onkeyup="_handleContactChange(this)" placeholder="Procure os contatos" id="contactInput" name="contact" />
          <ul>
            {{#contacts}}
            <li key={{id._serialized}}>
              <input
                type="checkbox"
                id='{{id._serialized}}'
              />
              <label for='{{id._serialized}}'>
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

    $('#cib-send').submit(function(e) {
      e.preventDefault();

      const value = $('#contactInput')[0].value
      filteredContacts = c.filter(function (c) {
        return (
          c.name &&
          c.name.indexOf(value) !== -1
        )
      });
      console.log(filteredContacts);
      console.log(jQuery(e.currentTarget).find(":checked"));
    });


    // $(document).bind('keydown', 'ctrl+m', function(e){
    //     document.getElementById("cib-target").classList.remove('-hide');
    //     // if(e.keyCode === 27) document.getElementById("cib-target").classList.add('-hide');
    //   });
    console.log("Carregamento UI Finalizada")
  }, 3000);
}