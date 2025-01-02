import React, { useEffect, useState } from "react";
import { Container, Box, Typography, Tabs, Tab } from "@mui/material";
import Login from './../component/Authentication/Login';
import SignUp from './../component/Authentication/SignUp';
import { useNavigate } from "react-router-dom";

function Homepage() {


  const [selectedTab, setSelectedTab] = useState(0);
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const navigate = useNavigate();

    useEffect(()=>{
        const user = JSON.parse(localStorage.getItem("userInfo"));

        if(user){
            navigate('/chats')
        }
    },[navigate])

  return (
    <Container maxWidth="sm" >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          padding: 3,
          backgroundColor: "white",
          borderRadius: "10px",
          margin: "45px 0 15px 0",
        }}
      >  
        <Typography variant="h5">Let's Chat</Typography>
      </Box>


      <Box sx={{ width: "100%", maxWidth:"sm", padding: 3, borderRadius: "10px", bgcolor:"white" }}>
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        sx={{ width: "100%" }}
      >
        <Tab
          label="Login"
          sx={{
            flex: 1, 
            textAlign: "center",
          }}
        />
        <Tab
          label="SignUp"
          sx={{
            flex: 1, 
            textAlign: "center",
          }}
        />
      </Tabs>
      
      <Box sx={{ marginTop: 2 }}>
        {selectedTab === 0 && (
          <Typography component="div" variant="body1"><Login/></Typography>
        )}
        {selectedTab === 1 && (
          <Typography component="div"  variant="body1"><SignUp/></Typography>
        )}
      </Box>
    </Box>
      
    </Container>
  );
}

export default Homepage;
