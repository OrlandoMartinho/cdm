const controlMensagem = document.querySelector('.control-mensagem');
const messageContainer = document.querySelector('.message');
function formatarData(data) {
    const dataObj = new Date(data);
    const dia = String(dataObj.getDate()).padStart(2, '0');
    const mes = String(dataObj.getMonth() + 1).padStart(2, '0'); // Mês começa do zero
    const ano = dataObj.getFullYear();
    return `${dia}/${mes}/${ano}`;
}





document.getElementById('eliminar').addEventListener('click',()=>{

   
        if (!confirm("Tem certeza que eliminar excluir este funcionário?")) {
            return;
        }else{
       
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                accessToken: localStorage.getItem('token'),
                id_contato: localStorage.getItem('id_contato')
            })
    
        };
    
        fetch(`${base_url}contatos/apagar`, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao eliminar funcionário: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                console.log(data)
                alert("Contato excluído com sucesso");
        
            })
            .catch(error => {
                console.error('Erro:', error);
                alert("Erro ao eliminar funcionário");
            });
        }
})

document.addEventListener('DOMContentLoaded', () => {
    
    
    const requestOptions2 = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            accessToken: localStorage.getItem("token"),
            id_contato:localStorage.getItem("id_contato")
        })
    };
    
    fetch(`${base_url}contatos/obterPorId`, requestOptions2)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao fazer a requisição: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            const contato=data.contato
            console.log()
            const mensagem = `
            <div class="d-flex justify-content-between mensagem">
                <h4>${contato.nome}</h4>
                <span>${formatarData(contato.data_do_contato)}</span>
            </div>
            <p><a href="mailto:${contato.email}" class="ative">&lt;${contato.email}&gt;</a></p>
            <div class="email-body">
            <p><a href="mailto:${contato.email}" class="ative">&lt;${contato.email}&gt;</a></p>
                <p>${contato.mensagem}</p>
            </div>
        `;
        messageContainer.innerHTML = mensagem;

        })
        .catch(error => {
            console.error('Erro:', error);
        });
    
});
