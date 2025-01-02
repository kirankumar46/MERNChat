import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import axios from "axios";
import { getSender } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import { ChatState } from "../Context/ChatProvider";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { FaPlus } from "react-icons/fa6";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/chat", config);
      console.log(data)
      setChats(data);
    } catch (error) {
      console.error("Failed to load the chats", error);
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  return (
    
    <Box
      sx={{
        display: { xs: selectedChat ? "none" : "flex", md: "flex" },
        flexDirection: "column",
        alignItems: "center",
        padding: 2,
        backgroundColor: "white",
        width: { xs: "100%", md: "31%" },
        borderRadius: 2,
        border: "1px solid rgba(0, 0, 0, 0.12)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          paddingBottom: 2,
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontFamily: "Work sans", fontSize: { xs: 20, md: 24 } }}
        >
          My Chats
        </Typography>
        <GroupChatModal>
        <Button
          variant="contained"
          startIcon={<FaPlus />}
          sx={{
          fontSize: { xs: 14, lg: 16 },
          backgroundColor: "lightgrey",
          color: "black",
          "&:hover": {
          backgroundColor: "darkgrey",
          },
          }}
          >
            New Group Chat
        </Button>

        </GroupChatModal>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: 2,
          backgroundColor: "#F8F8F8",
          width: "100%",
          height: "100%",
          borderRadius: 2,
          overflowY: "auto",
        }}
      >
        {chats ? (
          <Stack spacing={1}>
            {chats.map((chat) => (
              <Box
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                sx={{
                  cursor: "pointer",
                  backgroundColor: selectedChat === chat ? "#38B2AC" : "#E8E8E8",
                  color: selectedChat === chat ? "white" : "black",
                  paddingX: 2,
                  paddingY: 1,
                  borderRadius: 2,
                }}
              >
                <Typography variant="body1">
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Typography>
                {/* {chat.latestMessage && (
                  <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                    <b>{chat.latestMessage.sender.name}: </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Typography>
                )} */}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  
  );
};

export default MyChats;

