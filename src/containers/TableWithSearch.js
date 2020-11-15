import React, { useState, useEffect, useMemo } from 'react';
import SearchBar from '../components/SearchBar/SearchBar';
import Table from '../components/Table/Table';
import axios from 'axios';

const TableWithSearch = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: 'asc',
    });
    const [selectedState, setSelectedState] = useState('All');
    const [selectedGenre, setSelectedGenre] = useState('All');
    const [genres, setGenres] = useState(['All']);
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [currentRestaurants, setCurrentRestaurants] = useState([]);

    const states = [
        'All',
        'AL',
        'AK',
        'AS',
        'AZ',
        'AR',
        'CA',
        'CO',
        'CT',
        'DE',
        'DC',
        'FL',
        'GA',
        'HI',
        'ID',
        'IL',
        'IN',
        'IA',
        'KS',
        'KY',
        'LA',
        'ME',
        'MD',
        'MA',
        'MI',
        'MN',
        'MS',
        'MO',
        'MT',
        'NE',
        'NV',
        'NH',
        'NJ',
        'NM',
        'NY',
        'NC',
        'ND',
        'OH',
        'OK',
        'OR',
        'PA',
        'PR',
        'RI',
        'SC',
        'SD',
        'TN',
        'TX',
        'UT',
        'VT',
        'VA',
        'WA',
        'WV',
        'WI',
        'WY',
    ];

    useEffect(() => {
        axios
            .get('https://code-challenge.spectrumtoolbox.com/api/restaurants', {
                headers: {
                    Authorization: 'Api-Key q3MNxtfep8Gt',
                },
            })
            .then((res) => {
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
            });
    }, []);

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
    }, [restaurants]);

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
    }, [sortConfig]);

    const onSearchSubmit = (term) => {
        setSearchText(term);
        console.log('onSearchSubmit', term);
    };

    const onPageChanged = (data) => {
        const { scopedPage, totalPages, pageLimit } = data;
        const offset = (scopedPage - 1) * pageLimit;
        setCurrentRestaurants(restaurants.slice(offset, offset + pageLimit));
        setCurrentPage(scopedPage);
        setTotalPages(totalPages);
    };

    return (
        <div>
            <SearchBar
                searchText={searchText}
                onSearchSubmit={onSearchSubmit}
            />
            <Table
                sortConfig={sortConfig}
                setSortConfig={setSortConfig}
                selectedState={selectedState}
                setSelectedState={setSelectedState}
                states={states}
                selectedGenre={selectedGenre}
                setSelectedGenre={setSelectedGenre}
                restaurants={restaurants}
                currentRestaurants={currentRestaurants}
                searchText={searchText}
            />
        </div>
    );
};

export default TableWithSearch;
