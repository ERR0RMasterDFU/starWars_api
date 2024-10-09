$(document).ready(function() {
    getStarWarsList(1); // Inicia con la primera página

    function getStarWarsList(page) {
        if (page === 1) {
            $("#data-content").html("<img src='../img/loading.gif' />");
        }
        $.ajax({
            url: `https://swapi.dev/api/people/?page=${page}`,
            method: "GET",
        }).done(function (resp) {
            console.log("API response received:", resp);
            setTimeout(function () {
                if (page === 1) {
                    $("#data-content").html(""); // Limpiar contenido solo en la primera página
                }
                let listadoPersonajes = resp.results;
                console.log("List of characters:", listadoPersonajes);
                listadoPersonajes.forEach(function (personaje) {
                    let personajeId = personaje.url.split("/")[5];
                    console.log("Character ID:", personajeId);

                    let template = `
                    <div class="col">
                        <div class="card mt-3 bg-light">
                            <a href="#" class="personaje-detail text-decoration-none text-black" data-id="${personajeId}" data-name="${personaje.name}" data-bs-toggle="modal" data-bs-target="#detalles">
                                <div class="card-body">
                                    <h5 class="card-title text-capitalize" style="text-align: center;">${personaje.name}</h5>
                                </div>
                            </a>
                        </div>
                    </div>
                    `;
                    $("#data-content").append(template);
                });

                if (resp.next && page < 3) {
                    getStarWarsList(page + 1);
                } else {
                    $("#data-content img").remove();
                }


                $(".personaje-detail").click(function () {
                    let personajeId = $(this).data("id");
                    let personajeName = $(this).data("name");

                    $.ajax({
                        url: `https://swapi.dev/api/people/${personajeId}`,
                        method: "GET",
                    }).done(function (swapiData) {

                        $("#modalPersonajeId").text(personajeId);
                        $("#modalPersonajeName").text(personajeName);
                        
                        switch(swapiData.gender){
                            case "male":
                                $("#modalPersonajeGender").html(`<p class="m-0 azul"><strong>HOMBRE</strong>&emsp;<i class="bi bi-gender-male azul"></i></p>`);
                                break;
                            case "female":
                                $("#modalPersonajeGender").html(`<p class="m-0 rosa"><strong>MUJER</strong>&emsp;<i class="bi bi-gender-female rosa"></i></p>`);
                                break;

                            default:
                                $("#modalPersonajeGender").html(`<p class="m-0 gris"><strong>N/A</strong>&emsp;<i class="bi bi-gender-neuter gris"></i></p>`);
                        }
                        
                        $("#modalPersonajeFecha").text(`FECHA DE NACIMIENTO: ${swapiData.birth_year}`);

                        $("#modalPersonajeHeight").text(`${swapiData.height / 100} m`);
                        $("#modalPersonajeWeight").text(`${swapiData.mass} kg`);
                        $("#modalPersonajePelo").text(`${swapiData.hair_color}`);
                        $("#modalPersonajePiel").text(`${swapiData.skin_color}`);
                        $("#modalPersonajeOjo").text(`${swapiData.eye_color}`);

                    }).fail(function (jqXHR, textStatus, errorThrown) {
                        console.error("API request failed:", textStatus, errorThrown);
                        // Eliminar el logo de cargando en caso de error
                        $("#data-content img").remove();
                    });
                });
            }, 1000);
        });
    }
});