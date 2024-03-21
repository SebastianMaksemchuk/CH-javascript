async function mostrarPokemon() {
  const pokemonId = Math.floor(Math.random() * 1024) + 1;
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
  const pokemon = await response.json();
  const pokemonImg = document.getElementById('img-pkmn');
  pokemonImg.src = pokemon.sprites.front_default;
}

const botonPokemon = document.getElementById('btn-pkmn');
botonPokemon.addEventListener('click',mostrarPokemon);