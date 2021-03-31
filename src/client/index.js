// eslint-disable-next-line import/no-extraneous-dependencies
const { ipcRenderer } = require('electron');

const webview = document.querySelector('webview');
const loader = document.querySelector('#loader');

webview.addEventListener('dom-ready', () => {
  webview.focus()
  webview.executeJavaScript('iframeDOM.deletePageContents()');
  setTimeout(() => {
    loader.classList.add('hide');
  }, 500);
});

webview.addEventListener('did-navigate-in-page', () => {
  const promise = webview.executeJavaScript('iframeDOM.getURL()');
  promise.then((val) => {
    ipcRenderer.send('HASH', val.split('&text')[0]);
  })
});

ipcRenderer.on('SAVED_HASH', (event, arg) => {
  webview.executeJavaScript(`iframeDOM.setURL('${arg}')`);
});

ipcRenderer.on('CLEAR_TEXT_AREA', () => {
  webview.executeJavaScript('iframeDOM.clearTextArea()');
});

window.addEventListener('online', () => {
  webview.classList.remove('hide');
  loader.classList.add('hide');
});

window.addEventListener('offline', () => {
  loader.innerHTML = 'Internet connection is required';
  loader.classList.remove('hide');
  webview.classList.add('hide');
});
