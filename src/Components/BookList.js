import React, { useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, Paper, Button } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import InfiniteScroll from "react-infinite-scroll-component";
import xml2js from 'xml2js';
import { setBooks, appendBooks, setQuery, setLoading, setError, resetBooks } from '../redux/BookSlice';
import { logoutUser } from '../redux/UserSlice';


const BookList = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const { query, books, loading, error, page, hasMore } = useSelector((state) => state.books);

    const fetchBooks = useCallback(async (searchQuery, page, isFirstPage = false) => {
        dispatch(setLoading(true));
        dispatch(setError(''));

        const url = `https://www.goodreads.com/search/index.xml?key=FtRVHgmjzjpzKjCt3SUMw&q=${searchQuery}&page=${page}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const textData = await response.text();
            const parser = new xml2js.Parser();
            const parsedData = await parser.parseStringPromise(textData);

            if (parsedData.GoodreadsResponse.search[0].results[0].work) {
                const booksData = parsedData.GoodreadsResponse.search[0].results[0].work.map((item) => ({
                    id: item.best_book[0].id[0],
                    title: item.best_book[0].title[0],
                    author: item.best_book[0].author[0].name[0],
                    imageUrl: item.best_book[0].image_url[0],
                }));

                if (isFirstPage) {
                    dispatch(setBooks({ books: booksData, page: page + 1, hasMore: booksData.length > 0 }));
                } else {
                    dispatch(appendBooks({ books: booksData, page: page + 1, hasMore: booksData.length > 0 }));
                }
            } else {
                dispatch(setError("No results found."));
                dispatch(setLoading(false));
            }
        } catch (error) {
            dispatch(setError("Error fetching data. Please try again."));
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    useEffect(() => {
        const searchQuery = location.state?.query || '';
        if (searchQuery) {
            dispatch(setQuery(searchQuery));
            fetchBooks(searchQuery, 1, true);
        } else {
            dispatch(resetBooks());
        }
    }, [location.state?.query, dispatch, fetchBooks]); 

    const fetchMoreData = () => {
        if (query && hasMore) {
            fetchBooks(query, page);
        }
    };

    const handleBookClick = (id) => {
        navigate(`/BookDetails/${id}`);
    };

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate('/Login');
    };
    const handleBack = () => {
        navigate('/SearchBar');
    }


    return (
        <Box sx={{ marginTop: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            {isAuthenticated && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', paddingRight: '16px', paddingBottom: '16px' }}>
                    <Button variant="contained" sx={{ backgroundColor: '#59260e' }} onClick={handleLogout}>
                        Logout
                    </Button>
                </Box>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', paddingRight: '16px', paddingBottom: '16px' }}>
                <Button variant="contained" sx={{ backgroundColor: '#59260e' }} onClick={handleBack}>
                    Search Page
                </Button>
            </Box>
    
            {query && (
                <Typography variant="h4" sx={{ marginBottom: '20px', color: '#eee'}}>
                    Search results for : "{query}"
                </Typography>
            )}
    
            {error && <Typography color="error">{error}</Typography>}
            {books.length === 0 && !loading && <Typography>No books found.</Typography>}
    
            <Box sx={{ marginTop: '20px', width: '100%' }}>
                <Paper sx={{width: '80%', margin:'0 auto'}}>
                <InfiniteScroll
                    dataLength={books.length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                    endMessage={<Typography>No more books to load.</Typography>}
                >
                    <ol style={{ listStyleType: 'none', padding: 30 }}>
                        {books.map((book, index) => (
                            <li key={`${book.id}-${index}`} style={{ marginBottom: '5px', cursor: 'pointer' }} onClick={() => handleBookClick(book.id._)}>
                                <Typography variant="h6" sx={{ padding: '10px', color: '#291008', textDecoration:'underline'}}>
                                    {index + 1}. {book.title}
                                </Typography>
                            </li>
                        ))}
                    </ol>
                </InfiniteScroll>
                </Paper>
            </Box>
            
            {loading && <CircularProgress />}
        </Box>
    );
    
};

export default BookList;