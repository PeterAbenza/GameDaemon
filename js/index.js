document.addEventListener('DOMContentLoaded', () => {
  const player = document.querySelector('.player'); 
  const nuvens = document.querySelector('.nuvens'); 
  const pipe = document.querySelector('.pipe');
  const pipeVoador = document.querySelector('.pipeVoador');
  const arvore = document.querySelector('.arvore');
  const gameOver = document.querySelector('.gameOver');
  const pressEnter = document.querySelector('.enter');
  const reset = document.querySelector('.reset');
  const pontos = document.querySelector('.pontos');
  const audio = new Audio('./sons/musicaFundo.mp3');

  if (!player || !nuvens || !pipe || !pipeVoador || !arvore || !gameOver || !pressEnter || !reset || !pontos) {
    console.error('Um ou mais elementos não foram encontrados no DOM.');
    return;
  }

  // Função para atualizar a posição dos elementos
  const updatePositions = () => {
    return {
      nuvensPosition: nuvens.offsetLeft,
      arvorePosition: arvore.offsetLeft,
      pipePosition: pipe.offsetLeft,
      pipeVoadorPosition: pipeVoador.offsetLeft,
      playerPosition: +window.getComputedStyle(player).bottom.replace("px", "")
    };
  };

  const updatePositions2 = () => {
    return {
        nuvensRect: nuvens.getBoundingClientRect(),
        arvoreRect: arvore.getBoundingClientRect(),
        pipeRect: pipe.getBoundingClientRect(),
        pipeVoadorRect: pipeVoador.getBoundingClientRect(),
        playerRect: player.getBoundingClientRect()
    };
};

// pontuação
const pontuacao = (initialPo) => {
  let p = 0; 
  let intervaloId;
  pontos.style.fontSize = "20px";

  const atualizarPontuacao = () => {
    if (initialPo === true) {
      p += 10; 
      pontos.innerHTML = p; 
    } else {
      clearInterval(intervaloId); 
      initialPo = null;
    }
  };

  intervaloId = setInterval(atualizarPontuacao, 800);

  return {
    setPo: (novoPo) => {
      initialPo = novoPo;
      if (initialPo === false) {
        clearInterval(intervaloId); 
        pontos.innerHTML = p; 
        pontos.style.fontsize = "x-larger" ;
        initialPo = null; 
      }
    }
  };
};

const controlePontuacao = pontuacao(false);

  // Função de animação do jogador
  const jump = () => {
    if (player) {
      player.classList.add('jump');
      setTimeout(() => {
        player.classList.remove('jump');
      }, 700);
    } else {
      console.error('Elemento player não encontrado');
    }
  };

  // Função de verificação de colisão
  const checkCollision = () => {
    const { nuvensPosition, arvorePosition, pipePosition, pipeVoadorPosition, playerPosition } = updatePositions();
    const { nuvensRect, arvoreRect, pipeRect, pipeVoadorRect, playerRect } = updatePositions2();

    // Verifica se há sobreposição entre o pipe e o player
    const collisionPipe = !(pipeRect.right < playerRect.left ||
                        pipeRect.left > playerRect.right ||
                        pipeRect.bottom < playerRect.top ||
                        pipeRect.top > playerRect.bottom);

    const collisionPipeVoador = !(pipeVoadorRect.right < playerRect.left ||
                        pipeVoadorRect.left > playerRect.right ||
                        pipeVoadorRect.bottom < playerRect.top ||
                        pipeVoadorRect.top > playerRect.bottom);

    if (collisionPipe || collisionPipeVoador) {
      controlePontuacao.setPo(false);
      pontos.style.fontSize = "30px";
      gameOver.style.visibility = 'visible';
      audio.volume = 0;

      reset.style.visibility = 'visible'

      pipe.style.animation = "none";
      pipe.style.left = `${pipePosition}px`;
      pipe.src = './img/pipe2.gif';

      pipeVoador.style.animation = "none";
      pipeVoador.style.left = `${pipeVoadorPosition}px`;
      pipeVoador.src = './img/pipeVoador2.gif';

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
    const { nuvensPosition, arvorePosition, pipePosition, pipeVoadorPosition, playerPosition } = updatePositions();

    audio.play();
    audio.volume = 0.1;

    // Ativa as animações adicionando a classe 'animated'
    nuvens.classList.add('animated');
    pipe.classList.add('animated');
    arvore.classList.add('animated');
    pipeVoador.classList.add('animated');

    controlePontuacao.setPo(true);

    jump(); // Executa o salto do jogador

    const loop = setInterval(() => {

      // PRECISA SER ARRUMADO, A CADA PONTUAÇÃO AUMENTAR VELOCIDADE POREM CONTINUAR NA POSIÇÃO ATUAL

      // if(pontos.innerHTML === "100"){
      //   pipe.style.animation = 'pipe-animation 3s linear infinite';
      //   //pipeVoador.style.animation = 'pipeVoador-animation 8s linear infinite';
      //   pipe.style.left = pipe.offsetLeft
      //   console.log(pipePosition);
      // } else if(pontos.innerHTML === "180"){
      //   //pipe.style.animation = 'pipe-animation 2s linear infinite';
      //   //pipeVoador.style.animation = 'pipeVoador-animation 6s linear infinite';
      // }

      if (checkCollision()) {
        clearInterval(loop); // Para o loop se a colisão for detectada
      }
    }, 10);
  };

  // Adiciona o listener para o evento 'Enter' e evita adição repetida de listeners
  const handleKeyDown = (event) => {
  
    if (event.key === 'Enter') {
        startGame(); // Inicia o jogo
        gameOver.style.visibility = 'hidden';
        pressEnter.style.visibility = 'hidden';
        player.src = './img/player.gif';
        pipe.src = './img/pipe.gif';
        pipeVoador.src = './img/pipeVoador.gif';
        reset.style.visibility = 'hidden'
    } 
    if (event.key === 'w' || event.key === 'W') {
      jump(); // Permite o salto do jogador em resposta à tecla 'W'
    }
    
    if (event.key === 'r' || event.key === 'R') {
      location.reload();
    }
  };

  document.addEventListener('keydown', handleKeyDown);
});