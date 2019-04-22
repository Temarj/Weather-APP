$(document).on("mobileinit", function(){
    $(function(){
        document.location.hash="#main";
        let API="59dcac51b13ef1e2adad44f77b7fa092";


        
        //Ejercicio swipe reciclado
        $(document).on('swipeleft', '.ui-page', function(event){
            let sig = $.mobile.activePage.next('[data-role="page"]'); 
            let ant = $(this).prev('[data-role="page"]');
            let left = $("#main").prev('[data-role="page"]');

            if (sig.length > 0) {
                $.mobile.changePage(sig, {transition: "slide", reverse: false}, true, true);
            }
            else{
                $.mobile.changePage(left, {transition: "slide", reverse: false}, true, true);
            }

        });
        $(document).on('swiperight', '.ui-page', function(event){     
            ant = $.mobile.activePage.prev('[data-role="page"]'); 
            sig = $(this).next('[data-role="page"]');   
            let right = $("#main").next('[data-role="page"]');

            if (ant.length > 0) {
                $.mobile.changePage(ant, {transition: "slide", reverse: true}, true, true);
            }

            else{
                $.mobile.changePage(right, {transition: "slide", reverse: true}, false, false);
            }
        });
    
        //Buscar ciudad
        $("#contenidob").hide();
        $( "#autocomplete" ).on( "filterablebeforefilter", function ( e, data ) {
            $("ul").show();
            var $ul = $( this ),
            $input = $( data.input ),
            value = $input.val(),
            html = "";
            $ul.html( "" );

            if ( value && value.length > 2 ) {
                $ul.html( "<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>" );
                $ul.listview( "refresh" );

                $.ajax({
                    url: "http://gd.geobytes.com/AutoCompleteCity",
                    dataType: "jsonp",
                    crossDomain: true,
                    data: {q: $input.val()}
                })
                
                .then( function ( response ) {
                    $.each( response, function ( i, val ) {
                        html += "<li class='elem'>" + val + "</li>";
                    });
                
                    $ul.html( html );
                    $ul.listview( "refresh" );
                    $ul.trigger( "updatelayout");
                });
            }
        });

        //Visualizar ciudad buscada
        let ciudadb;
        $("#autocomplete").on ("click", ".elem", function(){
            $("ul").hide();
            $("#contenidob").show();
            ciudadb=$(this).html();
            var resp= ciudadb.split(",");
            let ciudadbn=resp[0];

            $("#nombreb").html(ciudadb);

            $.getJSON("http://api.openweathermap.org/data/2.5/weather?q="+ ciudadbn +"&appid=" + API + "&lang=es&units=metric", function(response){
                latb=response.coord.lat;
                longb=response.coord.lon;
                temp=response.main.temp;
                country=response.sys.country;
                weather=response.weather.main;
                humidity=response.main.humidity;
                wind=response.wind.speed;
                icon=response.weather[0].icon;
                iconsrc= "pictogramas/" + icon + ".png";
                
                $("#latvalb").html("Latitud: " + latb);
                $("#longvalb").html("Longitud: " + longb);
                $(".tempb").html(temp + "º");
                $(".humedadb").html("Humedad: " + humidity + "%");
                $(".vientob").html("Viento: " + wind + " m/s");  
                $(".iconb").attr("src", iconsrc);                               
            })

        });

        //Añadir una ciudad a "Mis ciudades"
         /*let ciudadesguardadas=[];*/
        let nuevaciudad;
        $("#info").on("dblclick", function(ciudadbn, response){
           /* ciudadesguardadas = JSON.parse(localStorage.getItem("ciudadesguardadas"));
            localStorage.setItem("ciudadesguardadas", JSON.stringify(ciudadesguardadas));*/
    
            nuevaciudad="<div class='ciudades'><div class='details'><h6>" + ciudadb + "</h6><h6>"+temp+"º</h6><h5>Latitud: "+ latb+"</h5><h5>Longitud: "+longb+"</h5><h5>Humedad: "+humidity+"</h5><h5>Viento: "+wind+"</h5></div><img src='"+iconsrc+"' class='iconc'></img></div>";
            $("#ciudadesañadidas").append(nuevaciudad);

            /*ciudadesguardadas.push(ciudadbn);
            localStorage.setItem("ciudadesguardadas", JSON.stringify(ciudadesguardadas));*/
        });

        //Borrar una ciudad de "Mis ciudades"
        $("#ciudadesañadidas").on("dblclick", ".ciudades", function(){
            alert("yes");
            $(this).remove();
        });

        //Conseguir localización actual y tiempo
        $("#main").on("pageinit", function() {

            if(navigator.geolocation){
                navigator.geolocation.getCurrentPosition(successF, errorF);
            }
            else{
                alert("Este navegador no permite geolocalizar");
            }
        });

        function successF(position){
            let lat= position.coords.latitude;
            let long= position.coords.longitude;
            
            let nciudad;
            let temp;
            let country;
            let weather;
            let humidity;
            let wind;

            let latval= document.getElementById("latval");
            let longval= document.getElementById("longval");
            latval.innerHTML="Latitud: " + lat;
            longval.innerHTML="Longitud: " + long;

            let icon;


            $.getJSON("http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long + "&appid=" + API + "&lang=es&units=metric", function(response){
                nciudad=response.name;
                temp=response.main.temp;
                country=response.sys.country;
                weather=response.weather.main;
                humidity=response.main.humidity;
                wind=response.wind.speed;
                icon=response.weather[0].icon;
                iconsrc= "pictogramas/" + icon + ".png";
                $("#nombre").html( nciudad + ", " + country );
                $(".temp").html(temp + "º");
                $(".humedad").html("Humedad: " + humidity + "%");
                $(".viento").html("Viento: " + wind + " m/s");  
                $(".icon").attr("src", iconsrc);
                });
              }

        function errorF(position){
            alert("Error");
        }
        
    });
});