import React, { useState } from 'react';

const SearchBar = ({onSearchSubmit, searchText}) => {
    const [ searchString, setSearchString ] = useState('');
    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            onSearchSubmit(searchString)
        }}>
            <input type="text" value={searchString} onChange={(e) => setSearchString(e.target.value)} />
        </form>
    )
}

export default SearchBar;