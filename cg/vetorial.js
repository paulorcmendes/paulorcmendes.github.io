function SdeVetor(coord){
	var S = coord/60
	if(S > 0){
		if (S < 1) {
			S = 1
		}
	}else{
		S = -1*S
		if(S < 1){
			S = 1
		}
		S = 1/S
	}
	return S
}
function matEscalaPonto(Sx, Sy, p){
	var result = matTranslacaoOrigem(p.x, p.y)
	result = multiplicaMatrizes(result, matEscalaOrigem(Sx, Sy))
	result = multiplicaMatrizes(result, matTranslacaoOrigem(-p.x, -p.y))

	return result
}

function matRotacaoPonto(sinTeta, cosTeta, p){
	var result = matTranslacaoOrigem(p.x, p.y)
	result = multiplicaMatrizes(result, matRotacaoOrigem(sinTeta, cosTeta))
	result = multiplicaMatrizes(result, matTranslacaoOrigem(-p.x, -p.y))

	return result
}

function matEspelhamentoReta(r){
	var m = (r.p2.y-r.p1.y)/(r.p2.x-r.p1.x)
	var n = -m*r.p1.x+r.p1.y
	var hip = norma(new Ponto(r.p2.x-r.p1.x, r.p2.y-r.p1.y))
	var sinTeta = (r.p2.y-r.p1.y)/hip
	var cosTeta = (r.p2.x-r.p1.x)/hip

	var result = matTranslacaoOrigem(0, n)
	result = multiplicaMatrizes(result, matRotacaoOrigem(sinTeta, cosTeta))
	result = multiplicaMatrizes(result, matEspelhamentoX())
	result = multiplicaMatrizes(result, matRotacaoOrigem(-sinTeta, cosTeta))
	result = multiplicaMatrizes(result, matTranslacaoOrigem(0, -n))

	return result
}

function matEscalaOrigem(Sx, Sy){
	var mat = [[Sx, 0, 0],[0, Sy, 0],[0,0,1]]
	return mat
}

function matRotacaoOrigem(sinTeta, cosTeta){
	var mat = [[cosTeta, -sinTeta, 0],[sinTeta, cosTeta, 0],[0,0,1]]
	return mat
}

function matTranslacaoOrigem(tx, ty){
	var mat = [[1, 0, tx],[0, 1, ty],[0,0,1]]
	return mat
}

function matEspelhamentoX(){
	var mat = [[1,0,0], [0,-1,0], [0,0,1]]
	return mat
}

function multiplicaMatrizes(m1, m2) {
    var result = [];
    for (var i = 0; i < m1.length; i++) {
        result[i] = [];
        for (var j = 0; j < m2[0].length; j++) {
            var sum = 0;
            for (var k = 0; k < m1[0].length; k++) {
                sum += m1[i][k] * m2[k][j];
            }
            result[i][j] = sum;
        }
    }
    return result;
}

function pontoTransformacao(m, p){
	var mp = [[p.x], [p.y], [1]]
	var result = multiplicaMatrizes(m, mp)
	novoPonto = new Ponto(result[0][0], result[1][0])
	return novoPonto
}

function produtoVetorial2D(p1, p2){
	var prod = p1.x*p2.y-p2.x*p1.y
	return prod
}

function produtoEscalar(v1, v2){
	return v1.x*v2.x+v1.y*v2.y
}

function norma(v){
	return Math.sqrt((v.x**2)+(v.y**2))
}

function areaPoligono(pontos){
	var area = 0
	var ant = pontos.length-1
	for (var i = 0; i < pontos.length; i++) {
		area += produtoVetorial2D(pontos[ant], pontos[i])
		ant = i
	}
	area = area/2
	if(area < 0) area *= -1
	return area
}

function calcularAngulo(r1, r2){
	var vet1 = new Ponto(r1.p2.x-r1.p1.x, r1.p2.y-r1.p1.y)
	var vet2 = new Ponto(r2.p2.x-r2.p1.x, r2.p2.y-r2.p1.y)

	var cos = produtoEscalar(vet1, vet2)/(norma(vet1)*(norma(vet2)))
	return Math.acos(cos)*180/Math.PI
}

function getAngulo(sinTeta, cosTeta){
	var ang = Math.acos(cosTeta)*180/Math.PI
	if(sinTeta > 0){
		ang = 360 - ang
	}
	return ang
}