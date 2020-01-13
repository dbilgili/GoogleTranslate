// eslint-disable-next-line no-undef
iframeDOM = {
  deletePageContents: () => {
    const header = document.getElementsByTagName('header')[0];
    header.parentNode.removeChild(header);

    const giveFeedback = document.querySelector('.feedback-link');
    giveFeedback.parentNode.removeChild(giveFeedback);

    const footer = document.querySelector('.gp-footer');
    footer.parentNode.removeChild(footer);

    const frame = document.querySelector('.frame');
    frame.style = 'height:100vh;';
  },
  focusTextArea: () => {
    document.querySelector('#source').focus();
  },
  clearTextArea: () => {
    document.querySelector('#source').value = '';
  },
  getURL: () => window.location.hash,
  setURL: (arg) => {
    window.location.hash = arg;
    console.log(arg);
  },
};
