/*
  Creación de una función personalizada para jQuery que detecta cuando se detiene el scroll en la página
*/
$.fn.scrollEnd = function(callback, timeout) {
  $(this).scroll(function(){
    var $this = $(this);
    if ($this.data('scrollTimeout')) {
      clearTimeout($this.data('scrollTimeout'));
    }
    $this.data('scrollTimeout', setTimeout(callback,timeout));
  });
};
/*
  Función que inicializa el elemento Slider
*/

function inicializarSlider(){
  $("#rangoPrecio").ionRangeSlider({
    type: "double",
    grid: false,
    min: 0,
    max: 1000,
    from: 200,
    to: 800,
    prefix: "$"
  });
}
/*
  Función que reproduce el video de fondo al hacer scroll, y deteiene la reproducción al detener el scroll
*/
function playVideoOnScroll(){
  var ultimoScroll = 0,
      intervalRewind;
  var video = document.getElementById('vidFondo');
  $(window)
    .scroll((event)=>{
      var scrollActual = $(window).scrollTop();
      if (scrollActual > ultimoScroll){
       video.play();
     } else {
        //this.rewind(1.0, video, intervalRewind);
        video.play();
     }
     ultimoScroll = scrollActual;
    })
    .scrollEnd(()=>{
      video.pause();
    }, 10)
}

var selectCity = $('#selectCiudad');
var selectTipo = $('#selectTipo');
function initSelects(){
 
  selectCity.css('display', 'block');
  selectTipo.css('display', 'block');
  selectCity.val("");

  getData(resultDataSelect);
}

//RESULTADO PARA LOS SELECTEDS
function resultDataSelect(res){  
  var cities = [];
  var tipes = [];  
  for (var i = 0; i < res.length; i++) {    
    if(!containData(cities, res[i].Ciudad)){           
      cities.push(res[i].Ciudad)      
    }      

    if(!containData(tipes, res[i].Tipo)){           
      tipes.push(res[i].Tipo)      
    }      
  };  
  getSelectHTML(cities,selectCity);  
  getSelectHTML(tipes,selectTipo);  
}

//formato html para selects
function getSelectHTML(arry, select){
    var objHtml = '';
    for (var i = 0; i < arry.length; i++) {
      objHtml+= '<option value="'+arry[i]+'">'
        objHtml+= arry[i]
      objHtml+= '</option>'          
  };
  select.append(objHtml); 
}


//FUNCION QUE VERIFICA SI EXISTE UN DATO EN UN ARRAY
function containData(arry, name){
  for (var i = 0; i < arry.length; i++) {
    if(arry[i] == name){      
      return true
    }
  }  
  return false
}



//INICIALIZACION DE METODOS.
inicializarSlider();
playVideoOnScroll();
initSelects();

//

//INICIALIZACION DE VARIABLES
var rangoPrecio = "";
var from = 0;
var to = 0;  
var city =  null;
var type = null;
function buscar(){   
  rangoPrecio = $("#rangoPrecio").data("ionRangeSlider");
  from = parseFloat(rangoPrecio.result.from)
  to = parseFloat(rangoPrecio.result.to)
  city = selectCity.val()
  type = selectTipo.val()  

  if(!city && !type){
    alert("Seleccione CIUDAD o TIPO");        
    return;    
  }    

  getData(resultBuscar);
}

//BUSQUEDA EN BASE A LOS PARAMETROS DE BUSQUEDA
function resultBuscar(res){  
  var arry = [];
  console.log(from)
  console.log(to)

  if(city && type){        
    for (var i = 0; i < res.length; i++) {
      var precio = res[i].Precio.substring(1,res[i].Precio.length).replace(/,/, '.')         
      if(city == res[i].Ciudad && type == res[i].Tipo && precio >= from && precio <= to){
          arry.push(res[i])
      }
    }
  }else if(city){    
    for (var i = 0; i < res.length; i++) {
      var precio = res[i].Precio.substring(1,res[i].Precio.length).replace(/,/, '.')         
      if(city == res[i].Ciudad && precio >= from && precio <= to){
          arry.push(res[i])
      }
    }
  }else if(type){    
    for (var i = 0; i < res.length; i++) {
      var precio = res[i].Precio.substring(1,res[i].Precio.length).replace(/,/, '.')         
      if(type == res[i].Tipo && precio >= from && precio <= to){
          arry.push(res[i])
      }
    }
  }

  resMostrarDatos(arry)
}

//MUESTRA toDOS LOS DATOS
function mostrarTodos(){    
  getData(resMostrarDatos);
}

//MUESTRA LOS DATOS DE RESPUESTA
function resMostrarDatos(response){
  console.log("response.length");
  console.log(response.length);
  if(response.length <= 0)
    alert("No Se encontraron datos.. revise los Precios Por favor")
  var container = "";
  var containerTodos = $("#containerTodos");
  containerTodos.text("");  
    for (var i = 0; i < response.length; i++) {
        console.log(response[i].Ciudad);        
        container += '<li class="collection-item avatar"><div class="row valign-wrapper">'
          container += '<div class="col s2">';
            container += '<img src="img/home.jpg" alt="" class=" responsive-img">'
          container += '</div>';
          container += ' <div class="col s10">';
            container += '<p>'
              container += 'Direccion: '+response[i].Direccion+'<br>';
              container += 'Ciudad: '+response[i].Ciudad+'<br>';
              container += 'Telefono: '+response[i].Telefono+',<br>';
              container += 'Codigo_Postal: '+response[i].Codigo_Postal+',<br>';
              container += 'Tipo": '+response[i].Tipo+',<br>';
              container += 'Precio: <b style="color:#ffab40">'+response[i].Precio+'</b>'
            container += '</p>'
          container += '</div>';
        container += '</div></li>'
        containerTodos.append(container)               
      };      
}


//ajax
function getData(methodRes){
  $.ajax({
    url: "data-1.json",
    dataType: "json",
    cache: false,
    contentType: false,
    processData: false,
    type: 'post',
    success: function(response){      
      methodRes(response);
    },
    error: function(){
      alert(error);
    }
  })

}