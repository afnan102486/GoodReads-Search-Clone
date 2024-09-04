import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setQuery, setSuggestions } from '../redux/SearchSlice';
import { Box, TextField, Container, Button, List, ListItem, ListItemText, Paper } from '@mui/material';
import goodreadsImage from './goodreads.png';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce';
import { logoutUser } from '../redux/UserSlice';

const SearchBar = () => {
    const [localQuery, setLocalQuery] = useState('');
    const showSuggestions = useSelector((state) => state.search.suggestions.length > 0);
    const suggestions = useSelector((state) => state.search.suggestions);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSuggestions = debounce(async (searchQuery) => {
            if (searchQuery.trim()) {
                try {
                    const url = `https://www.goodreads.com/search/index.xml?key=FtRVHgmjzjpzKjCt3SUMw&q=${searchQuery}`;
                    const response = await fetch(url);
                    const textData = await response.text();
                    const parser = new DOMParser();
                    const xml = parser.parseFromString(textData, "text/xml");
                    const works = xml.getElementsByTagName("work");
                    const newSuggestions = [];

                    for (let i = 0; i < Math.min(7, works.length); i++) {
                        const title = works[i].getElementsByTagName("title")[0].textContent;
                        newSuggestions.push(title);
                    }

                    dispatch(setSuggestions(newSuggestions));
                } catch (error) {
                    console.error("Error fetching suggestions:", error);
                    dispatch(setSuggestions([]));
                }
            } else {
                dispatch(setSuggestions([])); 
            }
        }, 300); 

        if (localQuery) {
            fetchSuggestions(localQuery);
        } else {
            dispatch(setSuggestions([]));
        }

        return () => {
            fetchSuggestions.cancel();
        };
    }, [localQuery, dispatch]);

    const handleInputChange = (e) => {
        setLocalQuery(e.target.value);
        dispatch(setQuery(e.target.value)); 
    };

    const handleSuggestionClick = async (suggestion) => {
        setLocalQuery(suggestion);
        dispatch(setQuery(suggestion));

        if (!isAuthenticated) {
            navigate('/Login');
        } else {
            try {
                const url = `https://www.goodreads.com/search/index.xml?key=FtRVHgmjzjpzKjCt3SUMw&q=${suggestion}`;
                const response = await fetch(url);
                const textData = await response.text();
                const parser = new DOMParser();
                const xml = parser.parseFromString(textData, "text/xml");
                const works = xml.getElementsByTagName("best_book");

                if (works.length > 0) {
                    const bookId = works[0].getElementsByTagName("id")[0].textContent;
                    navigate(`/BookDetails/${bookId}`);
                } else {
                    console.error("Book ID not found.");
                }
            } catch (error) {
                console.error("Error fetching book details:", error);
            }
        }
    };

    const handleSearch = (event) => {
        event.preventDefault();
        if (localQuery.trim()) {
            if (!isAuthenticated) {
                navigate('/Login');
            } else {
                navigate('/BookList', { state: { query: localQuery } });
            }
        }
    };

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate('/Login');
    };

    return (
        <Container maxWidth="sm" className="searchbar-container">
            <Paper elevation={20} className="searchbar-paper">
                <Box
                    component="img"
                    className="searchbar-image"
                    alt="Banner"
                    src={goodreadsImage}
                />

                <Box className="searchbar-box">
                    <form onSubmit={handleSearch} className="searchbar-form">
                        <TextField 
                            variant='standard'
                            fullWidth
                            placeholder="Search..."
                            value={localQuery}
                            onChange={handleInputChange}
                        />
                        <Button type="submit" variant="contained" className="searchbar-button">
                            Search
                        </Button>
                    </form>
                    
                    {showSuggestions && (
                        <Paper className="suggestions-paper">
                            <List>
                                {suggestions.map((suggestion, index) => (
                                    <ListItem key={index} onClick={() => handleSuggestionClick(suggestion)}>
                                        <ListItemText primary={suggestion} />
                                    </ListItem>
                                ))}
                            </List>
                        </Paper>
                    )}
                </Box>
                
                {isAuthenticated && (
                    <Box className="logout-button-container">
                        <Button variant="contained" className="logout-button" onClick={handleLogout}>
                            Logout
                        </Button>
                    </Box>
                )}
            </Paper>
        </Container>
    );
};

export default SearchBar;
