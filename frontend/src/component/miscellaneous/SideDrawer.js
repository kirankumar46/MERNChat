import {
  Avatar,
  Box,
  Button,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  IconButton,
  Badge,
  Divider,
  Drawer,
  InputBase,
  Snackbar,
  Alert,
  CircularProgress,
  MenuList,
} from "@mui/material";
import { FaBell } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";

import React, { useState } from "react";
import { ChatState } from "./../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { getSender } from "../../config/ChatLogics";

const SideDrawer = () => {
  const [bellAnchor, setBellAnchor] = useState(null);
  const [profileAnchor, setProfileAnchor] = useState(null);

  const { user, setSelectedChat, chats, setChats, notification, setNotification} = ChatState();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: '', // "success", "error", "warning", or "info"
  });

  const handleAlertClose = () => {
    setAlert((prev) => ({ ...prev, open: false }));
  };

  const handleSearch = async () => {
    if (!search) {
      setAlert({
        open: true,
        message: 'Please enter something in search.',
        severity: 'warning',
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      setLoading(false);
      setAlert({
        open: true,
        message: 'Error occurred! Failed to load the search results.',
        severity: 'error',
      });
    }
  };

  const accessChat = async (userId) => {
    console.log(userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      setLoading(false);
      setAlert({
        open: true,
        message: 'Error occurred! Failed to load the search results.',
        severity: 'error',
      });
    }
  };

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const logoutHandler = () => {
    localStorage.removeItem("userInfo")
    navigate("/")
  }

  // Handlers for Bell Menu
  const handleBellMenuOpen = (event) => {
    setBellAnchor(event.currentTarget);
  };
  const handleBellMenuClose = () => {
    setBellAnchor(null);
  };
    
  // Handlers for Profile Menu
  const handleProfileMenuOpen = (event) => {
    setProfileAnchor(event.currentTarget);
  };
  const handleProfileMenuClose = () => {
    setProfileAnchor(null);
  };

  return (
    <div>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        backgroundColor="white"
        width="100%"
        padding="5px 10px"
        border="2px"
      >
        <Tooltip title="Search Users to chat" arrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
              <FaSearch />
            <Typography display={{ xs: "none", md: "block" }} paddingX={2}>
              Search User
            </Typography>
          </Button>
        </Tooltip>

        <Typography fontSize="24px" fontFamily="Work sans">
          Talk-A-Tive
        </Typography>

        <div>
          {/* Bell Icon with Menu */}
          <IconButton onClick={handleBellMenuOpen}>
          <Badge badgeContent={notification.length} color="error">
            <FaBell fontSize="25px" />
          </Badge>
          </IconButton>
          <Menu
            anchorEl={bellAnchor}
            open={Boolean(bellAnchor)}
            onClose={handleBellMenuClose}
          > 
           
           <MenuList style={{ padding: "8px 16px" }}>
            {!notification.length && <MenuItem disabled>No New Messages</MenuItem>}
              {notification.map((notif)  => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          {/* User Profile */}
          <IconButton onClick={handleProfileMenuOpen}>
            <Avatar
              alt={user?.name}
              src={user?.pic}
              sx={{ cursor: "pointer", width: 32, height: 32 }}
            />
          </IconButton>
          <Menu
            anchorEl={profileAnchor}
            open={Boolean(profileAnchor)}
            onClose={handleProfileMenuClose}
          >
            <MenuItem >
            <ProfileModal user={user}>
              <Typography variant="h6" fontWeight="bold">
                My Profile
              </Typography>
            </ProfileModal>
            </MenuItem>
            <Divider />
            <MenuItem onClick={logoutHandler}>
              <Typography variant="h6" fontWeight="bold" color="error">
                Logout
              </Typography>
            </MenuItem>
          </Menu>
        </div>
      </Box>
      

      <Snackbar
        open={alert.open}
        autoHideDuration={5000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <Alert onClose={handleAlertClose} severity={alert.severity}>
          {alert.message}
        </Alert>
      </Snackbar>

      <Drawer anchor="left" open={isOpen} onClose={onClose}>
        <Box
          sx={{
            width: 300,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          {/* Drawer Header */}
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="h6">Search Users</Typography>
          </Box>

          {/* Drawer Body */}
          <Box sx={{ p: 2, flex: 1 }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <InputBase
                placeholder="Search by name or email"
                fullWidth
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{
                  px: 1,
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSearch}
              >
                Go
              </Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (   
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <CircularProgress sx={{ ml: 'auto', display: 'flex' }} />}

          </Box>

          <Divider />
        </Box>
      </Drawer>

    </div>
  );
};

export default SideDrawer;
