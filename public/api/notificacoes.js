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
    
    fetch(`${base_url}notificacoes/listar`, requestOptions2)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao fazer a requisição: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log(data.notificacoes);
            const tbody = document.getElementById('tbody');
            if (!tbody) {
                console.error('Elemento tbody não encontrado');
                return;
            }
            data.notificacoes.forEach(dado => {
                const novaLinha = document.createElement('tr');
                novaLinha.innerHTML = `
                    <td>${dado.descricao}</td>
                    <td>${formatarData(dado.data_da_notificacao)}</td>
                `;
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
        
        fetch(`${base_url}notificacoes/`, requestOptions2)
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
document.getElementById('eliminar').addEventListener('click', () => {
    eliminarNotificacoes();
});
