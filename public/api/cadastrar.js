const base_url='http://localhost:3000/'
function cadastrarNaApi(dados) {
    

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    };

    return fetch(`${base_url}usuarios/cadastrar`, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao fazer a requisição: ' + response.status);
            }
            if(response.status!='200'){
                return null
            }
            return response.json();
        })
        .catch(error => {
            console.error('Erro:', error);
            return null;
        });
}


alert('clicou') 
document.getElementById('cadastrar').addEventListener('click',()=> {
    alert('clicou') // Impede o envio do formulário para processar os dados com JS

    // Obtenha os valores dos inputs
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const genero = document.querySelector('input[name="genero"]:checked').value;
    const house = document.getElementById('house').value;
    const date = document.getElementById('date').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Imprima os valores no console (ou use-os conforme necessário)
    console.log('Nome completo:', name);
    console.log('Email ou número de telefone:', email);
    console.log('Gênero:', genero);
    console.log('Morada:', house);
    console.log('Data de Nascimento:', date);
    console.log('Palavra-passe:', password);
    console.log('Confirme Palavra-passe:', confirmPassword);

    // Aqui você pode adicionar a lógica para processar os dados do formulário, como enviar para o servidor

});