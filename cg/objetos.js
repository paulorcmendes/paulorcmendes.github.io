function setPreenchimento(selecionado, contorno, preenchimento){
	if(selecionado){
		context.strokeStyle  = '#FF0000'
		context.fillStyle = '#FF0000'
	}else{
		context.strokeStyle  = contorno
		context.fillStyle = preenchimento
	}
}

function pickCodigo(x, y, xmin, xmax, ymin, ymax){
	var cod = [false, false, false, false]
	cod[0] = x < xmin
	cod[1] = x > xmax
	cod[2] = y < ymin
	cod[3] = y > ymax

	return cod
}
function calculaCentro(pontos){
	var x = 0.0, y=0.0;
	for (var i = 0; i < pontos.length; i++) {
		x += pontos[i].x
		y += pontos[i].y
	}
	x = x/pontos.length;
	y = y/pontos.length;
	novoPonto = new Ponto(x, y);
	return novoPonto;
}


var tol = 10
class Ponto{
	constructor(x, y){
		this.x = x
		this.y = y
		this.contorno = document.getElementById("contorno").value
		this.preenchimento = document.getElementById("preenchimento").value
		this.selecionado = false
		this.tipo = "ponto"
		this.centro = this;
	}

	pick(xA, yA){
		var xmin = xA - tol
		var xmax = xA + tol
		var ymin = yA - tol
		var ymax = yA + tol
		if(this.x > xmin && this.x < xmax && this.y > ymin && this.y < ymax){
			//this.selecionado = true			
			return true
		}else{
			//this.selecionado = false
			return false
		}
		//return this.selecionado
	}

	desenha(){
		setPreenchimento(this.selecionado, this.contorno, this.preenchimento)
		canvasPonto(this.x,this.y)
	}

	transforma(m){
		novoPonto = pontoTransformacao(m, this)
		novoPonto.preenchimento  = this.preenchimento
		novoPonto.contorno = this.contorno
		//this.x = novoPonto.x
		//this.y = novoPonto.y
		return novoPonto
	}

}

class Reta{
	constructor(p1,p2){
		this.p1 = p1
		this.p2 = p2
		this.contorno = document.getElementById("contorno").value
		this.preenchimento = document.getElementById("preenchimento").value
		this.selecionado = false
		this.tipo = "reta"
		this.centro = new Ponto((this.p1.x+this.p2.x)/2, (this.p1.y+this.p2.y)/2)
	}
	
	pick(xA, yA){
		var xmin = xA - tol
		var xmax = xA + tol
		var ymin = yA - tol
		var ymax = yA + tol

		var x0 = this.p1.x;
		var x1 = this.p2.x;
		var y0 = this.p1.y;
		var y1 = this.p2.y;

		var cod1 = pickCodigo(x1, y1, xmin, xmax, ymin, ymax);

		if(cod1[0] == false && cod1[1] == false && cod1[2] == false && cod1[3] == false){
			//this.selecionado = true;
			return true
		}else{
			do{
				var cod0 = pickCodigo(x0, y0, xmin, xmax, ymin, ymax);
				var i
				for (i = 0; i < 4; i++) {
					if (cod0[i] && cod1[i]) break;
				}
				if(i!=4) {
					//this.selecionado = false
					return false
					break
				}
				if(cod0[0]){
					y0 += (xmin-x0)*(y1-y0)/(x1-x0)
					x0 = xmin
				}else if(cod0[1]){
					y0 += (xmax-x0)*(y1-y0)/(x1-x0)
					x0 = xmax
				}else if(cod0[2]){
					x0+= (ymin-y0)*(x1-x0)/(y1-y0)
					y0 = ymin
				}else if(cod0[3]){
					x0 += (ymax-y0)*(x1-x0)/(y1-y0)
					y0 = ymax
				}else{
					//this.selecionado = true
					return true
					break
				}
			}while(1);	
					
		}

		//return this.selecionado
	}

	desenha(dashed = false){
		setPreenchimento(this.selecionado, this.contorno, this.preenchimento)
		canvasReta(this.p1.x, this.p1.y, this.p2.x, this.p2.y, dashed)
	}

	transforma(m){
		var novoP1 = this.p1.transforma(m);
		var novoP2 = this.p2.transforma(m);
		var reta = new Reta(novoP1, novoP2)
		reta.preenchimento  = this.preenchimento
		reta.contorno = this.contorno

		return reta
	}
}

class Poligono{
	constructor(pontos){
		this.pontos = pontos
		this.contorno = document.getElementById("contorno").value
		this.preenchimento = document.getElementById("preenchimento").value
		this.selecionado = false
		this.area = areaPoligono(pontos)
		this.tipo = "poligono"
		this.centro = calculaCentro(this.pontos)
	}
	pick(xA, yA){
		var x = xA
		var y = yA
		var ni = 0
		var ant = this.pontos.length-1

		for (var i = 0; i < this.pontos.length; i++) {
			var p1 = this.pontos[i]
			var p2 = this.pontos[ant]
			if(!(p1.y == p2.y) && !((p1.y>y)&&(p2.y>y))&&!((p1.y<y)&&(p2.y<y))&&!((p1.x<x)&&(p2.x<x))){
				if(p1.y == y){
					if((p1.x>x)&&(p2.y > y)) ni+=1
				}else{
					if(p2.y == y){
						if((p2.x>x)&&(p1.y>y)) ni+=1
					}else{
						if((p1.x>x)&&(p2.x>x)){
							ni+=1
						}else{
							var dx = p1.x - p2.x
							var xc = p1.x
							if(dx != 0.0){
								xc += (y - p1.y)*dx/(p1.y - p2.y)
								if(xc > x) ni+=1									
							}
						}
					}
				}
			}
			ant = i
		}

		//this.selecionado = (ni%2 == 1)
		
		return (ni%2 == 1)

	}
	desenha(){
		setPreenchimento(this.selecionado, this.contorno, this.preenchimento)
		canvasPoligono(this.pontos)
	}

	transforma(m){
		var novosPontos = []
		for (var i = 0; i < this.pontos.length; i++) {
			novosPontos.push(this.pontos[i].transforma(m));
		}
		var poligono = new Poligono(novosPontos)
		poligono.preenchimento  = this.preenchimento
		poligono.contorno = this.contorno
		return poligono
	}
}

class Circulo{
	constructor(centro, extremidade){
		this.centro = centro
		this.extremidade = extremidade
		this.raio = Math.sqrt((this.centro.x-this.extremidade.x)**2+(this.centro.y-this.extremidade.y)**2)
		this.area = Math.PI*(this.raio**2)
		this.contorno = document.getElementById("contorno").value
		this.preenchimento = document.getElementById("preenchimento").value
		this.selecionado = false
		this.tipo = "circulo"
	}
	pick(xA, yA){
		var x = xA
		var y = yA
		var dist = Math.sqrt((this.centro.x-x)**2+(this.centro.y-y)**2)		
		//this.selecionado = (dist <= this.raio)
		//console.log("dist:"+dist+"raio:"+this.raio+"selecionado: "+this.selecionado)
		return (dist <= this.raio)
	}
	desenha(){
		setPreenchimento(this.selecionado, this.contorno, this.preenchimento) 
		canvasCirculo(this.centro.x, this.centro.y, this.raio)
	}
	transforma(m){
		var novoCentro = this.centro.transforma(m)
		var novaExtremidade = this.extremidade.transforma(m)
		var novoCirculo = new Circulo(novoCentro, novaExtremidade)
		novoCirculo.preenchimento  = this.preenchimento
		novoCirculo.contorno = this.contorno
		return novoCirculo
	}
}

class Bezier{
	constructor(p1, p2, c1, c2){
		this.p1 = p1
		this.p2 = p2
		this.c1 = c1
		this.c2 = c2
		this.contorno = document.getElementById("contorno").value
		this.preenchimento = document.getElementById("preenchimento").value
		this.selecionado = false
		this.tipo = "bezier"
		this.centro = new Ponto((this.p1.x+this.p2.x)/2, (this.p1.y+this.p2.y)/2)
	}
	pick(xA, yA){
		return this.selecionado
	}
	desenha(){
		setPreenchimento(this.selecionado, this.contorno, this.preenchimento)
		canvasBezier(this.p1, this.p2, this.c1, this.c2)
	}
	transforma(m){
		var novoP1 = this.p1.transforma(m);
		var novoP2 = this.p2.transforma(m);
		var novoC1 = this.c1.transforma(m);
		var novoC2 = this.c2.transforma(m);
		var bezier = new Bezier(novoP1, novoP2, novoC1, novoC2)
		bezier.preenchimento  = this.preenchimento
		bezier.contorno = this.contorno

		return bezier
	}
}