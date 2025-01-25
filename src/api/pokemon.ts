import axios from 'axios';

const BASE_URL = 'https://pokeapi.co/api/v2';


export const fetchPokemon = async (name: string) => {
    const response = await axios.get(`${BASE_URL}/pokemon/${name}`);
    console.log(response.data)
    if(!response.data){
        throw new Error("error feching data");
    }
    return response.data;
}

export const fetchPokemonList = async ({ pageParam = 0 }) => {
    const limit = 12;
    const offset = pageParam * limit;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
    const data = await response.json();
    
    const pokemonDetails = await Promise.all(
        data.results.map(async (pokemon: { url: string }) => {
            const res = await fetch(pokemon.url);
            return res.json();
        })
    );
    
    return {
        pokemon: pokemonDetails,
        nextPage: offset + limit < data.count ? pageParam + 1 : undefined,
        totalPages: Math.ceil(data.count / limit)
    };
};

export const fetchEmpleados = async () => {
    const response = await fetch('http://localhost:3000/api/empleados');
    if (!response.ok) {
        throw new Error('Error fetching empleados');
    }
    return response.json();
};

