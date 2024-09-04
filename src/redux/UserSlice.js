import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    user: JSON.parse(localStorage.getItem("currentUser")) || null,
    isAuthenticated: !!localStorage.getItem("currentUser"),
};

export const registerUser = createAsyncThunk('auth/registerUser', async (userData) => {
    const existingUsers = JSON.parse(localStorage.getItem("UserData")) || [];
    existingUsers.push(userData);
    localStorage.setItem("UserData", JSON.stringify(existingUsers));
    localStorage.setItem("currentUser", JSON.stringify(userData));
    return { user: userData, isAuthenticated: false };
});

export const loginUser = createAsyncThunk('auth/loginUser', async (credentials) => {
    const { email, password } = credentials;
    const existingUsers = JSON.parse(localStorage.getItem("UserData")) || [];
    const foundUser = existingUsers.find(user => user.email === email && user.password === password);
    
    if (foundUser) {
        localStorage.setItem("currentUser", JSON.stringify(foundUser));
        return { isAuthenticated: true }; 
    } else {
        return { isAuthenticated: false }; 
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logoutUser: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem("currentUser");
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.isAuthenticated = action.payload.isAuthenticated;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isAuthenticated = action.payload.isAuthenticated;
                if (action.payload.isAuthenticated) {
                    state.user = JSON.parse(localStorage.getItem("currentUser"));
                }
            });
    },
});

export const { logoutUser } = authSlice.actions;
export default authSlice.reducer;