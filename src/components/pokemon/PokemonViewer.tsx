import React, { useState } from "react"
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { fetchPokemon, fetchPokemonList } from '../../api/pokemon';
import styles from './page.module.scss'

export const PokemonViewer: React.FC = () => {
    const [pokemonName, setPokemonName] = useState<string>('');

    

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['pokemon', pokemonName],
        queryFn: () => fetchPokemon(pokemonName),
        enabled: !!pokemonName, // Solo se ejecuta si hay un nombre

    });
 
    /*  const { data: pokemonList} = useQuery({
         queryKey: ['pokemonList'],
         queryFn: fetchPokemonList,
     }); */
    const { data: pokemonList, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ['pokemonList'],
        queryFn: fetchPokemonList,
        getNextPageParam: (lastPage) => lastPage.nextPage,
        initialPageParam: 0,
    });
    //console.log(pokemonList)
    return (
        <div className={styles.container}>
            <div className={styles.searchSection}>
                <h1>React Query + Pokémon API</h1>
                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        value={pokemonName}
                        onChange={(e) => setPokemonName(e.target.value)}
                        placeholder="Enter Pokémon name"
                        style={{ padding: '0.5rem', fontSize: '1rem', marginBottom: '1rem' }}
                    />
                    <button onClick={() => refetch()} style={{ padding: '0.5rem', fontSize: '1rem' }}>
                        Search
                    </button>
                </div>

            </div>

            {isLoading && <p>Loading...</p>}
            {isError && <p>Error fetching data. Try another Pokémon!</p>}
            {data && (
                <div style={{ marginTop: '2rem' }}>
                    <h2>{data.name.toUpperCase()}</h2>
                    <img src={data.sprites?.other?.['official-artwork']?.front_default} alt={data.name} />
                    <p>Height: {data.height}</p>
                    <p>Weight: {data.weight}</p>
                </div>
            )}
            <div >
                <div className={styles.pokemonGrid}>
                    {pokemonList?.pages?.map((page: any) =>
                        page.pokemon.map((p: any) => (
                            <div key={p.id} className={styles.pokemonCard}>
                                <img
                                    className={styles.pokemonImage}
                                    src={p.sprites.other['official-artwork'].front_default}
                                    alt={p.name}
                                />
                                <div className={styles.pokemonInfo}>
                                    <h3>{p.name}</h3>
                                    <div className={styles.pokemonTypes}>
                                        {p.types.map((type: any, index: any) => (
                                            <span key={index}>{type.type.name}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className={styles.paginationControls}>
                    {isLoading ? (
                        <p>Cargando Pokémon...</p>
                    ) : isError ? (
                        <p>Error al cargar los Pokémon</p>
                    ) : (
                        <button
                            onClick={() => fetchNextPage()}
                            disabled={!hasNextPage || isFetchingNextPage}
                            className={styles.loadMoreButton}
                        >
                            {isFetchingNextPage
                                ? 'Cargando más...'
                                : hasNextPage
                                    ? 'Cargar más Pokémon'
                                    : 'No hay más Pokémon'}
                        </button>
                    )}
                </div>
            </div>
        </div>

    )
}

