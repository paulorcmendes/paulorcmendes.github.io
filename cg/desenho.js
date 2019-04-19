
function canvasPonto(x, y){
	//context.fillRect(x,y,2,2);
	canvasCirculo(x,y, 2)
}

function canvasReta(x_ini, y_ini, x_fim, y_fim, dashed){
	if(dashed){
		context.setLineDash([5, 15]);
	}else{
		context.setLineDash([]);
	}

	context.beginPath();
	context.moveTo(x_ini, y_ini)
	context.lineTo(x_fim, y_fim)
	context.stroke()	
}


function canvasPoligono(pontos){
	context.setLineDash([]);
	context.beginPath()
	context.moveTo(pontos[0].x, pontos[0].y);	

	for (var i = 1; i < pontos.length; i++) {
		context.lineTo(pontos[i].x, pontos[i].y)
	}
	context.closePath()
	context.fill()
	context.stroke()
}

function apagarDesenho(){
	context.clearRect(0, 0, canvas.width, canvas.height);	
	canvasApp()
}

function canvasCirculo(x, y, raio){
	context.setLineDash([]);
	context.beginPath();
	context.arc(x, y, raio, 0, 2 * Math.PI);
	context.fill();
	context.stroke();
}

function canvasArco(x, y, raio, angulo){
	context.strokeStyle = "#37ff53"
	context.setLineDash([]);
	context.beginPath();
	context.arc(x, y, raio, -angulo*Math.PI/180, 0);
	context.stroke();
}

function canvasBezier(p_ini, p_fim, c_ini, c_fim){
	context.setLineDash([]);
	context.beginPath();
	context.moveTo(p_ini.x, p_ini.y)
	context.bezierCurveTo(c_ini.x, c_ini.y, c_fim.x, c_fim.y, p_fim.x, p_fim.y)
	context.stroke();
}

function canvasTexto(x, y, texto){
	context.font = "20px Arial";
	context.fillStyle = "#000000"
	context.fillText(texto, x, y);
}