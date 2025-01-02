
import { Button, FormControl, FormLabel, IconButton, Input, InputAdornment, Stack } from '@mui/material';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ChatState } from '../../Context/ChatProvider';

const Login = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: '', // "success", "error", "warning", or "info"
  });

  const handleClick = () => setShow(!show);

  const handleAlertClose = () => {
    setAlert((prev) => ({ ...prev, open: false }));
  };

  const { setUser } = ChatState();

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      setAlert({
        open: true,
        message: 'Please fill all the fields',
        severity: 'warning',
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      console.log('Sending data:', { email, password });
      const { data } = await axios.post('/api/user/login', { email, password }, config);

      setAlert({
        open: true,
        message: 'Login Successful',
        severity: 'success',
      });
      setUser(data)
      // Save user info to localStorage
      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);

      // Navigate to chats page
      navigate('/chats');
    } catch (error) {
      setAlert({
        open: true,
        message: error.response?.data?.message || 'Something went wrong!',
        severity: 'error',
      });
      setLoading(false);
    }
  };

  return (
    <Stack spacing={2}>
      <FormControl id="email">
        <FormLabel>
          Email <span style={{ color: 'red' }}>*</span>
        </FormLabel>
        <Input
          placeholder="Enter Your Email"
          value={email}
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl id="password">
        <FormLabel>
          Password <span style={{ color: 'red' }}>*</span>
        </FormLabel>
        <Input
          type={show ? 'text' : 'password'}
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton onClick={handleClick} sx={{ fontSize: '1rem' }} edge='end'>
                {show ? 'hide' : 'show'}
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>

      <Button
        sx={{ bgcolor: 'blue', color: 'white', width: '100%' }}
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        disabled={loading}
      >
        {loading ? 'Logging in...' : 'Login'}
      </Button>

      <Button
        sx={{ bgcolor: 'red', color: 'white', width: '100%' }}
        onClick={() => {
          setEmail('guest@example.com');
          setPassword('123456');
        }}
      >
        Get Guest User Credentials
      </Button>
    </Stack>
  );
};

export default Login;
