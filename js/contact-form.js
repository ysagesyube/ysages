(function () {
  var MESSAGES = {
    en: { sending: 'Sending…', success: 'Message sent ✓', error: 'Something went wrong. Please try again or email us directly.' },
    pt: { sending: 'Enviando…', success: 'Mensagem enviada ✓', error: 'Algo deu errado. Tente novamente ou nos escreva diretamente.' },
    es: { sending: 'Enviando…', success: 'Mensaje enviado ✓', error: 'Algo salió mal. Intente de nuevo o escríbanos directamente.' }
  };

  function encode(data) {
    return Object.keys(data).map(function (key) {
      return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
    }).join('&');
  }

  document.querySelectorAll('form[data-netlify="true"]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var page = form.closest('.lang-page');
      var lang = (page && page.dataset.lang) || 'en';
      var msgs = MESSAGES[lang] || MESSAGES.en;
      var button = form.querySelector('button[type="submit"]');
      var originalText = button.textContent;
      var data = {};
      new FormData(form).forEach(function (value, key) { data[key] = value; });

      button.disabled = true;
      button.textContent = msgs.sending;

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode(data)
      }).then(function (response) {
        if (!response.ok) throw new Error('Form submission failed: ' + response.status);
        button.textContent = msgs.success;
        form.reset();
      }).catch(function () {
        button.disabled = false;
        button.textContent = msgs.error;
        setTimeout(function () { button.textContent = originalText; }, 4000);
      });
    });
  });
})();
