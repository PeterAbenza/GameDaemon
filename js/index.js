const jump = () => {
  const player = document.querySelector('.player'); // para acessar a class do html .player;
  if (player) { // Verifique se o elemento não é null
    player.classList.add('jump'); // classList.add() para adicionar uma class
    setTimeout(() => { //  setTimeout(função, tempo) como se fosse wait();
      player.classList.remove('jump');
    }, 500);
  } else {
    console.error('Elemento não encontrado');
  }  
}

const loop = setInterval(() => { //setInterval(função, tempo);
  const player = document.querySelector('.player'); 
  const nuvens = document.querySelector('.nuvens'); 
  const pipe = document.querySelector('.pipe');
  const arvore = document.querySelector('.arvore');
  
  const nuvensPosition = nuvens.offsetLeft; 
  const arvorePosition = arvore.offsetLeft; 
  const pipePosition = pipe.offsetLeft; // pega qual posição esta no left;
  // "window" pode pegar qualquer propriedade css, e se usar + na frente converte de string para number;
  const playerPosition = +window.getComputedStyle(player).bottom.replace("px", "");  

  if(pipePosition <= 120 && pipePosition > 0 && playerPosition < 80){
    pipe.style.animation = "none"; // pipe.style para acessar o css dele;
    pipe.style.left = `${pipePosition}px`; // converte a posição atual dele e manda pro css;

    player.style.animation = "none";
    player.style.width = '120px'
    player.style.bottom = `${playerPosition}px`;
    player.src = './img/morte.png';
    pipe.style.marginLeft = '-50px';

    nuvens.style.animation = "none";
    nuvens.style.left = `${nuvensPosition}px`;
  
    arvore.style.animation = "none";
    arvore.style.left = `${arvorePosition}px`;

    clearInterval(loop); ; // parar loop;
  }

}, 10); 

document.addEventListener('keydown', jump) // addEventListener(evento, função);