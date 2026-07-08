document.addEventListener('DOMContentLoaded', () => {

  const navegacao   = document.querySelector('.navegacao');
  const checkboxMenu = document.getElementById('alternar-menu');
  const linksMenu    = document.querySelectorAll('.navegacao ul a[href^="#"]');
  const suportaObserver = 'IntersectionObserver' in window;
  const prefereMenosMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


  // ---------- Fecha o menu mobile ao clicar em um link ----------
  linksMenu.forEach((link) => {
    link.addEventListener('click', () => {
      if (checkboxMenu && checkboxMenu.checked) {
        checkboxMenu.checked = false;
      }
    });
  });


  // ---------- Navegação muda de estilo ao rolar (sai do topo) ----------
  const primeiraFaixa = document.querySelector('hr.faixa-cor');
  if (primeiraFaixa && navegacao && suportaObserver) {
    const observadorTopo = new IntersectionObserver(([entrada]) => {
      navegacao.classList.toggle('navegacao--rolada', !entrada.isIntersecting);
    });
    observadorTopo.observe(primeiraFaixa);
  }


  // ---------- Marca o link do menu correspondente à seção visível ----------
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


  // ---------- Efeito cascata ao rolar (reutilizável para vários grupos) ----------
  function animarGrupo(seletor, classeEsconder, classeVisivel, opcoes = { threshold: 0.2 }) {
    const itens = document.querySelectorAll(seletor);
    if (!suportaObserver || !itens.length || prefereMenosMovimento) return;

    const observador = new IntersectionObserver((entradas, obs) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add(classeVisivel);
          obs.unobserve(entrada.target);
        }
      });
    }, opcoes);

    itens.forEach((item) => {
      item.classList.add(classeEsconder);
      observador.observe(item);
    });
  }

  // Cards de "Trabalhos"
  animarGrupo('.cartao-caso', 'cartao-esconder', 'cartao-visivel', { threshold: 0.2});

  // Itens de contato (WhatsApp, Instagram, Email, Localização, Horário)
  animarGrupo('.item-contato', 'animar-esconder', 'animar-visivel', { threshold: 0.10});

  // Bloco "Sobre" (texto + credenciais)
  animarGrupo('.texto-sobre, .cartao-credenciais', 'animar-esconder', 'animar-visivel', { threshold: 0.10 });

  // Imagem ao lado do contato
  animarGrupo('.imagem-contato', 'animar-esconder', 'animar-visivel', { threshold: 0.10 });

});