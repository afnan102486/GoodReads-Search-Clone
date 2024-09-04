import React, { useState, useEffect } from 'react';
import { Grid, Paper, Avatar, Typography, TextField, Button, Box } from '@mui/material';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import KeyIcon from '@mui/icons-material/Key';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/UserSlice';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated); 

    const handleInput = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleClick = () => {
        dispatch(loginUser(credentials));
    };

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/SearchBar');
        }
    }, [isAuthenticated, navigate]);

    return (
        <Grid className="login-grid">
            <Paper elevation={20} className="login-paper">
                <Grid align='center'>
                    <Avatar className="login-avatar">
                        <LockOutlinedIcon />
                    </Avatar>
                    <h2 className="login-header">Login</h2>
                    <Typography variant='caption'>Enter Your Credentials</Typography>
                </Grid>

                <form className="login-form"> 
                    <Box className="login-box">
                        <AlternateEmailIcon className="login-icon" />
                        <TextField
                            variant='standard'
                            name='email' 
                            fullWidth 
                            label='Email' 
                            placeholder='Enter Your Email' 
                            value={credentials.email} 
                            onChange={handleInput}
                        />
                    </Box>

                    <Box className="login-box">
                        <KeyIcon className="login-icon" />
                        <TextField 
                            variant='standard'
                            name='password' 
                            fullWidth 
                            label='Password' 
                            placeholder='Enter Your Password' 
                            value={credentials.password} 
                            onChange={handleInput} 
                            type='password'
                        />
                    </Box>

                    <div className="login-button-container">
                        <Button 
                            onClick={handleClick}
                            type="button" 
                            variant="contained" 
                            className="login-button"
                        >
                            Login
                        </Button>
                    </div>

                    <div className="login-register-link">
                        <small>Need an account? <Link to="/Register">Register here</Link></small>
                    </div>
                </form>
            </Paper>
        </Grid>
    );
}

export default Login;
