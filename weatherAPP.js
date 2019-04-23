$(document).on("mobileinit", function(){
    $(function(){
        //array de las ciudades añadidas
        var cities = [];
        if (localStorage.length == 0){
          localStorage.setItem("cities", JSON.stringify(cities));
        }
        //código de la barra de búsqueda predictiva
        $( "#autocomplete" ).on( "filterablebeforefilter", function ( e, data ) {
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
                            data: {
                                q: $input.val()
                            }
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

            //condicion para la ciudad de tu ubicación
            if ("geolocation" in navigator) {
              //obtener ubicación
                navigator.geolocation.getCurrentPosition(showcityname);
              // creamos variables para diferentes datos.
                function showcityname(position) {
                  var lat = position.coords.latitude;
                  var longit = position.coords.longitude;
                  var city_name;
                  var temp;
                  var wind_speed;
                  var country_name;
                  var weather_description;
                  var apiKey = "6b9cf1d151667848e894bbef6927a54f";
          
                  //llamada a la api con los datos de ubicación, apikey, unidades métrica e idioma.
                  $.getJSON("http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + longit + "&appid=" + apiKey + "&lang=es" + "&units=metric").done( function(data){
                  //almaceno datos de la petición
                    city_name = data["name"];
                    country_name = data["sys"]["country"];
                    weather_description = data["weather"][0]["description"];
                    weather_icon=data["weather"][0]["icon"];
                    temp = data["main"]["temp"];
                    humidity = data["main"]["humidity"];
                    wind_speed = data["wind"]["speed"];
          
                    //cajas de página principal y detallada.
                    var cajaCiuL = $("<a href='#info' class='det1 details'><div class=ciu data-role=ui-content data-theme='a'><div data-role=header><h1 class='nombciu'> "+city_name+" "+country_name+"</h1></div><div data-role=content><div class='citycontent'><div class='ww'><p class='tit'>Humedad: </p><p class='tit'>"+humidity+"%</p></div><div class='ww'><p class='tit'>Velocidad del viento: </p><p class='tit'>"+wind_speed+" m/s</p></div></div><img class='wicon' src=images/"+weather_icon+".png><p>"+weather_description+"</p><h2>"+temp+"ºC</h2></div><a href='#' class='butdel ui-btn ui-btn-right ui-alt-icon ui-nodisc-icon ui-corner-all ui-icon-delete ui-btn-icon-notext ui-btn-inline ui-btn-a'></a></div></a>");
                    var cajaCiudetL = $("<div class=ciudet data-role=ui-content data-theme='a'><div class='header' data-role=header><a href='#main' class='back ui-btn'>Volver</a><h1 class='nombciudet'>"+city_name+" "+country_name+"</h1></div><div data-role=content><div class='citycontent'><div class='wwdet'><p class='tit'>Humedad: </p><p>"+humidity+"%</p></div><div class='tempdesc'><h2 class='wdet'>"+temp+"ºC</h2><p>"+weather_description+"</p></div><div class='wwdet'><p class='tit'>Velocidad del viento: </p><p>"+wind_speed+" m/s</p></div></div><img class='wicondet' src=images/"+weather_icon+".png><div><p class='forebox'></p></div></div></div>");
                    
                    //añado  la caja básica al contenedor de la página principal
                    cajaCiuL.appendTo("#base");
                    //al hacer click en la caja básica vaciamos el html y ponemos los detalles de la ciudad indicada
                    $(".det1").on("click", function(){
                      $("#detailbase").html("");
                    $("#detailbase").html(cajaCiudetL);
                    });
                  });
            
                }
            
              }
              //al hacer click en una ciudad de la lista, almaceno el nombre de esta en un array y en el localStorage
              $( "#autocomplete" ).on( "click", ".elem" , function() {
                
                cities = JSON.parse(localStorage.getItem("cities"));
                

                let selected = $(this).html();
                var res = selected.split(",");
                var city = res[0];

                cities.push(city);
                localStorage.setItem("cities", JSON.stringify(cities));
                
                //llamada a la api con los datos necesarios
                $.getJSON("http://api.openweathermap.org/data/2.5/weather?q="+ city +"&appid=6b9cf1d151667848e894bbef6927a54f&lang=es&units=metric").done( function(data){
                    //variables con los datos obtenidos de la petición
                    city_name = data["name"];
                    country_name = data["sys"]["country"];
                    weather_description = data["weather"][0]["description"];
                    weather_icon=data["weather"][0]["icon"];
                    temp = data["main"]["temp"];
                    humidity = data["main"]["humidity"];
                    wind_speed = data["wind"]["speed"];
            
                    //creo la caja básica y la añado al contenedor principal
                    var cajaCiu = $("<a href='#info' class='details2 details'><div class=ciu data-role=ui-content data-theme='a'><div data-role=header><h1 class='nombciu'> "+city_name+" "+country_name+"</h1></div><div data-role=content><div class='citycontent'><div class='ww'><p class='tit'>Humedad: </p><p class='tit'>"+humidity+"%</p></div><div class='ww'><p class='tit'>Velocidad del viento: </p><p class='tit'>"+wind_speed+" m/s</p></div></div><img class='wicon' src=images/"+weather_icon+".png><p>"+weather_description+"</p><h2>"+temp+"ºC</h2></div><a href='#' class='butdel ui-btn ui-btn-right ui-alt-icon ui-nodisc-icon ui-corner-all ui-icon-delete ui-btn-icon-notext ui-btn-inline ui-btn-a'></a></div></a>");
                    cajaCiu.appendTo("#base");
                      

                  });

            });

            

            //Recuperar datos de localStorage
            var cityrecov = JSON.parse(localStorage.getItem("cities"));
            var largoCR = cityrecov.length;
            //recorro el array para ir añadiendo las cajas de ciudades guardadas
            for (let i = 0; i < largoCR; i++) {

            $.getJSON("http://api.openweathermap.org/data/2.5/weather?q="+ cityrecov[i] +"&appid=6b9cf1d151667848e894bbef6927a54f&lang=es&units=metric").done( function(data){

            city_name = data["name"];
            country_name = data["sys"]["country"];
            weather_description = data["weather"][0]["description"];
            weather_icon=data["weather"][0]["icon"];
            temp = data["main"]["temp"];
            humidity = data["main"]["humidity"];
            wind_speed = data["wind"]["speed"];

            
            //caja básica de los datos recuperados, añadida al contenedor principal
            var recoverdata = $("<a href='#info' class='details2 details'><div class=ciu data-role=ui-content data-theme='a'><div data-role=header><h1 class='nombciu'> "+city_name+" "+country_name+"</h1></div><div data-role=content><div class='citycontent'><div class='ww'><p class='tit'>Humedad: </p><p class='tit'>"+humidity+"%</p></div><div class='ww'><p class='tit'>Velocidad del viento: </p><p class='tit'>"+wind_speed+" m/s</p></div></div><img class='wicon' src=images/"+weather_icon+".png><p>"+weather_description+"</p><h2>"+temp+"ºC</h2></div><a href='#' class='butdel ui-btn ui-btn-right ui-alt-icon ui-nodisc-icon ui-corner-all ui-icon-delete ui-btn-icon-notext ui-btn-inline ui-btn-a'></a></div></a>");
            recoverdata.appendTo('#base');
            });
                    
            }
          
            //botón de eleminar en las tarjetas básicas, elimina también la ciudad del array
            $(document).on('click', '.butdel', function() {
              cities = JSON.parse(localStorage.getItem("cities"));
              $(this).parent().remove();
              let nombre = $(this).parent().html();
              //a mejorar este método que no permitiría trabajar con ciudades que no sean una única palabra
              let divided = nombre.split(' ');
              //devuelve el array sin el elemento seleccionado
              cities = $.grep(cities, function(value) {
                
                return value != divided[6];
               
              });
              localStorage.setItem("cities", JSON.stringify(cities));
              
          });

          //código para la caja detallada de ciudades añadidas y recuperadas
          $(document).on("click", '.details2', function(){
            let seleccion = $(this).html();
            let selecciondiv = seleccion.split(' ');
            let ciudetail = selecciondiv[3];
            //llamada a la api
            $.getJSON("http://api.openweathermap.org/data/2.5/weather?q="+ ciudetail +"&appid=6b9cf1d151667848e894bbef6927a54f&lang=es&units=metric").done( function(data){

              city_name = data["name"];
              country_name = data["sys"]["country"];
              weather_description = data["weather"][0]["description"];
              weather_icon=data["weather"][0]["icon"];
              temp = data["main"]["temp"];
              humidity = data["main"]["humidity"];
              wind_speed = data["wind"]["speed"];

              //creo la caja, vacío la página INFO y añado la informacion de la ciudad
              var recoverdatadet = $("<div class=ciudet data-role=ui-content data-theme='a'><div class='header' data-role=header><a href='#main' class='back ui-btn'>Volver</a><h1 class='nombciudet'>"+city_name+" "+country_name+"</h1></div><div data-role=content><div class='citycontent'><div class='wwdet'><p class='tit'>Humedad: </p><p>"+humidity+"%</p></div><div class='tempdesc'><h2 class='wdet'>"+temp+"ºC</h2><p>"+weather_description+"</p></div><div class='wwdet'><p class='tit'>Velocidad del viento: </p><p>"+wind_speed+" m/s</p></div></div><img class='wicondet' src=images/"+weather_icon+".png><div><p class='forebox'></p></div></div></div>");
          
              $("#detailbase").html("");
              $("#detailbase").html(recoverdatadet);
            });
          });

    });
});
