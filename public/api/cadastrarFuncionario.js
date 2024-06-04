
document.getElementById('cadastrar-btn').addEventListener('click', (event) => {
    event.preventDefault(); // Evita o envio do formulário padrão

    // Extrai os valores dos campos de formulário
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const bi = document.getElementById('bi').value;
    const genero = document.querySelector('input[name="genero"]:checked')?.value;
    const morada = document.getElementById('morada').value;
    const nascimento = document.getElementById('nascimento').value;
    const ingresso = document.getElementById('ingresso').value;
    const cargo = document.getElementById('cargo').value;
    const contacto = document.getElementById('contacto').value;
    alert(contacto+cargo+email+morada+name+cargo+nome+genero+nascimento+morada)
    // Exibe os valores no console (ou faça o que for necessário com eles)
    if (!contacto||!cargo||!email||!morada||!nome||!cargo||!nome||!genero||!nascimento||!morada) {
    alert("Complete bem os campos")
   }
    // Aqui você pode enviar os dados para o servidor, por exemplo, usando fetch:
    fetch('http://localhost:3000/funcionarios/cadastrar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            telefone: contacto,
            cargo: cargo,
            email: email,
            morada: morada,
            nome: nome,
            senha: '1234567890',
            genero: genero,
            data_de_nascimento: nascimento,
            data_de_ingresso: ingresso,
            accessToken: localStorage.getItem('token'),
            numero_do_bi: bi
        })
    })
    .then(response => {
        // Capture the response status code
        if (response.status === 200) {
            return response.json().then(data => {
                console.log('Success:', data);
                alert("Cadastrado com sucesso");
                location.reload();
            });
        } else if (response.status === 403) {
            return response.json().then(data => {
                console.error('Funcionário já existe:', data);
                alert("Funcionário já existe");
            });
        } else {
            return response.json().then(data => {
                console.error('Erro:', data);
                alert("Erro ao cadastrar funcionário");
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        // Aqui você pode adicionar lógica adicional, como exibição de mensagens de erro
    });
    
});
