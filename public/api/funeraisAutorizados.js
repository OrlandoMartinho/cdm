

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
function legalizarFuneral(id_funeral) {

    alert(id_funeral);
    localStorage.setItem('id_funeral', id_funeral);

    const dadosUser={
        accessToken:localStorage.getItem('token'),
        id_funeral:id_funeral
    }
    cadastrarNaApi(dadosUser)
            .then(data => {
                console.log(data);

                alert("pedido enviado  com sucesso");
                // Redirecionar para outra página, se necessário
                localStorage.setItem('rupe',data.rupe_gerado)
                window.location.href = "confirmar.html";
            })
            .catch(error => {
                if (error.message.includes('403')) {
                    alert("Erro");
                    location.reload()
                } else {
                    alert("Erro ao cadastrar usuário");
                }
                console.error("Erro ao fazer a requisição", error);
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
        if(dado.legalizado==2){
            novaLinha.innerHTML = `
            <td>${dado.nome_completo}</td>
            <td>${dado.filiacao}</td>
            <td>${dado.causa_da_morte}</td>
            <td>${formatarData(dado.data_de_falecimento)}</td>
            <td>${formatarData(dado.data_de_sepultamento)}</td>
            <td>${dado.localizacao}</td>
            <td>Legalizado</td>
        `;
        }else if(dado.legalizado==0){
            novaLinha.innerHTML = `
            <td>${dado.nome_completo}</td>
            <td>${dado.filiacao}</td>
            <td>${dado.causa_da_morte}</td>
            <td>${formatarData(dado.data_de_falecimento)}</td>
            <td>${formatarData(dado.data_de_sepultamento)}</td>
            <td>${dado.localizacao}</td>
            <td><button class="btn btn-link adia-funeral-btn" onclick="legalizarFuneral(${dado.id_funeral})">Legalizar Funeral</button></td>
        `;
        }
        else if(dado.legalizado==1){
            novaLinha.innerHTML = `
            <td>${dado.nome_completo}</td>
            <td>${dado.filiacao}</td>
            <td>${dado.causa_da_morte}</td>
            <td>${formatarData(dado.data_de_falecimento)}</td>
            <td>${formatarData(dado.data_de_sepultamento)}</td>
            <td>${dado.localizacao}</td>
            <td>Pedido de legalizacao</td>
        `;
        }
        // Adicionar a nova linha ao <tbody>
        tbody.appendChild(novaLinha);
      
                // Criar células para cada valor e adicioná-las à nova linha
               
            });
        })
        .catch(error => {
            console.error('Erro:', error);
        });
});
