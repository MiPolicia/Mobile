
var element = document.getElementById("menu");
var maxWidth=window.innerWidth;

element.height = maxWidth;
element.width = maxWidth ;
var canvas = new createjs.Stage(element);
canvas.enableMouseOver(10);
createjs.Touch.enable(canvas);
//canvas.setBounds(0,0,maxWidth,maxWidth);

      
      var sources = [
           'img/menu/btn_cuadrantes_1.png',
    	   'img/menu/btn_deposito_1.png',
    	   'img/menu/btn_turistico_1.png',
    	   	'img/menu/btn_eng_1.png',
    	   'img/menu/btn_privacidad_1.png',
    	   "img/logo con fondo.png"    	   
      ];
      var sources2 = [
                   'img/menu/btn_cuadrantes_2.png', 
                   'img/menu/btn_deposito_2.png',
              	   'img/menu/btn_turistico_2.png',
              	   	'img/menu/btn_eng_2.png',
              	   'img/menu/btn_privacidad_2.png',
              	   	"img/logo con fondo_rojo.png"
                ];
      
      var txt = [
                 "Ubicación de cuadrante",
                 "Deposito vehicular",
                 "Policia turistica",
                 "English Assistance",
                 "Protección de privacidad",
                 "Emergencia",                 
     ];

var center = (maxWidth/2);
var circleWidth = (maxWidth/6);
var circleRadio = (circleWidth/2);

var radio = (maxWidth*0.3);
var radio2 = (radio/5*4);
var realCenter = center-circleRadio;

function refreshCanvas() {
	canvas.update();	
}

var scale = circleWidth/ 82;

var scale2 = (maxWidth/6)/ 117;

var btns =[];

var createImage = function(x,y,src,scaleP) {
	var image = new Image();
	image.onload = refreshCanvas;
	image.src=src[0];
	var btn = new createjs.Bitmap(image);
	btn.y = x;
	btn.x = y;
	
	if(scaleP!=undefined) {
		btn.scaleX = scaleP
		btn.scaleY = scaleP;
	}else {
		btn.scaleX = scale;
		btn.scaleY = scale;
		
	}
	canvas.addChild(btn);
	btn.addEventListener("click", function(){
		$("#txt").html(src[2]);
		btn.image.src=src[1];
		for(b in btns) {
			if(sources[b]!= src[0]) {
				btns[b].image.src=sources[b];
			}else {
				procesaEvento(b);
			}
		}
		
		$("#menu").fadeOut(function(){
			$("#container").fadeIn();
		});
			
	});
	btns.push(btn);
}



var angulo = Math.PI*72/180;
var angulo2 = Math.PI*18/180;



createImage(realCenter-radio ,realCenter,[sources[0],sources2[0],txt[0]]);

createImage(realCenter - (radio*(Math.sin(angulo2))),realCenter + ((Math.cos(angulo2))*radio) ,[sources[1],sources2[1],txt[1]]);
createImage(realCenter + (radio*(Math.sin(angulo))),realCenter + ((1-Math.cos(angulo))*radio),[sources[2],sources2[2],txt[2]]);

createImage(realCenter + (radio*(Math.sin(angulo))),realCenter - ((1-Math.cos(angulo))*radio),[sources[3],sources2[3],txt[3]]);
createImage(realCenter - (radio*Math.sin(angulo2)),realCenter - ((Math.cos(angulo2))*radio),[sources[4],sources2[4],txt[4]]);

createImage(realCenter,realCenter,[sources[5],sources2[5],txt[5]],scale2);


$(document).ready(function(){
	$(".top").click(function(){
		$("#pol").fadeOut();
		$("#turistica").fadeOut();
		$("#reporte").fadeOut();
			$("#container").fadeOut(function(){
				$("#menu").fadeIn();
			
			});		
	});
	var imageField;
	$("#btnCamera").click(function(){
		navigator.camera.getPicture( function(image,location){
			$("#cameraPreview")[0].src="data:image/jpeg;base64," + image;
			imageField = image;		
		}, function(){
			
		}, { 
			  quality: 20,
		    destinationType: Camera.DestinationType.DATA_URL,
		    encodingType: Camera.EncodingType.JPEG
		} );
	});
	$("#enviar").click(function(){
		
		navigator.geolocation.getCurrentPosition(function(pos){
			  var crd = pos.coords;
			$.ajax({
				url:"http://monitorpolicia.appspot.com/api/report/submit",
				contentType:"application/x-www-form-urlencoded",
				method:"POST",
				data:{
					description:$("#description").val(),
					category:$("#category").val(),
					lat:crd.latitude,
					lon:crd.longitude,
					image:imageField								
				},
				complete:function(){
					alert("Registro enviado");
				}
			});
		});
	});
});

function procesaEvento(evento) {
	if(evento ==0) {
		$("#containerText").html("No se ha encontrado información del cuadrante actual");
		 navigator.geolocation.getCurrentPosition(function(pos){
			  var crd = pos.coords;
			  cuadrante_actual(crd.latitude,crd.longitude);			  
		 });
	}else if(evento==1){
		muestra_placas();
	}else if(evento==2){
		$("#turistica").fadeIn();
		$("#containerText").html("");
	}else if(evento==3){
		$("#containerText").html("Calling...");
		llamar(52089275);
	}else if(evento == 4) {
		$("#containerText").html("");
		$("#pol").fadeIn();		
	}else if(evento == 5) {
		$("#containerText").html("");
		$("#reporte").fadeIn();
	}
}
function llamar(tel){
	navigator.app.loadUrl("tel:"+tel, { openExternal: true });
}

function muestra_placas() {
	$("#containerText").html('<div class="containerPlacas"><img id="autoPlacas" src="img/auto_para_placas.png"/><input placeholder="Placas" id="placas" type="text" /><div id="dataPlaca"/><img id="btnPlacas" class="actionBtn" src="img/btn_buscar_2.png"/></div>');
	$("#btnPlacas").click(function(){
		corralon();
	});
}

function corralon() {
	var request = $.ajax({
        timeout:50000,
        url: "http://201.144.220.174/mpws/index.php/corralon/buscar_en_corralon",
        type: "POST",
        data: {
            key: 'A7b5aRdc74cM6501dd6Ca7146f13c7a3',
            placa: $("#placa").val()
        },
        dataType: "json"
    });
    request.done(function(msg) {
       
        if(msg.error != undefined ){
            
        }else if(msg.fechaYHoraRemolque != null){
            var telC = msg.telefonoCorralon;
            var telCt = telC.replace(" ","");
            
            $('#dataPlaca').html('<p>El vehículo con placas <strong>'+$("#placa").val()+'</strong> fué remolcado el día <strong>'+msg.fechaRemolque+'</strong> a las <strong>'+msg.horaRemolque+'</strong> horas al deposito <strong>'+msg.nombreCorralon+'</strong> ubicado en '+msg.direccionCorralon+'. <i> El domicilio puede variar por diversas razones, se sugiere hablar al número teléfonico indicado.</i> </p><a data-role="button" id="marcar_deposito" target="_blank" rel="external" data-theme="b" onclick="llamar('+telCt+')" href="#" data-icon="grid" data-iconpos="left">Tel. '+msg.telefonoCorralon+'</a>').trigger( "create" );
        }else{
        	$('#dataPlaca').html('No existen registros para el automóvil con placas '+$("#placa").val());        	
        }
        //append para poner el resultado de la consulta
        //si la respuesta es concluida, debera de ponerse un select para que el usuario defina que tal el trato
    });
}

function cuadrante_actual(lat, lng, callback){
    var idcd;    
    $.ajax({
        url: "http://201.144.220.174/pid/cuadrantesService/index.php/cuadrante_ajax/json_datos_cuadrante",
        type: "POST",
        data: {
                latitude_post: lat,
                longitude_post: lng
        },
        dataType: "json",
        success: function (data){
            if (data != undefined){
               /*
            	//poligono_cuadrante(data[0].idcd);
                //idcd = data[0].idcd;
                //document.getElementById("comandantes").innerHTML += data[0].zona + "<br/>";
                //alert(data[0].zona);
                */
                $("#containerText").html( 
                    "<span class='desc'>Zona:</span> " + data[0].zona + "<br/>" + 
                    "<span class='desc'>Delegación:</span> " + data[0].deleg + "<br/>" + 
                    "<span class='desc'>Sector:</span> " + data[0].sector + "<br/>" +
                    "<span class='desc'>Cuadrante:</span> " + data[0].nomenclatura + "<br/>" +
                    "<span class='desc'>Teléfono:</span> " + data[0].telefono + "<br/>" +
                    "<span class='desc'>ID Nextel:</span> " + data[0].idnextel + "<br/><br/>"+
                    "<a class='action llamar' onclick='llamar("+data[0].telefono+")' href='#'>&nbsp;</a>");
                
                /*hideModal();
                $('#marcar').show();
                $('#datos').show();
                $('#fuera_df').hide();
                callback(data[0].idcd);*/
            }else{
                alerta("Esta zona no esta cubierta por la Policía del Distrito Federal.", "Mensaje", "Aceptar");
                
                hideModal();
            }
        }
    });
}