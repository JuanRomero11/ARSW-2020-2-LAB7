app = (function () {

    var cine;
    var fecha;
	var moduloApimock="js/apimock.js";
	var moduloApiclient="js/apiclient.js";
	var va=  {movie:{name:null,genre:null},seats:[],date:null};
    var datosApi;
	var rellenodata=false;
	
	
	var stompClient = null;
    var ticket = false;
    

  class Seat {
        constructor(row, col) {
            this.row = row;
            this.col = col;
        }
    }

    function buyTicket(){
        var row = $("#row").val();
        var column = $("#col").val();
        console.info("buying ticket at row: " + row + " col: " + column);
        verifyAvailability(row, column);
    }

    var connectAndSubscribe = function (callback) {
        console.info('Connecting to WS...');
        var socket = new SockJS('/stompendpoint');
        stompClient = Stomp.over(socket);

        //subscribe to /topic/TOPICXX when connections succeed
        stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);
            stompClient.subscribe('/topic/buyticket', function (message) {
                //alert("evento recibido");
                //var theObject = JSON.parse(message.body);
				callback(message);
				
            });
        });
    };


	 function validarEvento(evento) {
        var theObject = JSON.parse(evento.body);
        console.info(theObject);
        reDraw(theObject.row, theObject.col);///////////
		//getFunctionsByCinemaAndDate();
    }

	function reDraw(fila, columna) {
        var c = document.getElementById("canvitas");
        var ctx = c.getContext("2d");
        ctx.fillStyle = "#ff0000";
        ctx.fillRect((columna) * 50 , (fila) * 55 + 40 -55, 45, 40);
    }

	function getMousePosition() {
	        if (va == null) {
	            Swal.fire({
					  icon: 'error',
					  title: 'Seleccione funcion',
					})
	        } else {
	            if (!ticket) {ticket = true;}
	            $('#canvitas').click(function (c) {
	                var rect = canvitas.getBoundingClientRect();
	                var row = c.clientX - rect.left;
	                var col = c.clientY - rect.top;
	                disponibilidad(row, col);
	            });
	        }
	
	    };

    var verifyAvailability = function (row, col) {
        var st = new Seat(row, col);
		
		var flag=false;
		var y=40;
		for (var i=0;i< va.seats.length+1;i++){
			var x=0;
			for (var j=0; j <= va.seats[i].length; j++){
				if(va.seats[i][j]==true && row-1==i && col-1==j ){
					va.seats[i][j] = false;
		           Swal.fire({
					  icon: 'success',
					  title: 'Completdo',
					  text: 'ticket comprao',
					})
					stompClient.send("/topic/buyticket", {}, JSON.stringify(st));
					flag=true;
				}
				x+=50;
			}
			y+=55;
		} 
				if(!flag) {
            console.info("Ticket not available");
        }

    };

    
	function disponibilidad(x, y) {
        var c = document.getElementById("canvitas");
        var ctx = c.getContext("2d");
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        if (!(pixel[0] == 0 && pixel[1] == 153 && pixel[2] == 0 && pixel[3] == 255)) { 
        Swal.fire({
			  icon: 'error',
			  title: 'asiento ocupado',
			})
        } else {
            calcularAsiento(x, y);
        }
    }

	function calcularAsiento(x1, y1) {
        var row;
        var col;

		var y=40;
		var r=0;
		
		for (i of va.seats){
			r++;
			var c=0;
			var x=50;
			for (j of i){
				c++;
				if(x1>=x && x1<= x+50 && y1>=y && y1<= y+55 ){
					row=r;
					col=c;
				}
				
				x+=50;
				//atx.fillRect(x, y , 45, 40);
			}
			y+=55;
		}
        verifyAvailability(row, col);
	}
	
    function getFunctionsByCinemaAndDate() {
        cine = $("#nombre").val();
        fecha = $("#fecha").val();
        
        $.getScript(moduloApiclient, function(){
           api.getFunctionsByCinemaAndDate(cine, fecha, mapElemtosObjetos);
        });
    }

    function mapElemtosObjetos(datos) {
        var mapeoDatos = datos.map(function (val) {
            return {movieName: val.movie.name, 
				genre: val.movie.genre, 
				hour: val.date.substring(11, 16)};
        })
        rellenarTabla(mapeoDatos);
    }

    function rellenarTabla(datos) {
        var canvas = document.getElementById("canvitas");
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        datosApi =datos;
        $("#nombreCine").text("Cinema selected:"+cine);
        var tabla = $("table");
        var body = $("tbody");
        if (body != null) {body.remove();}
        
		tabla.append("<tbody>");
		var tblBody = $("tbody");
                
		datos.map(function(movie){
                    va.movie.name= movie.movieName;
                    va.movie.genre= movie.genre;
            var fila = '<tr><td>' + movie.movieName + '</td><td>' 
				+ movie.genre + '</td><td>' 
				+ movie.hour + '</td><td>' + 
				"<input type='button' class='show' value='Disponibilidad' onclick=" + 
				"app.busquedaSillas()" + 
				"></input>" + '</tr>';
            tblBody.append(fila);
        })
		if(rellenodata){app.busquedaSillas(); rellenodata=false;}
        tabla.append(tblBody);
        tabla.append("</tbody>");
    }



    function busquedaSillas() {
        var canvas = document.getElementById("canvitas");
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        var movieName;
        var hora;
        datosApi.map(function(val){
            movieName = val.movieName;
            hora = val.hour;
        })
        $("#moviename").text("Seats:"+movieName);
        $.getScript(moduloApiclient, function(){
            
            api.getFunctionByNameAndDate(cine,fecha,movieName,insertarSillas);
        });
    }

    function insertarSillas(datos) {
        va.seats = datos;
        
        // var asientos = datos.seats;
        var a = document.getElementById("canvitas");
        var atx = a.getContext("2d");
		var y=40;
		for (i of datos){
			var x=0;
			for (j of i){
				atx.fillStyle = "#009900";
				if(j==false){
					atx.fillStyle = "#ff0000";
				}
				x+=50;
				atx.fillRect(x, y , 45, 40);
			}
			y+=55;
		}
    }

   function salvar(){
	
	var newDate = $("#nombre1").val();
	if(rellenodata){
		newFunction();
		rellenodata=false;
	}else{
        va.date=newDate;
        fecha=newDate;
        console.info(va);
        console.info(cine);
		$.getScript(moduloApiclient, function(){api.update(cine,va);});
	        app.getFunctionsByCinemaAndDate();
	    }
	}
	
	function newFunction(){
		var fecha = $("#nombre1").val();
        cine = $("#nombre").val();
        var movieNam = $("#movieNew").val();
        var genreNam = $("#genreNew").val();
		var sillas = [[true, true, true, true, true, true, true, true, true, true, true, true], [true, true, true, true, true, true, true, true, true, true, true, true], [true, true, true, true, true, true, true, true, true, true, true, true], [true, true, true, true, true, true, true, true, true, true, true, true], [true, true, true, true, true, true, true, true, true, true, true, true], [true, true, true, true, true, true, true, true, true, true, true, true], [true, true, true, true, true, true, true, true, true, true, true, true]];
        
		var map = {
            "movie": {"name": movieNam, "genre": genreNam},
            "seats": sillas,
            "date": fecha 
        };
        
		$.getScript(moduloApiclient, function () {
            api.crear(cine, map);
        });
 		
		rellenodata=true;
		
		var canvas = document.getElementById("canvitas");
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
		
        getFunctionsByCinemaAndDate();

	}
	
	function rellenarInfo(){
			
		var nFecha = $("#fecha1");
        var nMovie= '<label id="nMovie" for="nombre">Movie name:</label>'
        var nGenre= '<label id="nGenre" for="nombre">Movie genre:</label>'
        var inMovie = '<input type="text" id="movieNew" name="movie" placeholder="Movie name">';
        var inGenre = '<input type="text" id="genreNew" name="genre" placeholder="Genre">';
        var id1 = '<br id="id1">';
        var id2 = '<br id="id2">';

		nFecha.append(nMovie);
        nFecha.append(inMovie);
        nFecha.append(id1);
        nFecha.append(nGenre);
        nFecha.append(inGenre);
        nFecha.append(id2);
		
		rellenodata=true;

		}
		
	function deleteF(){
		
		
		cine = $("#nombre").val();
        var map = {
            "movie": va.movie,
            "seats": va.seats,
            "date": fecha
        };
		console.info(va.movie+ "  "+  fecha);
        $.getScript(moduloApiclient, function () {
            api.borrar(cine, map);
        });
	}
		
	
    function init(){
        connectAndSubscribe(validarEvento);

    }

    return {
        getFunctionsByCinemaAndDate: getFunctionsByCinemaAndDate,
        busquedaSillas: busquedaSillas,
        salvar:salvar,
		rellenarInfo:rellenarInfo,
		deleteF:deleteF,
		init: init,
        buyTicket: buyTicket,
		getMousePosition: getMousePosition
        
    }

})();
