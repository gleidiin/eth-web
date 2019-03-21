let contrato;
let eth;


// Verifica se o metamask está ativo no browser
window.addEventListener('load', async () => {
  if (window.ethereum) {
    window.web3 = new Web3(ethereum);
    try {
      await ethereum.enable();
      document.getElementById('texto').innerText = 'MetaMask identificado, carregando contrato';
      await carregarContrato();
    } catch (error) {
      console.log(error);
    }
  }
  else if (window.web3) {
      window.web3 = new Web3(web3.currentProvider);
      document.getElementById('texto').innerText = 'MetaMask identificado, carregando contrato';
      await carregarContrato();
  }

  else {
    document.getElementById('texto').innerText = 'MetaMask não identificado.';
  }
});


// buscar todos os dados do contrato, inclusive sua ABI
let carregarContrato = async() => {

  const http = new XMLHttpRequest();
  const url = '/SimpleStorage.json';

  eth = new Eth(web3.currentProvider)

  http.open("GET", url);
  http.responseType = 'json';
  
  http.onload = (e) =>{
    const simpleStorage = http.response;
    contrato = eth.contract(JSON.parse(simpleStorage.interface)).at('0xF582862D80b277Ece8a12D1ea207CCD7328716CD');
    document.getElementById('texto').innerText = 'Contrato Carregado.';
    document.getElementById('contrato').style = '';
    atualizarValor();
  }
  
  http.send(null);
  
}


// atuliza valor do contrato
let atualizarValor = async () => {
  const valor = await contrato.get();
  document.getElementById('valor').innerText = valor[0].words[0];
}


// envia novo valor e limpa os campos
let setData = async () => {
  const value = Number(document.getElementById('input').value);

  if(!value) return;

  accounts = web3.eth.accounts;
  const tx = await contrato.set(value, { 
      from: accounts[0],
      gas: '1000000'
    });
  const li = document.createElement('li');
  li.innerHTML = `<a href="https://rinkeby.etherscan.io/tx/${tx}" target="_blank">${tx}</a> - <span>${value}</span>`;
  document.getElementById('lista').appendChild(li);

  atualizarValor();
}