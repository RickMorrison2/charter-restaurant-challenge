import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import SearchBar from './SearchBar';
import RestaurantList from './RestaurantList';

const Table = () => {
    const [ restaurants, setRestaurants ] = useState([]);
    const [ sortConfig, setSortConfig ] = useState({key: null, direction: 'asc'});
    const [ selectedState, setSelectedState ] = useState('All');
    const [ selectedGenre, setSelectedGenre ] = useState('All');
    const [ genres, setGenres ] = useState(['All']);
    const [ searchText, setSearchText ] = useState('');
    

    const states = [ 'All', 'AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY' ];


    useEffect(() => {
        axios.get('https://code-challenge.spectrumtoolbox.com/api/restaurants', {
            headers: {
                Authorization: 'Api-Key q3MNxtfep8Gt'
            }
        }).then(res => {
            const sortedData = res.data.sort((a, b) => {
                if (a.name < b.name) {
                    return -1;
                }
                if (a.name > b.name) {
                    return 1;
                }
                return 0;
            });
            setRestaurants(sortedData);
        })
    }, [])

    useMemo(() => {
        let updatedGenres = [...genres];
        for (let i in restaurants) {
            if (restaurants[i].genre.includes(',')) {
            let splitGenres = restaurants[i].genre.split(',');
            for (let j in splitGenres) {
                if (!updatedGenres.includes(splitGenres[j])) {
                    updatedGenres.push(splitGenres[j]);
                    // setGenres([...genres, splitGenres[j]]);
                }
            }
        } else {
            if (!updatedGenres.includes(restaurants[i].genre)) {
                updatedGenres.push(restaurants[i].genre);
                // setGenres([...genres, restaurants[i].genre]);
            }
        }
        }
        setGenres(updatedGenres.sort());
    }, [restaurants])

    useMemo(() => {
        const sortedRestaurants = [...restaurants].sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
        setRestaurants(sortedRestaurants);
    }, [sortConfig])

    const reqSort = (key) => {
        let direction = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({key, direction});
    };

    const onSearchSubmit = (term) => {
        setSearchText(term);
        console.log('onSearchSubmit' , term);
    }



    return (
        <div>
            <SearchBar searchText={searchText} onSearchSubmit={onSearchSubmit}/>
            <table>
                <thead>
                    <tr>
                        <th>
                            <button type="button" onClick={() => reqSort('name')}>
                            Sort by Name
                            </button>
                        </th>
                        <th>                            
                            <button type="button" onClick={() => reqSort('city')}>
                            Sort by City
                            </button>
                        </th>
                        <th>                            
                            <button type="button" onClick={() => reqSort('state')}>
                            Sort by State
                            </button>
                        </th>
                        <th>                            
                            <button type="button" onClick={() => reqSort('telephone')}>
                            Sort by Phone Number
                            </button>
                        </th>
                        <th>                            
                            <button type="button" onClick={() => reqSort('genre')}>
                            Sort by Genre(s)
                            </button>
                        </th>
                    </tr>
                    <tr>
                        <th>
                            <div></div>
                        </th>
                        <th>
                            <div></div>
                        </th>
                        <th>
                            <select placeholder="Select State" value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
                                {states.map(state => <option key={state} value={state}>{state}</option>)}
                            </select>
                        </th>
                        <th>
                            <div></div>
                        </th>
                        <th>
                            <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
                                {genres.map(genre => <option key={genre} value={genre}>{genre}</option>)}
                            </select>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <RestaurantList restaurants={restaurants} selectedState={selectedState} selectedGenre={selectedGenre} searchText={searchText} />
                </tbody>
            </table>
        </div>
    );
}

export default Table;