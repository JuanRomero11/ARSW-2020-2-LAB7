app = (function () {

    var cine;
    var fecha;
	var moduloApimock="js/apimock.js";
	var moduloApiclient="js/apiclient.js";
	var va=  {movie:{name:null,genre:null},seats:[],date:null};
    var datosApi;
	var rellenodata=false;
	
	var stompClient = null;
    
       

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

    var connectAndSubscribe = function () {
        console.info('Connecting to WS...');
        var socket = new SockJS('/stompendpoint');
        stompClient = Stomp.over(socket);

        //subscribe to /topic/TOPICXX when connections succeed
        stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);
            stompClient.subscribe('/topic/buyticket', function (message) {
                alert("evento recibido");
                var theObject = JSON.parse(message.body);

            });
        });
    };

    var verifyAvailability = function (row, col) {
        var st = new Seat(row, col);
		var seats = va.seats;
        if (seats[row][col] === true) {
            seats[row][col] = false;
            console.info("purchased ticket");
            stompClient.send("/topic/buyticket", {}, JSON.stringify(st));

        } else {
            console.info("Ticket not available");
        }

    };

    

    function getFunctionsByCinemaAndDate() {
        cine = $("#nombre").val();
        fecha = $("#fecha").val();
        
        console.info(fecha);
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
            
            console.info(" entreeeeeee ");
            api.getFunctionByNameAndDate(cine,fecha,movieName,insertarSillas);
            console.info(" saliiiiiiiiiii ");
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
				atx.fillStyle = "gray";
				if(j==false){
					atx.fillStyle = "cyan";
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
        connectAndSubscribe();

    }

    return {
        getFunctionsByCinemaAndDate: getFunctionsByCinemaAndDate,
        busquedaSillas: busquedaSillas,
        salvar:salvar,
		rellenarInfo:rellenarInfo,
		deleteF:deleteF,
		init: init,
        buyTicket: buyTicket
        
    }

})();
