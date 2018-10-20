var checkInterval = 200;
var imageUrl = 'https://www.obrasilfelizdenovo.com/wp-content/uploads/2018/10/haddad-futuro.jpg';

function Foward() { }

// Foward.prototype.check = function () {
//     window.WAPI.sendImage = function(imgBase64, chatid, filename, caption, done) {}
// }

Foward.prototype.run = function () {
    const root = document.createElement('canvas');
    root.id = 'myCanvas';
    root.width = 500;
    root.height = 500;
    document.body.appendChild(root);
  
    console.log('Plugin Encaminhamento ');

    var canvas = document.getElementById("myCanvas")
    canvas.crossOrigin="anonymous"
    canvas.width = 500;
    canvas.height = 500;
    var ctx = canvas.getContext("2d");
    var image = new Image();
    // image.crossOrigin="anonymous"
    image.src = imageUrl;
    image.onload = function () {
        ctx.drawImage(image,0,0);
    };
    const imgSent = canvas.toDataURL("image/jpg");
    //window.WAPI.sendImage(imgSent, '5511976503489@c.us', 'haddad-futuro.jpg', 'haddad-futuro.jpg');
}