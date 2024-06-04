function cadastrarNaApi(dados) {
    const requestOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    };

    return fetch(`${base_url}usuarios/`, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao fazer a requisição: ' + response.status);
            }
            return response.json();
        })
        .catch(error => {
            console.error('Erro:', error);
            throw error; // Propagar o erro para ser tratado pelo código que chama esta função
        });
}




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
                    adicionarNotificacao(notificacao.data_da_notificacao, notificacao.descricao);
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
                    let telefone=data.telefone;
                    if(data.telefone==null){
                        telefone = '00000000'
                    }
                    const data2=data.usuario
                    // Atualizar os dados do usuário no perfil
                    document.getElementById('nomeAtual').innerText = data2.nome;
                    document.getElementById('dataDeNascimentoAtual').innerText = new Date(data2.data_de_nascimento).toLocaleDateString('pt-BR');
                    document.getElementById('emailAtual').innerText = data2.email;
                    document.getElementById('telAtual').innerText =telefone
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

  
    obterNotificacoes();
    obterUsuario();

    
});

document.getElementById('salvar').addEventListener('click',()=>{


    const name = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const genero = document.querySelector('input[name="genero"]:checked').value;
    const house = document.getElementById('house').value;
    const date = document.getElementById('dataDeNascimento').value;
    const password = document.getElementById('senhaAntiga').value;
    const confirmPassword = document.getElementById('senhaNova').value;
    const telefone = document.getElementById('telemovel').value;

    if (!name || !password || !genero || !email || !date || !house||!telefone||password!=localStorage.getItem('senha')) {
        alert('Verifique os dados informados');
    } else {
        const dadosUser = {
            email: email,
            morada: house,
            nome: name,
            senha: confirmPassword,
            genero: genero,
            data_de_nascimento: date,
            telefone:telefone,
            accessToken:localStorage.getItem('token')
        };

        cadastrarNaApi(dadosUser)
            .then(data => {
                console.log(data);
                localStorage.setItem('token',data.novo_token)
                alert(" feito com sucesso");
                // Redirecionar para outra página, se necessário
                location.reload()
            })
            .catch(error => {
                if (error.message.includes('409')) {
                    location.reload()
                } else {
                    alert("Erro ao cadastrar usuário");
                }
                console.error("Erro ao fazer a requisição", error);
            });
    }


})
