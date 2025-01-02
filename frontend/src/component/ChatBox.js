// import "./styles.css";
import SingleChat from "./SingleChat";
import { ChatState } from "../Context/ChatProvider";
import { Box } from "@mui/material";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    <Box
      sx={{
        display: { xs: selectedChat ? "flex" : "none", md: "flex" },
        alignItems: "center",
        flexDirection: "column",
        padding: 3,
        backgroundColor: "white",
        width: { xs: "100%", md: "68%" },
        borderRadius: 2,
        border: "1px solid rgba(0, 0, 0, 0.12)",
      }}  
      >  
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default Chatbox;