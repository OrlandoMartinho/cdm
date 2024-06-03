var modal = document.getElementById('modal');
var btnOpenModal = document.getElementById('openModal');
var spanClose = document.getElementsByClassName('close')[0];

// Função para abrir o modal
btnOpenModal.onclick = function() {
  modal.style.display = 'block';
}

// Função para fechar o modal ao clicar no botão de fechar
spanClose.onclick = function() {
  modal.style.display = 'none';
}

// Função para fechar o modal ao clicar fora dele
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
}
