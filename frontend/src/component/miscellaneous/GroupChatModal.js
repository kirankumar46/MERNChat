import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  IconButton,
} from "@mui/material";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import UserListItem from "../UserAvatar/UserListItem";
import { FaXmark } from "react-icons/fa6";

const GroupChatModal = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, chats, setChats } = ChatState();

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      alert("User already added");
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${query}`, config);
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      alert("Failed to load the search results");
    }
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((u) => u._id !== delUser._id));
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers.length) {
      alert("Please fill all the fields");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      setOpen(false);
      alert("New Group Chat Created!");
    } catch (error) {
      alert("Failed to create the chat");
    }
  };

  return (
    <div>
      <span onClick={() => setOpen(true)}>{children}</span>
      <Modal open={open} onClose={() => setOpen(false)} aria-labelledby="modal-title">
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", md: 400 },
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            padding: 3,
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography id="modal-title" variant="h6" component="h2">
              Create Group Chat
            </Typography>
            <IconButton onClick={() => setOpen(false)}>
                <FaXmark />
            </IconButton>
          </Box>
          <Box mt={2}>
            <TextField
              fullWidth
              label="Chat Name"
              variant="outlined"
              value={groupChatName}
              onChange={(e) => setGroupChatName(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Add Users (e.g., John, Jane)"
              variant="outlined"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              margin="normal"
            />
            <Box display="flex" flexWrap="wrap" gap={1} my={2}>
              {selectedUsers.map((u) => (
                <UserBadgeItem key={u._id} user={u} handleFunction={() => handleDelete(u)} />
              ))}
            </Box>
            {loading ? (
              <CircularProgress size={24} sx={{ display: "block", margin: "0 auto" }} />
            ) : (
              searchResult?.slice(0, 4).map((user) => (
                <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />
              ))
            )}
          </Box>
          <Box mt={3} textAlign="center">
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Create Chat
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default GroupChatModal;

