import { configureStore } from '@reduxjs/toolkit';
import authReducer from './UserSlice';
import searchReducer from './SearchSlice'; 
import bookReducer from './BookSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        search: searchReducer,
        books: bookReducer,
    },
});

export default store;
