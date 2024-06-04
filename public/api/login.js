
const base_url = 'http://localhost:3000/';


const dados = {
    accessToken: localStorage.getItem("token"),
};

const requestOptions = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(dados)
};

fetch(`${base_url}`, requestOptions)
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao fazer a requisição: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log(data.mensagem)
        if (data.mensagem === true) {
            if(data.usuarioTipo==0){
                window.location.href = "admin.html";
            }else if(data.usuarioTipo==1){
                //window.location.href = "pages/home.html";
                alert('tela do funcionario')
            }else if(data.usuarioTipo==2){
                window.location.href = "home.html";
            } 
        }
    })
    .catch(error => {
        console.error('Erro:', error);
    });


function fazerLoginNaApi(senha, email) {
    const dados = {
        senha: senha,
        email: email
    };

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    };

    return fetch(`${base_url}usuarios/login`, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao fazer a requisição: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error('Erro:', error);
            return null;
        });
}

document.getElementById('entrar').addEventListener("click", function () {
    const senha = document.getElementById('password').value;
    const email = document.getElementById('email').value;
    console.log(email,senha)
    fazerLoginNaApi(senha, email)
        .then(data => {
            console.log(data)
            if (data) {
                alert('Login bem-sucedido!');
                localStorage.setItem('senha',senha)
                localStorage.setItem("token",data.accessToken)
                if(data.usuarioTipo==0){
                    window.location.href = "admin.html";
                }else if(data.usuarioTipo==1){
                    window.location.href = "pages/funcionario.html";
                }else if(data.usuarioTipo==2){
                    window.location.href = "home.html";
                }
  
            } else {
                alert('Credenciais inválidas'); // Mensagem de erro
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao fazer login: ' + error.message); // Exibe erro no login
        });
});


