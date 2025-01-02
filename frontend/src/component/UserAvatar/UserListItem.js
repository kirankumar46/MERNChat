import React from 'react';
import { Avatar, Box, Typography } from '@mui/material';

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      sx={{
        cursor: 'pointer',
        bgcolor: '#E8E8E8',
        '&:hover': {
          bgcolor: '#38B2AC',
          color: 'white',
        },
        display: 'flex',
        alignItems: 'center',
        color: 'black',
        px: 2,
        py: 1,
        mb: 1,
        borderRadius: '8px',
      }}
    >
      <Avatar
        sx={{ mr: 2, cursor: 'pointer' }}
        alt={user.name}
        src={user.pic}
      />
      <Box>
        <Typography variant="body1">{user.name}</Typography>
        <Typography variant="body2" color="textSecondary">
          <b>Email:</b> {user.email}
        </Typography>
      </Box>
    </Box>
  );
};

export default UserListItem;
