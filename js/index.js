document.addEventListener('DOMContentLoaded', () => {
  const player = document.querySelector('.player'); 
  const nuvens = document.querySelector('.nuvens'); 
  const pipe = document.querySelector('.pipe');
  const arvore = document.querySelector('.arvore');
  const gameOver = document.querySelector('.gameOver');
  const pressEnter = document.querySelector('.enter');
  const audio = new Audio('musicaFundo.mp3');

  if (!player || !nuvens || !pipe || !arvore || !gameOver || !pressEnter) {
    console.error('Um ou mais elementos não foram encontrados no DOM.');
    return;
  }

  // Função para atualizar a posição dos elementos
  const updatePositions = () => {
    return {
      nuvensPosition: nuvens.offsetLeft,
      arvorePosition: arvore.offsetLeft,
      pipePosition: pipe.offsetLeft,
      playerPosition: +window.getComputedStyle(player).bottom.replace("px", "")
    };
  };

  const updatePositions2 = () => {
    return {
        nuvensRect: nuvens.getBoundingClientRect(),
        arvoreRect: arvore.getBoundingClientRect(),
        pipeRect: pipe.getBoundingClientRect(),
        playerRect: player.getBoundingClientRect()
    };
};

  // Função de animação do jogador
  const jump = () => {
    if (player) {
      player.classList.add('jump');
      setTimeout(() => {
        player.classList.remove('jump');
      }, 700); // Ajuste o tempo para corresponder ao tempo da animação
    } else {
      console.error('Elemento player não encontrado');
    }
  };

  // Função de verificação de colisão
  const checkCollision = () => {
    const { nuvensPosition, arvorePosition, pipePosition, playerPosition } = updatePositions();
    const { nuvensRect, arvoreRect, pipeRect, playerRect } = updatePositions2();

    // Verifica se há sobreposição entre o pipe e o player
    const collision = !(pipeRect.right < playerRect.left ||
                        pipeRect.left > playerRect.right ||
                        pipeRect.bottom < playerRect.top ||
                        pipeRect.top > playerRect.bottom);

    if (collision) {
      gameOver.style.visibility = 'visible';
      audio.volume = 0;

      pipe.style.animation = "none";
      pipe.style.left = `${pipePosition}px`;
      pipe.src = './img/pipe2.gif';

      player.style.animation = "none";
      player.style.bottom = `${playerPosition}px`;
      player.src = './img/playerDead.gif';

      nuvens.style.animation = "none";
      nuvens.style.left = `${nuvensPosition}px`;

      arvore.style.animation = "none";
      arvore.style.left = `${arvorePosition}px`;

      return true; // Retorna true quando a colisão é detectada
    }
    return false; // Retorna false caso contrário
  };

  // Função para iniciar o jogo
  const startGame = () => {
    audio.play();
    audio.volume = 0.1;

    // Ativa as animações adicionando a classe 'animated'
    nuvens.classList.add('animated');
    pipe.classList.add('animated');
    arvore.classList.add('animated');

    jump(); // Executa o salto do jogador

    const loop = setInterval(() => {
      if (checkCollision()) {
        clearInterval(loop); // Para o loop se a colisão for detectada
      }
    }, 10);
  };

  // Adiciona o listener para o evento 'Enter' e evita adição repetida de listeners
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      document.removeEventListener('keydown', handleKeyDown); // Remove o listener após a primeira execução
      startGame(); // Inicia o jogo

      gameOver.style.visibility = 'hidden';
      pressEnter.style.visibility = 'hidden';
      player.src = './img/player.gif';
      pipe.src = './img/pipe.gif';

      document.addEventListener('keydown', (e) => {
        if (e.key === 'w' || e.key === 'W') {
          jump(); // Permite o salto do jogador em resposta à tecla 'W'
        }
      });
    }
  };

  document.addEventListener('keydown', handleKeyDown);
});