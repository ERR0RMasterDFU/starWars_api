$(document).ready(function () {
    getPokemonListV2();

    const typeColors = {
        fuego: 'rgb(255, 69, 0)',
        agua: 'rgb(0, 112, 221)',
        planta: 'rgb(120, 200, 80)',
        eléctrico: 'rgb(255, 255, 0)',
        roca: 'rgb(184, 160, 56)',
        normal: 'rgb(168, 168, 120)',
        tierra: 'rgb(226, 191, 101)',
        hada: 'rgb(255, 192, 203)',
        lucha: 'rgb(193, 49, 48)',
        volador: 'rgb(135, 206, 250)',
        fantasma: 'rgb(112, 88, 152)',
        veneno: 'rgb(163, 62, 161)',
        acero: 'rgb(183, 183, 206)',
        siniestro: 'rgb(112, 88, 72)',
        dragón: 'rgb(111, 53, 252)',
        bicho: 'rgb(168, 184, 32)',
        hielo: 'rgb(150, 217, 214)',
        psíquico: 'rgb(255, 85, 155)',
    };

    const translateTypesToSpanish = {
        fire: 'Fuego',
        water: 'Agua',
        grass: 'Planta',
        electric: 'Eléctrico',
        rock: 'Roca',
        normal: 'Normal',
        ground: 'Tierra',
        fairy: 'Hada',
        fighting: 'Lucha',
        flying: 'Volador',
        ghost: 'Fantasma',
        poison: 'Veneno',
        steel: 'Acero',
        dark: 'Siniestro',
        dragon: 'Dragón',
        bug: 'Bicho',
        ice: 'Hielo',
        psychic: 'Psíquico',
    };

    function getPokemonListV2() {
        $("#data-content").html("<img src='../img/loading.gif' />");
        $.ajax({
            url: "https://pokeapi.co/api/v2/pokemon?limit=151",
            method: "GET",
        }).done(function (resp) {
            setTimeout(function () {
                $("#data-content").html("");
                let listadoPokemon = resp.results;
                listadoPokemon.forEach(function (pokemon) {
                    let pokemonId = pokemon.url.split("/")[6];

                    let template = `
                    <div class="col">
                        <div class="card mt-3 bg-light">
                            <a href="#" class="pokemon-detail text-decoration-none text-black" data-id="${pokemonId}" data-name="${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}" data-bs-toggle="modal" data-bs-target="#detalles">
                                <div class="card-img-wrapper" style="position: relative; background-image: url('../img/d2temnn-33c666eb-69ab-4fea-99a6-58578928a1d1.png'); background-size: cover;">
                                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png" class="card-img-top img-fluid" alt="${pokemon.name}" style="position: relative; z-index: 1;">
                                </div>
                                <div class="card-body">
                                    <h5 class="card-title text-capitalize" style="text-align: center;">${pokemon.name}</h5>
                                </div>
                            </a>
                        </div>
                    </div>
                    `;
                    $("#data-content").append(template);
                });

                $(".pokemon-detail").click(function () {
                    let pokemonId = $(this).data("id");
                    let pokemonName = $(this).data("name");

                    $.ajax({
                        url: `https://pokeapi.co/api/v2/pokemon/${pokemonId}`,
                        method: "GET",
                    }).done(function (pokemonData) {
                        $("#modalPokemonImage").attr("src", pokemonData.sprites.front_default);
                        $("#modalPokemonName").text(pokemonName);
                        $("#modalPokemonId").text(pokemonId);

                        let typesInSpanish = pokemonData.types.map(t => translateTypesToSpanish[t.type.name]).join(" / ");
                        $("#modalPokemonType").text(typesInSpanish);

                        $("#modalPokemonHeight").text(`${pokemonData.height / 10} m`);
                        $("#modalPokemonWeight").text(`${pokemonData.weight / 10} kg`);

                        let mainType = pokemonData.types[0].type.name;
                        let typeInSpanish = translateTypesToSpanish[mainType.toLowerCase()];
                        let color = typeColors[typeInSpanish.toLowerCase()] || 'rgb(190, 190, 190)';
                        $(".fondoModal").css('background-color', color);

                        getPokemonSpecies(pokemonId);
                    }).fail(function () {
                        console.error("Error al obtener datos del Pokémon");
                    });
                });
            }, 1000);
        });
    }

    function getPokemonSpecies(pokemonId) {
        $.ajax({
            url: `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`,
            method: "GET",
        }).done(function (speciesData) {
            $("#modalPokemonCategory").text(speciesData.genera[5].genus);

            let description = speciesData.flavor_text_entries.find(entry => entry.language.name === 'es');
            if (description) {
                $("#modalPokemonDescription").html(description.flavor_text.replace(/\n/g, " "));
            } else {
                $("#modalPokemonDescription").text("Descripción no disponible.");
            }
        }).fail(function () {
            console.error("Error al obtener datos de la especie del Pokémon");
        });
    }
});
