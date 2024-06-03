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