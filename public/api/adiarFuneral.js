function cadastrarNaApi(dados) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    };

    return fetch(`${base_url}funerais/adiar`, requestOptions)
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


document.getElementById('avancar').addEventListener('click', () => {
    const nova_data = document.getElementById('datadesepultamento').value;
    

    if (!nova_data) {
        alert('Verifique os dados informados');
    } else {
        const dadosUser = {
            data: nova_data,
            accessToken: localStorage.getItem('token'),
            id_funeral: localStorage.getItem('id_funeral')
        };

        cadastrarNaApi(dadosUser)
            .then(data => {
                console.log(data);

                alert("adiado  com sucesso");
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
});