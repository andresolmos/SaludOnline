$(function () {
    get();

});

function get() {
    var settings = {
        "url": "https://citas-2c00.onrender.com/appointments/",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "token  "+localStorage.getItem("token"),
            "Content-Type": "application/json"
        },
    };

    $.ajax(settings).done(function (response) {
        console.log(response);
        if (typeof response.error == "undefined") {
            $("#containerCitas").html("");
            $("#containerCitas").append($("<button>").attr("onclick","window.location.href = \"about.html\";").attr("class","btn btn-success btn-lg btn-block").attr("type","button").html("Agendar nueva cita"));
            
            $("#containerCitas").append($("<br>"));
            $("#containerCitas").append($("<br>"));
            var fechaActual = new Date();

            var fechaActualSinHora = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate());
            response.result.forEach(element => {
                var fatherDiv = $("<div>").addClass("client_section_2");
                var imageDiv = $("<div>").addClass("client_left");
                if (fechaActualSinHora === StringToDate(element.date) ) {
                    imageDiv.append($("<img>").attr("src", "images/today.png").addClass("image_10"));
                } else if (fechaActualSinHora > StringToDate(element.date)) {
                    imageDiv.append($("<img>").attr("src", "images/atrasada.png").addClass("image_10"));
                } else {
                    imageDiv.append($("<img>").attr("src", "images/inTime.png").addClass("image_10"));
                }
                fatherDiv.append(imageDiv);
                var descDiv = $("<div>").addClass("client_right");
                descDiv.append($("<h3>").addClass("miller_text").html(element.name));
                descDiv.append($("<p>").addClass("dummy_text").html("Doctor: "+element.doctor));
                descDiv.append($("<p>").addClass("dummy_text").html("Fecha: "+element.date));
    
                descDiv.append($("<button>").addClass("btn btn-danger").html("Cancelar").addClass("DeleteCita").attr("id", element.id).attr("onclick", "Delete("+element.id+")"));
    
                fatherDiv.append(descDiv);
    
                $("#containerCitas").append(fatherDiv);
            });
        } else {
            alert("Error "+response.error+".");
            window.location.href = "index.html";
        }


    }).fail(function(jqXHR, textStatus, errorThrown) {
        // Verificar si el error es un error 401 (No autorizado)
        if (jqXHR.status === 401) {
            // Manejar el error 401 aquí
            alert("Inicie sesión por favor.");
            window.location.href = "index.html";
        } else {
            // Manejar otros errores aquí
            alert("Error: " + jqXHR.status + " - " + textStatus);
            window.location.href = "index.html";

        }
    });
}


function StringToDate(fechaHoraString) {
    // Dividir la cadena en componentes de fecha y hora
    var partes = fechaHoraString.split(' ');

    // Obtener la fecha
    var fechaParte = partes[0];
    // Obtener la hora
    var horaParte = partes[1] + ' ' + partes[2];

    // Dividir la parte de la fecha en año, mes y día
    var fechaComponentes = fechaParte.split('-');
    var año = parseInt(fechaComponentes[0]);
    var mes = parseInt(fechaComponentes[1]) - 1; // Restar 1 porque en JavaScript los meses comienzan desde 0
    var día = parseInt(fechaComponentes[2]);

    // Dividir la parte de la hora en hora y minutos
    var horaComponentes = horaParte.split(':');
    var hora = parseInt(horaComponentes[0]);
    var minutos = parseInt(horaComponentes[1]);

    // Verificar si es AM o PM y ajustar la hora si es necesario
    if (partes[3] === 'PM' && hora < 12) {
        hora += 12;
    } else if (partes[3] === 'AM' && hora === 12) {
        hora = 0;
    }

    var fechaHora = new Date(año, mes, día, 0, 0);


    return fechaHora;
}

function Delete(id) {
    var confirmacion = confirm("¿Estás seguro de que deseas cancelar la cita?");

// Verificar la respuesta del usuario
if (confirmacion) {
    var settings = {
        "url": "https://citas-2c00.onrender.com/appointments/",
        "method": "DELETE",
        "timeout": 0,
        "headers": {
          "Authorization": "token  "+localStorage.getItem("token"),
          "Content-Type": "application/json"
        },
        "data": JSON.stringify({
          "id": id
        }),
      };
      
      $.ajax(settings).done(function (response) {
        console.log(response);
        alert("Cancelada correctamente.");
        get();

      }).fail(function(jqXHR, textStatus, errorThrown) {
        // Verificar si el error es un error 401 (No autorizado)
        if (jqXHR.status === 401) {
            // Manejar el error 401 aquí
            alert("Inicie sesión por favor.");
            window.location.href = "index.html";
        } else {
            // Manejar otros errores aquí
            alert("Error: " + jqXHR.status + " - " + textStatus);
            window.location.href = "index.html";

        }
    });
} 
}