

var opcoes = {selecao:-1,ponto:0, reta: 1, poligono: 2, circulo: 3, bezier: 4, angulo:5, escala: 6, rotacao: 7, translacao: 8, espelhamento: 9}

var current = opcoes.selecao

function qualquerOpcao(){

	qtdCliques = 0
}

function desenharPonto(){
	current = opcoes.ponto;
	qualquerOpcao()
}

function desenharReta(){
	current = opcoes.reta;
	qualquerOpcao()
}

function desenharPoligono(){
	current = opcoes.poligono;
	qualquerOpcao()
}

function desenharCirculo(){
	current = opcoes.circulo;
	qualquerOpcao()
}

function desenharBezier(){
	current = opcoes.bezier;
	qualquerOpcao()
}

function selecao(){
	current = opcoes.selecao;
}

function angulo(){
	current = opcoes.angulo
}

function escala(){
	current = opcoes.escala
}

function rotacao(){
	current = opcoes.rotacao
}

function translacao(){
	current = opcoes.translacao
}

function espelhamento(){
	current = opcoes.espelhamento
}

function apagar(){
	current = opcoes.selecao
	apagarDesenho()	
}




