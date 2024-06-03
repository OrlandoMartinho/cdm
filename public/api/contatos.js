
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function cadastrarContactos(dados) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    };

    return fetch(`${base_url}contatos/cadastrar`, requestOptions)
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

document.getElementById('enviar').addEventListener('click', () => {
    const name = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const mensagem = document.getElementById('mensagem').value;

    if (!name || !email || !mensagem) {
        alert('Verifique os dados informados');
    } else if (!emailRegex.test(email)) {
        alert('Por favor, insira um email válido');
    } else {
        const dadosUser = {
            email: email,
            nome: name,
            mensagem: mensagem
        };

        cadastrarContactos(dadosUser)
            .then(data => {
                console.log(data);
                alert("O seu contacto foi recebido. Em breve você será respondido.");
                // Limpar os campos do formulário após o sucesso
                document.getElementById('nome').value = '';
                document.getElementById('email').value = '';
                document.getElementById('mensagem').value = '';
            })
            .catch(error => {
                console.error("Erro ao fazer a requisição", error);
                alert("Houve um erro ao enviar seu contacto. Por favor, tente novamente.");
            });
    }
});
