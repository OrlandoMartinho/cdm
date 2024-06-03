

function gerarCodigoDeVerificacao() {
    const min = 10000000000000000000; // Menor número de 4 dígitos
    const max = 99999999999999999999; // Maior número de 4 dígitos
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports=gerarCodigoDeVerificacao;