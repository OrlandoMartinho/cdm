
document.getElementById('cadastrar').addEventListener('click', (event) => {
    const lote=document.getElementById('lote').value
    const quadra=document.getElementById('quadra').value
    // Exibe os valores no console (ou faça o que for necessário com eles)
    if (!lote||!quadra) {
    alert("Complete bem os campos")
   }
    // Aqui você pode enviar os dados para o servidor, por exemplo, usando fetch:
    fetch('http://localhost:3000/sepulturas/cadastrar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            numero_de_lote: lote,
            quadra: quadra,
            accessToken: localStorage.getItem('token'),
        })
    })
    .then(response => {
        // Capture the response status code
        if (response.status === 201) {
            return response.json().then(data => {
                console.log('Success:', data);
                alert("Cadastrado com sucesso");
                location.reload();
            });
        } else if (response.status === 403) {
            return response.json().then(data => {
                console.error('Erro :', data);
                alert("");
            });
        } else {
            return response.json().then(data => {
                console.error('Erro:', data);
                alert("Erro ao cadastrar ");
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        // Aqui você pode adicionar lógica adicional, como exibição de mensagens de erro
    });
    
});
