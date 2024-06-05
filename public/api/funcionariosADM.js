 // Função para formatar a data
 function formatarData(data) {
    const dataObj = new Date(data);
    const dia = String(dataObj.getDate()).padStart(2, '0');
    const mes = String(dataObj.getMonth() + 1).padStart(2, '0'); // Mês começa do zero
    const ano = dataObj.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

function cadastrarNaApi(dados) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    };

    return fetch(`${base_url}funerais/legalizar`, requestOptions)
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

// Função para adiar o funeral


// Função para eliminar um funcionário
function eliminarFuncionario(id_usuario) {
    if (!confirm("Tem certeza que deseja excluir este funeral?")) {
        return;
    }
   
    const requestOptions = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            accessToken: localStorage.getItem('token'),
            id_usuario: id_usuario
        })

    };

    fetch(`${base_url}funcionarios/`, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao eliminar funcionário: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log(data)
            alert("Funcionário excluído com sucesso");
            location.reload();
        })
        .catch(error => {
            console.error('Erro:', error);
            alert("Erro ao eliminar funcionário");
        });
}

// Função para editar um funcionário
function editarFuncionario(id_usuario) {
    // Implementar lógica para editar funcionário
    alert(`Editar funcionário com ID: ${id_usuario}`);
}

document.addEventListener('DOMContentLoaded', () => {
    // Obter a referência do elemento <tbody>
    const tbody = document.querySelector('table.table tbody');

    const requestOptions2 = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            accessToken: localStorage.getItem("token")
        })
    };

    fetch(`${base_url}funcionarios/todos_funcionarios`, requestOptions2)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao fazer a requisição: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);

            data.funcionarios.forEach(dado => {
                // Criar uma nova linha
                const novaLinha = document.createElement('tr');

                novaLinha.innerHTML = `
                    <td>${dado.id_usuario}</td>
                    <td>${dado.nome}</td>
                    <td>${dado.genero}</td>
                    <td>${dado.numero_do_bi}</td>
                    <td>${formatarData(dado.data_de_nascimento)}</td>
                    <td>${formatarData(dado.data_de_ingresso)}</td>
                    <td>${dado.cargo}</td>
                    <td>${dado.email}</td>
                    <td>
                        <a href="#" class="btn modal-delete"><i class="fa fa-trash" aria-hidden="true" onclick="eliminarFuncionario(${dado.id_usuario})"></i></a>
                        <a href="#" class="btn modal-entrar"><i class="fa fa-edit" aria-hidden="true" onclick="editarFuncionario(${dado.id_usuario})"></i></a>
                    </td>
                `;

                // Adicionar a nova linha ao <tbody>
                tbody.appendChild(novaLinha);
            });
        })
        .catch(error => {
            console.error('Erro:', error);
        });
});