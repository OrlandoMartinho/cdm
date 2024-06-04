// Selecionar o elemento <p> pelo id
const rupeElement = document.getElementById('rupe');

// Definir o valor desejado
const novoValorRupe = localStorage.getItem('rupe');

// Atribuir o novo valor ao elemento
rupeElement.innerText = novoValorRupe;