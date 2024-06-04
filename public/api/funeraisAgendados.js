// Função para formatar a data
function formatarData(data) {
    const dataObj = new Date(data);
    const dia = String(dataObj.getDate()).padStart(2, '0');
    const mes = String(dataObj.getMonth() + 1).padStart(2, '0'); // Mês começa do zero
    const ano = dataObj.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

// Função para adiar o funeral
function adiarFuneral(id_funeral) {

    alert(id_funeral);
    localStorage.setItem('id_funeral', id_funeral);
   
    window.location.href = 'adiafuneral.html';
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
    
    fetch(`${base_url}funerais/todos_funerais_do_usuario`, requestOptions2)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao fazer a requisição: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log(data)
            data.funerais.forEach(dado => {
                // Criar uma nova linha
                const novaLinha = document.createElement('tr');
        if(dado.agendado==0){
            novaLinha.innerHTML = `
            <td>${dado.nome_completo}</td>
            <td>${dado.filiacao}</td>
            <td>${dado.causa_da_morte}</td>
            <td>${formatarData(dado.data_de_falecimento)}</td>
            <td>${formatarData(dado.data_de_sepultamento)}</td>
            <td>${dado.localizacao}</td>
            <td><button class="btn btn-link adia-funeral-btn" onclick="adiarFuneral(${dado.id_funeral})">Adia Funeral</button></td>
        `;

        // Adicionar a nova linha ao <tbody>
        tbody.appendChild(novaLinha);
        }
                // Criar células para cada valor e adicioná-las à nova linha
               
            });
        })
        .catch(error => {
            console.error('Erro:', error);
        });
});
