import {
  Box,
  Typography,
  Button,
  CircularProgress,
  FormControl,
  Input,
  Snackbar,
  Alert,
} from "@mui/material";
import { ChatState } from "../Context/ChatProvider";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { useEffect, useState } from "react";
import axios from "axios";
import "./Style.css"
import ScrollableChat from "./ScrollableChat";
import io from 'socket.io-client'
import { FaLeftLong } from "react-icons/fa6";
import Lottie from 'react-lottie'
import animationData from '../animations/typing.json'

const ENDPOINT = "https://mernchat-backend-s126.onrender.com";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, setSelectedChat, selectedChat, notification, setNotification } = ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false)
  const [ typing, setTyping ] = useState(false)
  const [ istyping, setisTyping ] = useState(false)

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "", // "success", "error", "warning", or "info"
  });

  const handleAlertClose = () => {
    setAlert((prev) => ({ ...prev, open: false }));
  };
  
  const fetchMessages = async () => {
    if (!selectedChat) return; 
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        setLoading(true)

        const { data } = await axios.get(
          `/api/message/${selectedChat._id}`,
          config
        );
        setMessages(data);
        setLoading(false)
        socket.emit("join chat", selectedChat._id);
      } catch (error) {
        setAlert({
          open: true,
          message: "Failed to load messages",
          severity: "error",
        });
      }
  };
  // console.log(messages)

  useEffect(() => {
    socket = io(ENDPOINT)
    socket.emit("setup", user)
    socket.on('connected',()=> setSocketConnected(true))
    socket.on('typing', () => setisTyping(true))
    socket.on('stop typing', () => setisTyping(false))

  }, []);

  useEffect(()=> {
    fetchMessages();
    selectedChatCompare = selectedChat;
  },[selectedChat])

  console.log(notification,"---------------------------");
  useEffect(() => {
    socket.on("message received",(newMessageReceived) => {
      if(!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id){

        if(!notification.includes(newMessageReceived)){
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain)
        }
      } else{
        setMessages([...messages, newMessageReceived])
      }
    })
  })

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage.trim()) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("")
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        // console.log(data)

        socket.emit("new message",data)
        setMessages([...messages, data]);
      } catch (error) {
        setAlert({
          open: true,
          message: "Failed to send messages",
          severity: "error",
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: "28px", md: "30px" },
              paddingBottom: 2,
              paddingX: 2,
              width: "100%",
              fontFamily: "Work sans",
              display: "flex",
              justifyContent: { xs: "space-between" },
              alignItems: "center",
            }}
          >
            <Button
              sx={{ display: { xs: "flex", md: "none" } }}
              onClick={() => setSelectedChat("")}
            >
              <FaLeftLong fontSize= "24px" color= "black"/>
            </Button>

            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              flexDirection: "column",
              padding: 3,
              backgroundColor: "#E8E8E8",
              width: "100%",
              height: "100%",
              borderRadius: "12px",
              overflowY: "hidden",
            }}
          >
            {loading ? (
              <CircularProgress
                sx={{
                  fontSize: "20px",
                  width: "20",
                  height: "20",
                  alignSelf: "center",
                  margin: "auto",
                }}
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages}  />
              </div>
            )}

            <FormControl margin="normal" fullWidth>
            {istyping ? (
                <div>  
                  <Lottie
                    options={defaultOptions}
                    // height={50}
                    width={70}
                    // borderRadius={5}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
              <Input
                variant="filled"
                style={{ backgroundColor: "#E0E0E0" }}
                placeholder="Enter the message..."
                value={newMessage}
                onChange={typingHandler}
                onKeyDown={sendMessage} // Handle key press
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Typography
            variant="h4"
            sx={{ paddingBottom: 3, fontFamily: "Work sans" }}
          >
            Click on a user to start chatting
          </Typography>
        </Box>
      )}

      {/* Snackbar for error alerts */}
      <Snackbar
        open={alert.open}
        autoHideDuration={5000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert onClose={handleAlertClose} severity={alert.severity}>
          {alert.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SingleChat;
