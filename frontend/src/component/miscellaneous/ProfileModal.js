import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  Avatar,
  IconButton,
  Button,
} from '@mui/material';
import { FaEye } from "react-icons/fa";


const ProfileModal = ({ user, children }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      {children ? (
        <span onClick={handleOpen}>{children}</span>
      ) : (
        <IconButton onClick={handleOpen}>
          <FaEye />
        </IconButton>
      )}

      <Modal open={open} onClose={handleClose} aria-labelledby="profile-modal-title" aria-describedby="profile-modal-description">
        <Box sx={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 410,
          width: 400,
          borderRadius: 2,
        }}>

          <Avatar 
            sx={{ width: 150, height: 150 }} 
            src={user.pic} 
            alt={user.name} 
          />
          <Typography 
            id="profile-modal-title" 
            variant="h5" 
            component="div"
            gutterBottom
          >
            {user.name}
          </Typography>
          <Typography 
            id="profile-modal-description" 
            variant="body1"
          >
            Email: {user.email}
          </Typography>
          <Button onClick={handleClose} variant="contained" color="primary">
            Close
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default ProfileModal;
