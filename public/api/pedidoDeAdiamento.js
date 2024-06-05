// Função para formatar a data
function formatarData(data) {
    const dataObj = new Date(data);
    const dia = String(dataObj.getDate()).padStart(2, '0');
    const mes = String(dataObj.getMonth() + 1).padStart(2, '0'); // Mês começa do zero
    const ano = dataObj.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

// Função para aprovar o funeral
function aprovarFuneral(id_funeral) {
    if (!confirm("Tem certeza que deseja aprovar o adiamento deste funeral?")) {
        return;
    }

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            accessToken: localStorage.getItem('token'),
            id_funeral: id_funeral
        })
    };

    fetch(`${base_url}funerais/aprovar_adiamento`, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao aprovar funeral: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            alert("Funeral aprovado com sucesso");
            location.reload();
        })
        .catch(error => {
            console.error('Erro:', error);
            alert("Erro ao aprovar funeral");
        });
}

// Função para eliminar o funeral
function eliminarFuneral(id_funeral) {
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
            id_funeral: id_funeral
        })
    };

    fetch(`${base_url}funerais/`, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao eliminar funeral: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            alert("Funeral excluído com sucesso");
            location.reload();
        })
        .catch(error => {
            console.error('Erro:', error);
            alert("Erro ao eliminar funeral");
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
                // Criar uma nova linha
                const novaLinha = document.createElement('tr');
                if (dado.adiar == 0) {
                    novaLinha.innerHTML = `
                        <td>${dado.nome_completo}</td>
                        <td>${dado.filiacao}</td>
                        <td>${dado.causa_da_morte}</td>
                        <td>${formatarData(dado.data_de_falecimento)}</td>
                        <td>${formatarData(dado.data_de_sepultamento)}</td>
                        <td>${dado.localizacao}</td>
                        <td>
                            <button class="btn modal-approve" onclick="aprovarFuneral(${dado.id_funeral})">
                                <i class="fa fa-check" aria-hidden="true"></i>
                            </button>
                            <button class="btn modal-delete" onclick="eliminarFuneral(${dado.id_funeral})">
                                <i class="fa fa-close" aria-hidden="true"></i>
                            </button>
                        </td>
                    `;

                    // Adicionar a nova linha ao <tbody>
                    tbody.appendChild(novaLinha);
                }
            });
        })
        .catch(error => {
            console.error('Erro:', error);
        });
});
