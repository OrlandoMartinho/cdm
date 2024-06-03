var notificacoesModal = document.getElementById('notificacoes-modal');
var btnOpennotificacoes = document.getElementById('opennotificacoes-modal');
var spannotificacoesclose = document.getElementsByClassName('notificacoes-close')[0];

    // Função para abrir o modal
    btnOpennotificacoes.onclick = function() {
      notificacoesModal.style.display = 'block';
    }

    // Função para fechar o modal ao clicar no botão de fechar
    spannotificacoesclose.onclick = function() {
      notificacoesModal.style.display = 'none';
    }

    // Função para fechar o modal ao clicar fora dele
    window.onclick = function(event) {
      if (event.target == notificacoesModal) {
        notificacoesModal.style.display = 'none';
      }
    }