api = (function () {


    function getFunctionsByCinema(cinema_name, callback) {//cinemas/{nombre}
        $.getJSON("http://localhost:8080/cinemas/" + cinema_name, function (data) {
            callback(data);
        });
    }
    /**
    function getFunctionByMovieName(cinema_name,  movie_name, fdate,callback) {///cinemas//{nombre}/{fecha}/{nombrePelicula}
        $.getJSON("http://localhost:8080/cinemas/" +cinema_name+"/"+movie_name+"/"+ fdate, function (data) {
            callback(data);
        });
    }
    **/

    function getFunctionsByCinemaAndDate(cinema_name, fdate, callback) {//cinemas/{nombre}/{fecha}
        $.getJSON("http://localhost:8080/cinemas/" + cinema_name +"/"+ fdate, function (data) {
            callback(data);
        });
    }

    function getFunctionByNameAndDate(cinema_name, fdate, movie_name, callback) {//cinemas//{nombre}/{fecha}/{nombrePelicula}
        $.getJSON("http://localhost:8080/cinemas/"+cinema_name+"/"+ fdate+"/"+movie_name, function (data) {
            callback(data);
        });
    }

    function update(cinema_name, cc){
	var cinemaFunction = JSON.stringify(cc);
        const promise = new Promise((resolve, reject) => {
            $.ajax({
                url: "http://localhost:8080/cinemas/" + cinema_name,
                type: 'PUT',
                data: cinemaFunction,
                contentType: "application/json"
            }).done(function () {
                resolve('SUCCESS');

            }).fail(function (msg) {
                reject('FAIL');
            });
        });
        
            
    }
	
	function crear(cine, funcion){
        var fun = JSON.stringify(funcion);

        const promise = new Promise((resolve, reject) => {
            $.ajax({
                url: "http://localhost:8080/cinemas/" + cine,
                type: 'POST',
                data: fun,
                contentType: "application/json"
            }).done(function () {
                resolve('SUCCESS');

            }).fail(function (msg) {
                reject('FAIL');
            });
        });

	}
	
	function borrar(cine, funcion){
        var fun = JSON.stringify(funcion);

        const promise = new Promise((resolve, reject) => {
            $.ajax({
                url: "http://localhost:8080/cinemas/" + cine,
                type: 'DELETE',
                data: fun,
                contentType: "application/json"
            }).done(function () {
                resolve('SUCCESS');

            }).fail(function (msg) {
                reject('FAIL');
            });
        });

	}


    return {
        getFunctionsByCinema: getFunctionsByCinema,
        getFunctionsByCinemaAndDate: getFunctionsByCinemaAndDate,
        getFunctionByNameAndDate: getFunctionByNameAndDate,
        // getFunctionByMovieName : getFunctionByMovieName,
        update:update,
		crear:crear,
		borrar:borrar

    }
})();

