import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    books: [],
    query: '',
    bookDetails: null,
    error: null,
    loading: false,
    page: 1,
    hasMore: true,
};

const BookSlice = createSlice({
    name: 'books',
    initialState,
    reducers: {
        setBooks(state, action) {
            state.books = action.payload.books;
            state.page = action.payload.page;
            state.hasMore = action.payload.hasMore;
        },
        appendBooks(state, action) {
            state.books = [...state.books, ...action.payload.books];
            state.page = action.payload.page;
            state.hasMore = action.payload.hasMore;
        },
        setQuery(state, action) {
            state.query = action.payload;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
        },
        resetBooks(state) {
            state.books = [];
            state.page = 1;
            state.hasMore = true;
            state.error = null;
            state.loading = false;
        },
        setBookDetails(state, action) {
            state.bookDetails = action.payload;
        },
        resetBookDetails(state) {
            state.bookDetails = null;
        },
    },
});

export const {
    setBooks,
    appendBooks,
    setQuery,
    setLoading,
    setError,
    resetBooks,
    setBookDetails,
    resetBookDetails,
} = BookSlice.actions;

export default BookSlice.reducer;
