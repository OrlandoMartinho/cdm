 // Função para formatar a data
 function formatarData(data) {
    const dataObj = new Date(data);
    const dia = String(dataObj.getDate()).padStart(2, '0');
    const mes = String(dataObj.getMonth() + 1).padStart(2, '0'); // Mês começa do zero
    const ano = dataObj.getFullYear();
    return `${dia}/${mes}/${ano}`;
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

    fetch(`${base_url}usuarios/listar`, requestOptions2)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao fazer a requisição: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);

            data.usuarios.forEach(dado => {
                console.log(data.usuarios)
                // Criar uma nova linha
                const novaLinha = document.createElement('tr');

                novaLinha.innerHTML = `
                    <td>${dado.id_usuario}</td>
                    <td>${dado.nome}</td>
                    <td>${dado.genero}</td>
                    <td>${dado.email}</td>
                    <td>${formatarData(dado.data_de_nascimento)}</td>
                    <td>${dado.morada}</td>
                    <td>${dado.telefone}</td>

                `;

                // Adicionar a nova linha ao <tbody>
                tbody.appendChild(novaLinha);
            });
        })
        .catch(error => {
            console.error('Erro:', error);
        });
});