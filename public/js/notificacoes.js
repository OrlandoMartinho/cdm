var uniqueModal = document.getElementById('unique-modal');
    var btnOpenUniqueModal = document.getElementById('openUniqueModal');
    var spanCloseUnique = document.getElementsByClassName('unique-close')[0];

    // Função para abrir o modal
    btnOpenUniqueModal.onclick = function() {
      uniqueModal.style.display = 'block';
    }

    // Função para fechar o modal ao clicar no botão de fechar
    spanCloseUnique.onclick = function() {
      uniqueModal.style.display = 'none';
    }

    // Função para fechar o modal ao clicar fora dele
    window.onclick = function(event) {
      if (event.target == uniqueModal) {
        uniqueModal.style.display = 'none';
      }
    }