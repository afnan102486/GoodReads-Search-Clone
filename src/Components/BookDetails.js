import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Paper, Typography, CircularProgress, Button } from '@mui/material';
import xml2js from 'xml2js';
import Rating from '@mui/material/Rating';
import { setBookDetails, setLoading, setError } from '../redux/BookSlice';

const BookDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { bookDetails, loading, error } = useSelector((state) => state.books);

    useEffect(() => {
        const fetchBookDetails = async () => {
            dispatch(setLoading(true));
            dispatch(setError(''));

            const url = `https://www.goodreads.com/book/show/${id}.xml?key=FtRVHgmjzjpzKjCt3SUMw`;

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const textData = await response.text();
                const parser = new xml2js.Parser();
                const parsedData = await parser.parseStringPromise(textData);

                const book = parsedData.GoodreadsResponse.book[0];
                const bookDetailsData = {
                    title: book.title[0],
                    author: book.authors[0].author[0].name[0],
                    imageUrl: book.image_url[0],
                    publicationYear: book.publication_year[0],
                    rating: book.average_rating[0],
                };
                
                dispatch(setBookDetails(bookDetailsData));
            } catch (error) {
                console.error("Error fetching book details:", error);
                dispatch(setError("Error fetching book details. Please try again."));
            } finally {
                dispatch(setLoading(false));
            }
        };

        fetchBookDetails();
    }, [id, dispatch]);


    const handlePage = () => {
        navigate('/SearchBar');
    }

    const paperStyle = { padding: '30px 20px', width: 500, margin: "20px auto", position: 'relative', top: '70px' };

    return (
        <Box sx={{ textAlign: 'center' }}>
            <Paper elevation={20} style={paperStyle}>
                {loading && <CircularProgress />}
                {error && <Typography color="error">{error}</Typography>}
                {bookDetails && (
                    <>
                        <Typography variant="h5" sx={{ marginBottom: '20px' }}>{bookDetails.title}</Typography>
                        <img src={bookDetails.imageUrl} alt={bookDetails.title} style={{ width: '40%', height: '300px', marginBottom: '20px' }} />
                        <Typography variant="h6" sx={{ marginBottom: '10px' }}>Author: {bookDetails.author}</Typography>
                        <Typography variant="h6" sx={{ marginBottom: '10px' }}>Published: {bookDetails.publicationYear}</Typography>
                        <Rating name="half-rating-read" precision={0.5} value={parseFloat(bookDetails.rating)} readOnly />
                        <Typography variant="h6" sx={{ marginBottom: '10px' }}>Avg Rating: {bookDetails.rating}</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', paddingRight: '16px', paddingBottom: '16px' }}>
                    <Button variant="contained" sx={{ backgroundColor: '#59260e' }} onClick={handlePage}>
                    Search Page
                    </Button>
                </Box>
                    </>
                )}
            </Paper>
        </Box>
    );
};

export default BookDetails;
