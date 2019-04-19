
var ultimoX 
var ultimoY
var pontos
var p1, p2
var estatico
var selecionados
var p_ini, p_fim, c_ini, c_fim
var qtdCliques = 0
var Sx, Sy
var originalPosition
var temp
var isMouseDown = false
function redesenha(){

	//canvas.width = window.innerWidth
	//canvas.height = window.innerHeight
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.strokeStyle  = document.getElementById("contorno").value
	context.fillStyle  = document.getElementById("preenchimento").value
	for (var i = 0; i < estatico.length; i++) {
		estatico[i].desenha()
	}
}

function moveuCanvas(evt){
	redesenha()
	var mouseX = evt.clientX - canvas.offsetLeft;
	var mouseY = evt.clientY - canvas.offsetTop;	
	
	var figura = null
	
	if(current == opcoes.selecao){
		var jaSelecionou = false
		for (var i = estatico.length-1; i >=0 ; i--) {
			if(!jaSelecionou){
				if(estatico[i].pick(mouseX, mouseY)){
					jaSelecionou = true		
					estatico[i].selecionado = true		
					if(estatico[i].hasOwnProperty("area")){
						canvasTexto(mouseX, mouseY, "Área: "+estatico[i].area)
					}
				}else{
					estatico[i].selecionado = false
				}
			}else{
				estatico[i].selecionado = false //deseleciono os de trás
			}
		}
	}
	else if(current == opcoes.angulo){
		var jaSelecionou = false
		for (var i = estatico.length-1; i >=0 ; i--) {
			if(!jaSelecionou){
				if(estatico[i].pick(mouseX, mouseY)){
					jaSelecionou = true		
					if(estatico[i].tipo == 'reta') estatico[i].selecionado = true	
					
				}else{
					estatico[i].selecionado = false
				}
			}else{
				estatico[i].selecionado = false //deseleciono os de trás
			}
		}
	}
	else if(current == opcoes.ponto){
		figura = new Ponto(mouseX,mouseY)
	}
	else if (current == opcoes.reta) {			
		if(qtdCliques == 1){
			p2 = new Ponto(mouseX, mouseY)
			figura = new Reta(p1, p2)		
		}		
	}else if (current == opcoes.poligono) {	
		if(qtdCliques == 1){	
			p2 = new Ponto(mouseX, mouseY)
			figura = new Reta(p1, p2)	
		}else if(qtdCliques>1){		
			var tempPonto = new Ponto(mouseX, mouseY)
			var tempPontos = pontos.slice()
			tempPontos.push(tempPonto)
			figura = new Poligono(tempPontos)	
		}
		
	}else if (current == opcoes.circulo) {
		//alert("Fazendo circulo")
		if(qtdCliques == 1){
			p2 = new Ponto(mouseX, mouseY)		
			figura = new Circulo(p1, p2)
		}
	}else if (current == opcoes.bezier) {
		//alert("Fazendo bezier")	
		if(qtdCliques > 0){
			if(qtdCliques == 1){
				p_fim = new Ponto(mouseX, mouseY)
				c_ini = p_fim
				c_fim = p_fim
			}else if(qtdCliques == 2){
				c_ini = new Ponto(mouseX, mouseY)
				c_fim = c_ini
				tempReta = new Reta(p_ini, c_ini)
				tempReta.desenha(dashed=true)
			}else if(qtdCliques == 3){
				c_fim = new Ponto(mouseX, mouseY)
				tempReta = new Reta(p_fim, c_fim)
				tempReta.desenha(dashed=true)
			}
			figura = new Bezier(p_ini, p_fim, c_ini, c_fim)
		}
	}else if (current == opcoes.escala) {
		if(qtdCliques == 0){
			var jaSelecionou = false
			for (var i = estatico.length-1; i >=0 ; i--) {
				if(!jaSelecionou){
					if(estatico[i].pick(mouseX, mouseY)){
						jaSelecionou = true		
						estatico[i].selecionado = true							
					}else{
						estatico[i].selecionado = false
					}
				}else{
					estatico[i].selecionado = false //deseleciono os de trás
				}
			}
		}
		if(qtdCliques == 1){
			p2 = new Ponto(mouseX, mouseY)
			r = new Reta(p1, p2)
			
			var vet = new Ponto(p2.x-p1.x, p2.y-p1.y)
			
			Sx = SdeVetor(vet.x)
			Sy = SdeVetor(vet.y)
			

			var mat = matEscalaPonto(Sx, Sy, selecionados[0].centro)
			temp = selecionados[0].transforma(mat)
			temp.selecionado = true
			estatico[originalPosition] = temp

			r.desenha(dashed=true)
			canvasTexto(mouseX, mouseY, "Sx: "+Sx.toFixed(2)+" Sy: "+Sy.toFixed(2))
		}
	}else if(current == opcoes.rotacao){
		if(qtdCliques == 0){
			var jaSelecionou = false
			for (var i = estatico.length-1; i >=0 ; i--) {
				if(!jaSelecionou){
					if(estatico[i].pick(mouseX, mouseY)){
						jaSelecionou = true		
						estatico[i].selecionado = true							
					}else{
						estatico[i].selecionado = false
					}
				}else{
					estatico[i].selecionado = false //deseleciono os de trás
				}
			}
		}
		if(qtdCliques == 1){
			p2 = new Ponto(mouseX, mouseY)
			r = new Reta(p1, p2)
			
			var vet = new Ponto(p2.x-p1.x, p2.y-p1.y)
			var sinTeta = vet.y/norma(vet)
			var cosTeta = vet.x/norma(vet)						

			var mat = matRotacaoPonto(sinTeta, cosTeta, selecionados[0].centro)
			temp = selecionados[0].transforma(mat)
			temp.selecionado = true
			estatico[originalPosition] = temp
			angulo = getAngulo(sinTeta, cosTeta)
			canvasArco(p1.x, p1.y, 20, angulo)
			r.desenha(dashed=true)
			canvasTexto(mouseX, mouseY, angulo.toFixed(2)+"º")
		}
	}else if(current == opcoes.translacao){
		if(qtdCliques == 0 ){			
			var jaSelecionou = false
			var pos = -1
			for (var i = estatico.length-1; i >=0 ; i--) {
				if(!jaSelecionou){
					if(estatico[i].pick(mouseX, mouseY)){
						jaSelecionou = true		
						estatico[i].selecionado = true							
						pos = i						
					}else{
						estatico[i].selecionado = false
					}
				}else{
					estatico[i].selecionado = false //deseleciono os de trás
				}
			}
			//canvasTexto(mouseX, mouseY, "mouse: "+isMouseDown+" pos "+pos)
			if(isMouseDown && pos >= 0){
				//alert("entrou")
				p1 = new Ponto(mouseX, mouseY)
				qtdCliques++
				selecionados.push(estatico[pos])
				originalPosition = pos
			}
		}
		else if(qtdCliques == 1 && isMouseDown){
			p2 = new Ponto(mouseX, mouseY)
			r = new Reta(p1, p2)
			var vet = new Ponto(p2.x-p1.x, p2.y-p1.y)
			var mat = matTranslacaoOrigem(vet.x, vet.y)
			temp = selecionados[0].transforma(mat)
			temp.selecionado = true
			estatico[originalPosition] = temp
			r.desenha(dashed=true)			
		}
		else if(qtdCliques == 1){			
			selecionados[0].selecionado = false
			qtdCliques = (qtdCliques+1)%2
			selecionados = []
		}
	}else if (current == opcoes.espelhamento) {
		if(qtdCliques == 0){
			var jaSelecionou = false
			for (var i = estatico.length-1; i >=0 ; i--) {
				if(!jaSelecionou){
					if(estatico[i].pick(mouseX, mouseY)){
						jaSelecionou = true		
						estatico[i].selecionado = true							
					}else{
						estatico[i].selecionado = false
					}
				}else{
					estatico[i].selecionado = false //deseleciono os de trás
				}
			}
		}else if(qtdCliques == 2){
			p2 = new Ponto(mouseX, mouseY)
			r = new Reta(p1, p2)
			var mat = matEspelhamentoReta(r)
			temp = selecionados[0].transforma(mat)
			estatico[originalPosition] = temp
			selecionados[0].desenha()
			r.desenha(dashed=true)
			canvasTexto((p1.x+p2.x)/2, (p1.y+p2.y)/2, "espelho")
		}
	}
	if(figura!=null)figura.desenha()

	
}

function canvasApp(){
	canvas = document.getElementById("MyCanvas");
	context = canvas.getContext("2d");
	canvas.width = window.innerWidth
	canvas.height = window.innerHeight*7/8
	qtdCliques = 0
	pontos = []
	estatico = []
	selecionados = []
	function draw(){		
		//atualizaCores()
	}
	
	draw()
}

function atualizaCores(){
	var contorno = document.getElementById("contorno");
	var preenchimento = document.getElementById("preenchimento");

	context.strokeStyle = contorno.value;
	context.fillStyle = preenchimento.value;
}

function clicouCanvas(evt){
	//atualizaCores()
	//var contorno = document.getElementById("contorno").value;
	//var preenchimento = document.getElementById("preenchimento").value;
	var mouseX = evt.clientX - canvas.offsetLeft;
	var mouseY = evt.clientY - canvas.offsetTop;

	//alert("Mouse: "+mouseX+", "+mouseY)
	if(current == opcoes.selecao){
		//alert("Fazendo Nada")

	}else if(current == opcoes.angulo){
		var jaSelecionou = false
		for (var i = estatico.length-1; i >=0 ; i--) {
			if(!jaSelecionou){
				if(estatico[i].pick(mouseX, mouseY)){
					jaSelecionou = true		
					if(estatico[i].tipo == "reta"){
						estatico[i].selecionado = true	
						selecionados.push(estatico[i])
					}					
				}else{
					estatico[i].selecionado = false
				}
			}else{
				estatico[i].selecionado = false //deseleciono os de trás
			}
		}
		if(selecionados.length == 2){
			var angulo = calcularAngulo(selecionados[0], selecionados[1])
			alert("Ângulo entre as retas é: "+angulo.toFixed(2))
			selecionados = []
		}
	}

	else if (current == opcoes.ponto) {
		//alert("Fazendo Ponto")		
		var p = new Ponto(mouseX, mouseY)		
		estatico.push(p)
		//p.desenha()
	}else if (current == opcoes.reta) {
		
		if(qtdCliques == 0){
			p1 = new Ponto(mouseX, mouseY)
			qtdCliques++
		}else if(qtdCliques == 1){
			p2 = new Ponto(mouseX, mouseY)
			var r = new Reta(p1, p2)
			estatico.push(r)
			//r.desenha()
			qtdCliques = 0			
		}
		//alert("Fazendo Reta")
		
	}else if (current == opcoes.poligono) {
		p1 = new Ponto(mouseX,mouseY)		
		if(qtdCliques == 0){	
			qtdCliques++	
			pontos = []
			pontos.push(p1)
		}else if(!checarIntersecaoAnteriores(p1)){//segmento válido
			pontos.push(p1)
			qtdCliques++						
		}
		
		//alert("Fazendo Poligono")
	}else if (current == opcoes.circulo) {
		//alert("Fazendo circulo")
		if(qtdCliques == 0){
			p1 = new Ponto(mouseX, mouseY)
			qtdCliques++
		}else{
			p2 = new Ponto(mouseX, mouseY)			
			qtdCliques = 0
			var c = new Circulo(p1, p2)
			estatico.push(c)
			//c.desenha()
		}
	}else if (current == opcoes.bezier) {
		//alert("Fazendo bezier")	
		if(qtdCliques == 0){
			p_ini = new Ponto(mouseX, mouseY)
		}else if(qtdCliques == 1){
			p_fim = new Ponto(mouseX, mouseY)
		}else if(qtdCliques == 2){
			c_ini = new Ponto(mouseX, mouseY)
		}else if(qtdCliques == 3){
			c_fim = new Ponto(mouseX, mouseY)
			var bezier = new Bezier(p_ini, p_fim, c_ini, c_fim)
			estatico.push(bezier)
			//bezier.desenha()
		}
		qtdCliques++
		qtdCliques = qtdCliques%4
	}
	else if (current == opcoes.escala || current == opcoes.rotacao) {
		if(qtdCliques == 0){
			var jaSelecionou = false
			for (var i = estatico.length-1; i >=0 ; i--) {
				if(!jaSelecionou){
					if(estatico[i].pick(mouseX, mouseY)){
						jaSelecionou = true		
						estatico[i].selecionado = true	
						selecionados.push(estatico[i])				
						//estatico.splice(i,1)
						originalPosition = i
					}else{
						estatico[i].selecionado = false
					}
				}else{
					estatico[i].selecionado = false //deseleciono os de trás
				}
			}
			if(jaSelecionou){
				p1 = selecionados[0].centro;
				qtdCliques = (qtdCliques+1)%2
			}
		}else if(qtdCliques == 1){
			p2 = new Ponto(mouseX, mouseY);
			qtdCliques = (qtdCliques+1)%2
			selecionados = []
		}
		
		
	}
	
	else if (current == opcoes.espelhamento) {
		if(qtdCliques == 0){
			var jaSelecionou = false
			for (var i = estatico.length-1; i >=0 ; i--) {
				if(!jaSelecionou){
					if(estatico[i].pick(mouseX, mouseY)){
						jaSelecionou = true		
						estatico[i].selecionado = true	
						selecionados.push(estatico[i])		
						originalPosition = i
					}else{
						estatico[i].selecionado = false
					}
				}else{
					estatico[i].selecionado = false //deseleciono os de trás
				}
			}
			if (jaSelecionou) {
				qtdCliques++
			}
		}else if(qtdCliques == 1){
			p1 = new Ponto(mouseX, mouseY)
			qtdCliques++
		}else if(qtdCliques == 2){
			p2 = new Ponto(mouseX, mouseY)
			qtdCliques = 0
			selecionados = []
		}

	}

}

function clicouDireito(evt){
	//alert("clicouDireito")
	if(current == opcoes.poligono){
		var mouseX = evt.clientX - canvas.offsetLeft;
		var mouseY = evt.clientY - canvas.offsetTop;
		p1 = new Ponto(mouseX,mouseY)
		if(!checarIntersecaoAnteriores(p1)){//segmento válido
			pontos.push(p1)
			qtdCliques++
			if(qtdCliques > 2){
				if(!checarIntersecaoAnteriores(pontos[0])){
					qtdCliques = 0;
					var poligono = new Poligono(pontos)
					estatico.push(poligono)
					//poligono.desenha()
				}
			}else{
				alert("Polígono precisa ter pelo menos três lados")
			}
		}
	}
	
}

function checarIntersecaoAnteriores(pontoAtual){
	var ultimoPonto = pontos[pontos.length-1]			
	var i
	for (i = 0; i < pontos.length - 1; i++) {
		var p1 = pontos[i]
		var p2 = pontos[i+1]
		if(haIntersecao(p1,p2,ultimoPonto, pontoAtual)){
			alert("Segmento inválido para o polígono  pois há interseção de segmentos")
			return true
		}
	}
	return false
}

function haIntersecao(a, b, c, d){
	var det = (d.x - c.x)*(b.y-a.y) - (d.y - c.y)*(b.x-a.x)

	if(det === 0.0){
		return false
	}

	var s = ((d.x - c.x) * (c.y - a.y) - (d.y - c.y) * (c.x - a.x))/ det ;
  	var t = ((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x))/ det ;

	return (s>0.0 && s<1.0 && t>0.0 && t<1.0)
}