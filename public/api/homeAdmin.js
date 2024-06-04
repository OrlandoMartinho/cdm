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
    
    fetch(`${base_url}usuarios/dashboard`, requestOptions2)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao fazer a requisição: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log(data)

            document.getElementById('usuarios').textContent = data.usuarios.length;
            document.getElementById('funcionarios').textContent = data.funcionarios.length;
            document.getElementById('funerais').textContent = data.funerais.length;
            document.getElementById('sepulturas').textContent = data.sepulturas.length;
        })
        .catch(error => {
            console.error('Erro:', error);
        });
});