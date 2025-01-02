import { Box } from "@mui/material";
import SideDrawer from "../component/miscellaneous/SideDrawer";
import { ChatState } from "../Context/ChatProvider";
import MyChats from "../component/MyChats";
import ChatBox from "../component/ChatBox";
import { useState } from "react";

const Chatpage = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div style={{width:"100%"}}>
      { user && <SideDrawer/> }
      <Box display="flex" justifyContent="space-between" width='100%' height='91.5vh' padding='10px'>
        { user && (
          <MyChats fetchAgain={fetchAgain} /> 
        )}
        { user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} /> 
        )}
      </Box>
       
   </div>
  );
};

export default Chatpage;
