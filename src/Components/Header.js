import { AppBar, Toolbar, Typography } from '@mui/material';
import React from 'react';

export default function Header() {
    return (
        <AppBar sx={{ backgroundColor: '#291008' }}>
            <Toolbar sx={{ justifyContent: 'center' }}>
                <Typography variant='h5' className="header-title">
                    Book Search Project
                </Typography>
            </Toolbar>
        </AppBar>
    );
}
