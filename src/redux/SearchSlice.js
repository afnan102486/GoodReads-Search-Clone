import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    query: '',
    suggestions: [],
};

const SearchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setQuery: (state, action) => {
            state.query = action.payload;
        },
        setSuggestions: (state, action) => {
            state.suggestions = action.payload;
        },
    },
});

export const { setQuery, setSuggestions } = SearchSlice.actions;
export default SearchSlice.reducer;