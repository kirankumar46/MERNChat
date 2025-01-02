import {
  Alert,
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputAdornment,
  Snackbar,
  Stack,
} from "@mui/material";
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import React, { useState } from "react";

const SignUp = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "", // "success", "error", "warning", or "info"
  });

  const handleClick = () => setShow(!show);

  const handleAlertClose = () => {
    setAlert((prev) => ({ ...prev, open: false }));
  };

  const postDetails = (pics) => {
    setLoading(true);

    if (!pics) {
      setAlert({
        open: true,
        message: "Please select an image!",
        severity: "warning",
      });
      setLoading(false);
      return;
    }

    if (
      pics.type !== "image/jpeg" &&
      pics.type !== "image/png" &&
      pics.type !== "image/jpg"
    ) {
      setAlert({
        open: true,
        message: "Only JPG, JPEG, and PNG formats are supported!",
        severity: "error",
      });
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append("file", pics);
    data.append("upload_preset", "mern-chat-app");
    data.append("cloud_name", "dahllycbg");

    fetch("https://api.cloudinary.com/v1_1/dahllycbg/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.url) {
          setPic(data.url.toString());
          setAlert({
            open: true,
            message: "Image uploaded successfully!",
            severity: "success",
          });
        } else {
          setAlert({
            open: true,
            message: "Image upload failed!",
            severity: "error",
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setAlert({
          open: true,
          message: "Something went wrong! Please try again later.",
          severity: "error",
        });
        setLoading(false);
      });
  };

  const submitHandler = async() => {
    setLoading(true);
    if(!name || !email || !password || !confirmpassword){
      setAlert({
        open: true,
        message: "Please fill all the fields",
        severity: "warning",
      });
      setLoading(false)
      return
    }
    if(password !== confirmpassword){
      setAlert({
        open: true,
        message: "Password is not Matching",
        severity: "warning",
      });
      return
    }
    try{
      const config = {
        headers: {
          "Content-Type" : "application/json",
        },
      };
      const {data} = await axios.post( 
        "/api/user",
        {name, email, password, pic }, config
      )
      setAlert({
        open: true,
        message: "Registered Successfully",
        severity: "success",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false)
      navigate('/chats')
    } catch(error){
      console.error(error);
      setLoading(false)
    }
  };

  return (
    <Stack spacing={3}>
      <FormControl id="first-name">
        <FormLabel>
          Name <span style={{ color: "red" }}>*</span>
        </FormLabel>
        <Input
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>

      <FormControl id="email">
        <FormLabel>
          Email <span style={{ color: "red" }}>*</span>
        </FormLabel>
        <Input
          placeholder="Enter Your Email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl id="password">
        <FormLabel>
          Password <span style={{ color: "red" }}>*</span>
        </FormLabel>
        <Input
          type={show ? "text" : "password"}
          placeholder="Enter Password"
          onChange={(e) => setPassword(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                onClick={handleClick}
                sx={{ fontSize: "1rem" }}
                edge="center"
              >
                {show ? "hide" : "show"}
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>

      <FormControl id="confirmpassword">
        <FormLabel>
          Confirm Password <span style={{ color: "red" }}>*</span>
        </FormLabel>
        <Input
          type={show ? "text" : "password"}
          placeholder="Confirm Password"
          onChange={(e) => setConfirmpassword(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                onClick={handleClick}
                sx={{ fontSize: "1rem" }}
                edge="center"
              >
                {show ? "hide" : "show"}
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>

      <FormControl id="pic">
        <FormLabel>Upload Your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>

      <Button
        sx={{ bgcolor: "blue", color: "white", width: "100%" }}
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        SignUp
      </Button>

      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleAlertClose}
          severity={alert.severity}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default SignUp;
