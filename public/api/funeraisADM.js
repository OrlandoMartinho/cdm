 // Função para formatar a data
 function formatarData(data) {
    const dataObj = new Date(data);
    const dia = String(dataObj.getDate()).padStart(2, '0');
    const mes = String(dataObj.getMonth() + 1).padStart(2, '0'); // Mês começa do zero
    const ano = dataObj.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

function eliminarFuneral(id_usuario) {
    if (!confirm("Tem certeza que deseja excluir este funcionário?")) {
        return;
    }
   
    const requestOptions = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            accessToken: localStorage.getItem('token'),
            id_funeral: id_usuario
        })

    };

    fetch(`${base_url}funerais/`, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao eliminar funcionário: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log(data)
            alert("Funeral excluído com sucesso");
            location.reload();
        })
        .catch(error => {
            console.error('Erro:', error);
            alert("Erro ao eliminar funcionário");
        });
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

    fetch(`${base_url}funerais/todos_funerais`, requestOptions2)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao fazer a requisição: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);

            data.funerais.forEach(dado => {
                console.log(data.usuarios)
                // Criar uma nova linha
                const novaLinha = document.createElement('tr');

                novaLinha.innerHTML = `
                    <td>${dado.id_funeral}</td>
                    <td>${dado.nome_do_responsavel}</td>
                    <td>${dado.nome_completo}</td>
                    <td>${dado.genero}</td>
                    <td>${dado.filiacao}</td>
                    <td>${dado.nacionalidade}</td>
                    <td>${formatarData(dado.data_de_falecimento)}</td>
                    <td>${dado.localizacao}</td>
                    <td>${dado.rupe}</td>
                    <td>
                        <a href="#" class="btn modal-delete"><i class="fa fa-trash" aria-hidden="true" onclick="eliminarFuneral(${dado.id_funeral})"></i></a>
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