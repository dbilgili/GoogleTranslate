// eslint-disable-next-line no-undef
iframeDOM = {
  deletePageContents: () => {
    const header = document.getElementsByTagName('header')[0];
    header.parentNode.removeChild(header);
    document.body.style.transform = 'translateY(-56px)'

    const bottomNav = document.getElementsByTagName('nav')[1]
    bottomNav.remove()

    const sendFeedbackText = document.querySelectorAll('[aria-haspopup]')[0]
    sendFeedbackText.remove()

    const giveFeedback = document.querySelector('.feedback-link');
    giveFeedback.parentNode.removeChild(giveFeedback);

    const footer = document.querySelector('.gp-footer');
    footer.parentNode.removeChild(footer);

    const frame = document.querySelector('.frame');
    frame.style = 'height:100vh;';
  },
  clearTextArea: () => {
    const clearButton = document.querySelector('[aria-label="Clear source text"]');
    if (clearButton) {
      clearButton.click()
    } else {
      document.getElementsByTagName('button')[24].click();
    }
  },
  getURL: () => window.location.hash,
  setURL: (arg) => {
    window.location.hash = arg;
  },
};
