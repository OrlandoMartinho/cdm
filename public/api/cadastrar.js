const base_url = 'http://localhost:3000/';

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
            return response.json();
        })
        .catch(error => {
            console.error('Erro:', error);
            throw error; // Propagar o erro para ser tratado pelo código que chama esta função
        });
}

document.getElementById('cadastrar').addEventListener('click', () => {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const genero = document.querySelector('input[name="genero"]:checked').value;
    const house = document.getElementById('house').value;
    const date = document.getElementById('date').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword || !name || !password || !genero || !email || !date || !house) {
        alert('Verifique os dados informados');
    } else {
        const dadosUser = {
            email: email,
            morada: house,
            nome: name,
            senha: password,
            genero: genero,
            data_de_nascimento: date
        };

        cadastrarNaApi(dadosUser)
            .then(data => {
                console.log(data);
                localStorage.setItem('token',data.accessToken)
                alert("Cadastro feito com sucesso");
                // Redirecionar para outra página, se necessário
                window.location.href = "home.html";
            })
            .catch(error => {
                if (error.message.includes('409')) {
                    alert("Usuário já cadastrado");
                    location.reload()
                } else {
                    alert("Erro ao cadastrar usuário");
                }
                console.error("Erro ao fazer a requisição", error);
            });
    }
});
