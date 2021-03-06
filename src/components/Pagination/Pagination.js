import React from 'react';
import * as Classes from './Pagination.module.css';

const Pagination = ({
    totalRecords = null,
    pageLimit = 10,
    pageNeighbors = 0,
    onPageChanged,
    currentPage,
}) => {
    pageLimit = typeof pageLimit === 'number' ? pageLimit : 10;
    totalRecords = typeof totalRecords === 'number' ? totalRecords : 0;
    pageNeighbors =
        typeof pageNeighbors === 'number'
            ? Math.max(0, Math.min(pageNeighbors, 2))
            : 0;
    const totalPages = Math.ceil(totalRecords / pageLimit);

    const LEFT_PAGE = 'LEFT';
    const RIGHT_PAGE = 'RIGHT';

    const range = (from, to, step = 1) => {
        let i = from;
        const range = [];

        while (i <= to) {
            range.push(i);
            i += step;
        }
        return range;
    };

    const fetchPageNumbers = () => {
        const totalNumbers = pageNeighbors * 2 + 3;
        const totalBlocks = totalNumbers + 2;

        if (totalPages > totalBlocks) {
            const startPage = Math.max(2, currentPage - pageNeighbors);
            const endPage = Math.min(
                totalPages - 1,
                currentPage + pageNeighbors
            );
            let pages = range(startPage, endPage);

            const hasLeftSpill = startPage > 2;
            const hasRightSpill = totalPages - endPage > 1;
            const spillOffset = totalNumbers - (pages.length + 1);

            switch (true) {
                case hasLeftSpill && !hasRightSpill: {
                    const extraPages = range(
                        startPage - spillOffset,
                        startPage - 1
                    );
                    pages = [LEFT_PAGE, ...extraPages, ...pages];
                    break;
                }
                case !hasLeftSpill && hasRightSpill: {
                    const extraPages = range(
                        endPage + 1,
                        endPage + spillOffset
                    );
                    pages = [...pages, ...extraPages, RIGHT_PAGE];
                    break;
                }
                case hasLeftSpill && hasRightSpill:
                default: {
                    pages = [LEFT_PAGE, ...pages, RIGHT_PAGE];
                    break;
                }
            }
            return [1, ...pages, totalPages];
        }
        return range(1, totalPages);
    };

    const pages = fetchPageNumbers();

    const goToPage = (page) => {
        const scopedPage = Math.max(0, Math.min(page, totalPages));
        const paginationData = {
            scopedPage,
            totalPages,
            pageLimit,
            totalRecords,
        };
        onPageChanged(paginationData);
    };

    const handleClick = (page) => (e) => {
        e.preventDefault();
        goToPage(page);
    };

    const handleMoveLeft = (e) => {
        e.preventDefault();
        goToPage(currentPage - pageNeighbors * 2 - 1);
    };

    const handleMoveRight = (e) => {
        e.preventDefault();
        goToPage(currentPage + pageNeighbors * 2 + 1);
    };

    const pagination =
        !totalRecords || totalPages === 1 ? null : (
            <nav>
                <ul className={Classes.list}>
                    {pages.map((page, index) => {
                        if (page === LEFT_PAGE)
                            return (
                                <li
                                    key={index}
                                    onClick={handleMoveLeft}
                                    className={`${
                                        currentPage === page
                                            ? `${Classes.active}`
                                            : ''
                                    }`}
                                >
                                    <h4>
                                        <span>&laquo;</span>
                                        <span>Previous</span>
                                    </h4>
                                </li>
                            );

                        if (page === RIGHT_PAGE)
                            return (
                                <li
                                    key={index}
                                    onClick={handleMoveRight}
                                    className={`${
                                        currentPage === page
                                            ? `${Classes.active}`
                                            : ''
                                    }`}
                                >
                                    <h4>
                                        <span>&raquo;</span>
                                        <span>Next</span>
                                    </h4>
                                </li>
                            );

                        return (
                            <li
                                key={index}
                                onClick={handleClick(page)}
                                className={`${
                                    currentPage === page
                                        ? `${Classes.active}`
                                        : ''
                                }`}
                            >
                                <h4>{page}</h4>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        );

    return pagination;
};

export default Pagination;
