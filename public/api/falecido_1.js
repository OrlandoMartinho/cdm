document.addEventListener('DOMContentLoaded', () => {
    // Função para obter os valores do formulário e armazená-los no localStorage
    const obterEArmazenarValores = () => {
        // Obter os valores dos campos do formulário
        const nomeCompleto = document.getElementById('nomeResponsavel').value;
        const numeroObito = document.getElementById('obito').value;
        const filiacao = document.getElementById('Filiacao').value;
        const parentesco = document.getElementById('parentesco').value;
        const dataNascimento = document.getElementById('datadenascimento').value;
        const dataFalecimento = document.getElementById('dataFalecimento').value;
        const dataSepultamento = document.getElementById('datadesepultamento').value;
        const causaMorte = document.getElementById('descriacao').value;
           // Obter o valor do campo de Gênero
           const generoSelecionado = document.querySelector('input[name="genero"]:checked');
           const genero = generoSelecionado ? generoSelecionado.value : '';
   
           const nacionalidadeSelecionada = document.querySelector('input[name="nacionalidade"]:checked');
           const nacionalidade = nacionalidadeSelecionada ? nacionalidadeSelecionada.value : '';
        // Armazenar os valores no localStorage
        localStorage.setItem('nome_completo', nomeCompleto);
        localStorage.setItem('numero_do_assento_do_obito', numeroObito);
        localStorage.setItem('filiacao', filiacao);
        localStorage.setItem('genero', genero);
        localStorage.setItem('parentesco', parentesco);
        localStorage.setItem('nacionalidade', nacionalidade);
        localStorage.setItem('data_de_nascimento', dataNascimento);
        localStorage.setItem('data_de_falecimento', dataFalecimento);
        localStorage.setItem('data_de_sepultamento', dataSepultamento);
        localStorage.setItem('causa_da_morte', causaMorte);
        window.location.href = "gerirrup.html";
    };

    // Adicionar um ouvinte de evento ao botão "Seguinte"
    document.getElementById('avancar').addEventListener('click', () => {
        // Chamar a função para obter e armazenar os valores
        obterEArmazenarValores();
    });
});
