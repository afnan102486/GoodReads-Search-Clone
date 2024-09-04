import React, { useState } from 'react';
import { Grid, Paper, Avatar, Typography, TextField, Button, Box } from '@mui/material';
import AppRegistrationOutlinedIcon from '@mui/icons-material/AppRegistrationOutlined';
import LockIcon from '@mui/icons-material/Lock';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import PersonIcon from '@mui/icons-material/Person';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerUser } from '../redux/UserSlice';

const Register = () => {
    const [user, setUser] = useState({ name: "", email: "", password: "", cpassword: "" });
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleInput = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleClick = () => {
        if (user.password === user.cpassword) {
            dispatch(registerUser(user));
            navigate('/Login'); 
        } else {
            alert("Passwords do not match!");
        }
    };

    return (
        <Grid className="register-grid">
            <Paper elevation={20} className="register-paper">
                <Grid align='center'>
                    <Avatar className="register-avatar">
                        <AppRegistrationOutlinedIcon />
                    </Avatar>
                    <h2 className="register-header">Register</h2>
                    <Typography variant='caption'>Create Your Account</Typography>
                </Grid>
                <form className="register-form">
                    <Box className="register-box">
                        <PersonIcon className="register-icon" />
                        <TextField
                            className="register-textfield" name='name' variant='standard' fullWidth label='Name' placeholder='Enter Your Name' value={user.name} onChange={handleInput}
                        />
                    </Box>
                    <Box className="register-box">
                        <AlternateEmailIcon className="register-icon" />
                        <TextField className="register-textfield" name='email' variant='standard' fullWidth label='Email' placeholder='Enter Your Email' value={user.email} onChange={handleInput}
                        />
                    </Box>
                    <Box className="register-box">
                        <LockIcon className="register-icon" />
                        <TextField className="register-textfield" name='password' variant='standard' fullWidth label='Password' placeholder='Enter Your Password' value={user.password} onChange={handleInput} type='password'
                        />
                    </Box>
                    <Box className="register-box">
                        <LockIcon className="register-icon" />
                        <TextField className="register-textfield" name='cpassword' variant='standard' fullWidth label='Confirm Password' placeholder='Enter Your Password Again' value={user.cpassword} onChange={handleInput} type='password'
                        />
                    </Box>
                    <div className="register-button-container">
                        <Button onClick={handleClick} type="button" variant="contained" className="register-button">Sign Up</Button>
                    </div>
                    <div className="register-login-link">
                        <small>Already registered? <Link to="/Login">Login here</Link></small>
                    </div>
                </form>
            </Paper>
        </Grid>
    );
}

export default Register;
