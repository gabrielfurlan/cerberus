function UI() { }

// UI.prototype.check = function () {
//     window.WAPI.sendImage = function(imgBase64, chatid, filename, caption, done) {}
// }

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

UI.prototype.run = function () {
  setTimeout( function () {
  const d = document.createElement('div');
  d.id = 'cib-target';

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
  s.text = `    
  <section id='cib-modal'>
    <h1>{{ name }}, procure seu conteúdo!</h1>
    <form id="cib-search">
      <input onkeyup="handleChangeSearchInput(this)" oplaceholder="pesquise" id="term" name="term" />
      <button type="submit">GO!</button>
    </form>
    <form id="choose" class="-hide">
      <ul>
        {{#images}}
        <li class='choose-item'>
          <input class='meme-check-input' type="radio" id="meme_{{name}}" name="meme[]" value="{{name}}" />
          <label for="meme_{{name}}" ><img src='{{url}}' /></label>
        </li>
        {{/images}}
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
      console.log('escolheu');
    });

    $('#send').submit(function(e) {
      e.preventDefault();
      console.log(jQuery(e.currentTarget).find(":checked"));
    });

    console.log("Carregamento UI Finalizada")
  }, 3000);
}


// /*<h2>Resultados</h2>
// >>>>>>> Stashed changes
//     <form id="choose">
//       <ul>
//         {{#images}}
//         <li>
//           <input type="checkbox" id="meme_{{name}}" name="meme[]" value="{{name}}" />
//           <img width=100 heigth=100 src='{{url}}' />
//         </li>
//         {{/images}}
//       </ul>
//       <button type="submit">enviar</button>
//     </form>
//     <h2>Destinatários</h2>
//     <form id="send">
//       <ul>
//         {{#contacts}}
//         <li key={{id._serialized}}>
//           <input
//             type="checkbox"
//             id=send-message-{{id._serialized}}
//           />
//           <label htmlFor=send-message-{{contact.id._serialized}}>
//             {{formattedName}} - {{id._serialized}}
//           </label>
//         </li>
//         {{/contacts}}
//       </ul>
//       <button type="submit">enviar</button>
//     </form>
//   </section>
// `;

//   document.body.appendChild(d);
//   document.body.appendChild(s);

//     var t = $('#template').html();
//     Mustache.parse(t);
//     var rendered = Mustache.render(t, r);
//     $('#cib-target').html(rendered);

//     $('#cib-search').submit(function(e) {
//       e.preventDefault();
//       console.log('buscou');
//     });

//     $('#choose').submit(function(e) {
//       e.preventDefault();
//       console.log('escolheu');
//     });

//     $('#send').submit(function(e) {
//       e.preventDefault();
//       console.log(jQuery(e.currentTarget).find(":checked"));
//     });

//     console.log("Carregamento UI Finalizada")
//   }, 3000);
// }