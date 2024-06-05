// Função para formatar a data
function formatarData(data) {
    const dataObj = new Date(data);
    const dia = String(dataObj.getDate()).padStart(2, '0');
    const mes = String(dataObj.getMonth() + 1).padStart(2, '0'); // Mês começa do zero
    const ano = dataObj.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

function adicionarLinhasTabela() {
    const requestOptions2 = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            accessToken: localStorage.getItem("token")
        })
    };
    
    fetch(`${base_url}contatos/listar`, requestOptions2)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao fazer a requisição: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            const tbody = document.getElementById('tbody');
            if (!tbody) {
                console.error('Elemento tbody não encontrado');
                return;
            }
            data.contatos.forEach(dado => {
                const novaLinha = document.createElement('tr');
                novaLinha.innerHTML = `
                    <td>${dado.nome}</td>
                    <td>${dado.mensagem}</td>
                    <td>${formatarData(dado.data_do_contato)}</td>
                `;
                // Adiciona evento de clique para cada linha da tabela
                novaLinha.addEventListener('click', function() {
                    // Salva o ID do contato no armazenamento local
                    localStorage.setItem('id_contato', dado.id_contato);
                    // Redireciona para outra página
                    window.location.href = 'outra_pagina.html';
                });
                tbody.appendChild(novaLinha);
            });
        })
        .catch(error => {
            console.error('Erro:', error);
        });
}


function eliminarNotificacoes() {
    if (confirm('Tem certeza de que deseja eliminar todas as notificações?')) {
        const requestOptions2 = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                accessToken: localStorage.getItem("token")
            })
        };
        
        fetch(`${base_url}contatos/listar`, requestOptions2)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao fazer a requisição: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                alert('Notificações eliminadas com sucesso!');
                const tbody = document.getElementById('tbody');
                if (tbody) {
                    tbody.innerHTML = ''; // Limpa a tabela após a exclusão
                }
            })
            .catch(error => {
                console.error('Erro:', error);
            });
    }
}

// Quando o conteúdo do DOM for carregado, adicione os dados à tabela
document.addEventListener('DOMContentLoaded', () => {
    adicionarLinhasTabela();
});

// Adicionar evento de clique ao botão de eliminação
//document.getElementById('eliminar').addEventListener('click', () => {
 //   eliminarNotificacoes();
//});
