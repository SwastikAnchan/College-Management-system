import React from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, Typography } from '@mui/material';

const AdminProfile = () => {
    const { currentUser } = useSelector((state) => state.user);

    return (
        <Card sx={{ maxWidth: 345, margin: 'auto', mt: 5 }}>
            <CardContent>
                <Typography variant="h5" component="div">
                    {currentUser.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Email: {currentUser.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    School: {currentUser.schoolName}
                </Typography>
            </CardContent>
        </Card>
    );
}

export default AdminProfile;
