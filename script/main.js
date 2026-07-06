

document.addEventListener('DOMContentLoaded', () => {

  const navegacao   = document.querySelector('.navegacao');
  const checkboxMenu = document.getElementById('alternar-menu');
  const linksMenu    = document.querySelectorAll('.navegacao ul a[href^="#"]');
  const suportaObserver = 'IntersectionObserver' in window;

  
  linksMenu.forEach((link) => {
    link.addEventListener('click', () => {
      if (checkboxMenu && checkboxMenu.checked) {
        checkboxMenu.checked = false;
      }
    });
  });

  
  const primeiraFaixa = document.querySelector('hr.faixa-cor');
  if (primeiraFaixa && navegacao && suportaObserver) {
    const observadorTopo = new IntersectionObserver(([entrada]) => {
      navegacao.classList.toggle('navegacao--rolada', !entrada.isIntersecting);
    });
    observadorTopo.observe(primeiraFaixa);
  }

  
  if (suportaObserver && linksMenu.length) {
    const observadorSecoes = new IntersectionObserver((entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        linksMenu.forEach((link) => link.classList.remove('link-ativo'));
        const linkCorrespondente = document.querySelector(
          `.navegacao ul a[href="#${entrada.target.id}"]`
        );
        if (linkCorrespondente) linkCorrespondente.classList.add('link-ativo');
      });
    }, { rootMargin: '-40% 0px -55% 0px' });

    linksMenu.forEach((link) => {
      const secao = document.querySelector(link.getAttribute('href'));
      if (secao) observadorSecoes.observe(secao);
    });
  }

  
  const prefereMenosMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cards = document.querySelectorAll('.cartao-caso');

  if (suportaObserver && cards.length && !prefereMenosMovimento) {
    const observadorCards = new IntersectionObserver((entradas, observador) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('cartao-visivel');
          observador.unobserve(entrada.target);
        }
      });
    }, { threshold: 0.2 });

    cards.forEach((card) => {
      card.classList.add('cartao-esconder');
      observadorCards.observe(card);
    });
  }

});