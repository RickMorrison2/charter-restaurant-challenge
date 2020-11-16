import React, { useState, useEffect } from 'react';
import Pagination from '../Pagination/Pagination';
import * as Classes from './RestaurantList.module.css';

const RestaurantList = ({
    restaurants,
    selectedState,
    selectedGenre,
    searchText,
}) => {
    const [currentRestaurants, setCurrentRestaurants] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const filteredRestaurants = [...restaurants]
        .filter((e) => {
            if (selectedState === 'All') {
                return true;
            }
            return e.state === selectedState;
        })
        .filter((e) => {
            if (selectedGenre === 'All') {
                return true;
            }
            return e.genre.includes(selectedGenre);
        })
        .filter((e) => {
            if (searchText === '') {
                return true;
            }
            return (
                e.name.toLowerCase().includes(searchText.toLowerCase()) ||
                e.city.toLowerCase().includes(searchText.toLowerCase()) ||
                e.genre.toLowerCase().includes(searchText.toLowerCase())
            );
        });

    const displayRestaurants = [...filteredRestaurants]
        .filter((e) => {
            if (currentRestaurants.length === 0) {
                return true;
            }
            return currentRestaurants.includes(e);
        })
        .slice(0, 10);

    const onPageChanged = (data) => {
        const { scopedPage, totalPages, pageLimit } = data;
        const offset = (scopedPage - 1) * pageLimit;
        setCurrentRestaurants(restaurants.slice(offset, offset + pageLimit));
        setCurrentPage(scopedPage);
        setTotalPages(totalPages);
    };

    if (displayRestaurants.length === 0) {
        return (
            <React.Fragment>
                <tr>
                    <td className={Classes.noneFound}>No restaurants found.</td>
                </tr>
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            {displayRestaurants.map((el) => {
                return (
                    <tr className={Classes.restaurant} key={el.id}>
                        <td>{el.name}</td>
                        <td>
                            {el.city.includes(',')
                                ? el.city.split(',').join(', ')
                                : el.city}
                        </td>
                        <td>{el.state}</td>
                        <td>{el.telephone}</td>
                        <td>
                            {el.genre.includes(',')
                                ? el.genre.split(',').join(', ')
                                : el.genre}
                        </td>
                    </tr>
                );
            })}
            <Pagination
                totalRecords={filteredRestaurants.length}
                pageLimit={10}
                pageNeighbors={0}
                onPageChanged={onPageChanged}
                currentPage={currentPage}
            />
        </React.Fragment>
    );
};

export default RestaurantList;
