document.addEventListener('DOMContentLoaded', () => {
    // Função para fazer a requisição para obter as notificações
    function obterNotificacoes() {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                accessToken: localStorage.getItem("token")
            })
        };

        fetch(`${base_url}notificacoes/`, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao fazer a requisição: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                const notificacoes = data.notificacoes.reverse(); // Reverte o array de notificações
                console.log(notificacoes); // Exibe o array de notificações revertido

                notificacoes.forEach(function(notificacao) {
                    adicionarNotificacao(notificacao.titulo, notificacao.descricao);
                });
            })
            .catch(error => {
                console.error('Erro:', error);
            });
    }

    function fazerObterUsuario(token) {
        const dados = {
            accessToken: token
        };
    
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        };
    
        return fetch(`${base_url}usuarios/obter_usuario_por_token`, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao fazer a requisição: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                return data;
            })
            .catch(error => {
                console.error('Erro:', error);
                return null;
            });
    }

    // Função para fazer a requisição para obter os dados do usuário
    function obterUsuario() {
        const token = localStorage.getItem("token");
        fazerObterUsuario(token)
            .then(data => {
                if (data) {
                    const data2=data.usuario
                    // Atualizar os dados do usuário no perfil
                    document.getElementById('nomeAtual').innerText = data2.nome;
                    document.getElementById('dataDeNascimentoAtual').innerText = new Date(data2.data_de_nascimento).toLocaleDateString('pt-BR');
                    document.getElementById('emailAtual').innerText = data2.email;
                } else {
                    console.error('Erro ao obter os dados do usuário');
                }
            });
    }

    // Função para adicionar notificações dinamicamente
    const adicionarNotificacao = (text, date) => {
        const notificationContent = document.getElementById('notificacoes-conteudo-modal');

        const notification = document.createElement('div');
        notification.className = 'notificacoes-conteudo-modal';
        notification.innerHTML = `
            <p>${text}</p>
            <div class="notificacoes-hora">
                <span>${date}</span>
            </div>
        `;

        notificationContent.appendChild(notification);
    };

    // Chamar as funções para obter notificações e dados do usuário ao carregar a página
    obterNotificacoes();
    obterUsuario();

    // Restante do seu código...
});
