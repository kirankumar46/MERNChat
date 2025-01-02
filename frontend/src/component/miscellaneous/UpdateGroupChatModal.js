import { Dialog, DialogActions, DialogContent, DialogTitle, Button, IconButton, TextField, CircularProgress } from "@mui/material";
import { useState } from "react";

import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import UserListItem from "../UserAvatar/UserListItem";
import { FaEdit } from "react-icons/fa";

const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
  const [open, setOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);

  const { selectedChat, setSelectedChat, user } = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
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
      // Handle error (similar to the original toast)
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      // Handle error (similar to the original toast)
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      // Handle error
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      // Handle error
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      // Handle error
      setLoading(false);
    }
  };

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      // Handle error
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      // Handle error
      setLoading(false);
    }
  };

  return (
    <>
      <IconButton onClick={() => setOpen(true)}>
      <FaEdit />      
      </IconButton>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{selectedChat.chatName}</DialogTitle>
        <DialogContent>
          <div>
            {selectedChat.users.map((u) => (
              <UserBadgeItem
                key={u._id}
                user={u}
                admin={selectedChat.groupAdmin}
                handleFunction={() => handleRemove(u)}
              />
            ))}
          </div>
          <TextField
            fullWidth
            label="Chat Name"
            variant="outlined"
            margin="normal"
            value={groupChatName}
            onChange={(e) => setGroupChatName(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleRename}
            disabled={renameloading}
            startIcon={renameloading && <CircularProgress size={20} />}
          >
            Update
          </Button>
          <TextField
            fullWidth
            label="Add User to group"
            variant="outlined"
            margin="normal"
            onChange={(e) => handleSearch(e.target.value)}
          />
          {loading ? (
            <CircularProgress size={24} />
          ) : (
            searchResult.map((user) => (
              <UserListItem
                key={user._id}
                user={user}
                handleFunction={() => handleAddUser(user)}
              />
            ))
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleRemove(user)} color="secondary">
            Leave Group
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UpdateGroupChatModal;
