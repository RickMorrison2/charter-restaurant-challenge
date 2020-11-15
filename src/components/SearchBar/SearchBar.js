import React, { useState } from 'react';
import * as Classes from './SearchBar.module.css';

const SearchBar = ({ onSearchSubmit }) => {
    const [searchString, setSearchString] = useState('');
    return (
        <form
            className={Classes.form}
            onSubmit={(e) => {
                e.preventDefault();
                onSearchSubmit(searchString);
            }}
        >
            <input
                className={Classes.search}
                type="text"
                placeholder="Search Restaurants..."
                value={searchString}
                onChange={(e) => setSearchString(e.target.value)}
            />
        </form>
    );
};

export default SearchBar;
