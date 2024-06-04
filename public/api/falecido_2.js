

function cadastrarNaApi(dados) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    };

    return fetch(`${base_url}funerais/cadastrar`, requestOptions)
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
    // Função para obter os valores do formulário e armazená-los no localStorage
    const obterEArmazenarValores = () => {
        // Obter os valores dos campos do formulário
        const nomeCompleto = document.getElementById('nomeCompleto').value;
        const numeroBi = document.getElementById('numeroBi').value;
       
     
       const dados= {
        genero:localStorage.getItem('genero'),
        numero_do_bi:numeroBi,
        nome_do_responsavel:nomeCompleto,
        nome_completo:localStorage.getItem('nome_completo'),
        filiacao:localStorage.getItem('filiacao'),
        causa_da_morte:localStorage.getItem('causa_da_morte'),
        data_de_nascimento:localStorage.getItem('data_de_nascimento'),
        data_de_falecimento:localStorage.getItem('data_de_falecimento'),
        data_de_sepultamento:localStorage.getItem('data_de_sepultamento'),
        nacionalidade:localStorage.getItem('nacionalidade'),
        numero_do_acento_do_obito:localStorage.getItem('numero_do_assento_do_obito'),
        parentesco:localStorage.getItem('parentesco'),
        accessToken:localStorage.getItem('token')}
       // window.location.href = "confirmar.html";

        cadastrarNaApi(dados)
        .then(data=>{
            console.log(data)
            localStorage.setItem('rupe',data.rupe_gerado)
            alert("Funeral cadstrado com sucesso")
            window.location.href = "confirmar.html";
        })
        .catch(error=>{
            console.log("Erro:",error)
            alert("Seputuras ocupadas ou verifica se o servidor está rodando")
        })





    };

    // Adicionar um ouvinte de evento ao botão "Seguinte"
    document.getElementById('avancar').addEventListener('click', () => {
        // Chamar a função para obter e armazenar os valores
        obterEArmazenarValores();
    });
});
