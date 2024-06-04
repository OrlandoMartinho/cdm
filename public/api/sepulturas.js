// Função para formatar a data


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
    
    fetch(`${base_url}sepulturas/todas_sepulturas`, requestOptions2)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao fazer a requisição: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log(data.sepulturas)
            data.sepulturas.forEach(dado => {
                // Criar uma nova linha
                const novaLinha = document.createElement('tr');
     
            novaLinha.innerHTML = `
            <td>${dado.id_sepultura}</td>
            <td>${dado.quadra}</td>
            <td>${dado.numero_de_lote}</td>
    
        `;
        tbody.appendChild(novaLinha);
     
            });
        })
        .catch(error => {
            console.error('Erro:', error);
        });
});
