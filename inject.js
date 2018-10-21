/**
 * Inject app script onto WhatsApp page
 */

function inject(script) {
    var s = document.createElement('script');
    // TODO: add "script.js" to web_accessible_resources in manifest.json
    s.src = chrome.extension.getURL(script);
    s.onload = function() {
	this.remove();
    };
    (document.head || document.documentElement).appendChild(s);
}

window.onload = function() {
    const icons = {
        loading: chrome.extension.getURL('/assets/icons/loading.svg')
    };

    window.sessionStorage.setItem('cerberus-icons', JSON.stringify(icons))

    inject('jquery.js');
    inject('mustache.js');
    inject('list.js');
    inject('wapi.js');
    inject('defense.js');
    inject('ui.js');
    inject('run.js');
}
