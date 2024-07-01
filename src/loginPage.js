import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  TextField,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import './loginPage.css';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useRef, useState } from 'react';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { supabase } from './supabase/supabaseClient';
import { fetchUserNotes, signInWithGoogle } from './utils';
import { useNavigate } from 'react-router-dom';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function LoginPage(props) {
  const { setUserDetails, setNotes } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inputFieldError, setInputFieldError] = useState({
    email: false,
    password: false,
  });
  const [helperText, setHelperText] = useState({
    email: null,
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const customTheme = createTheme({
    palette: {
      primary: {
        main: '#686868',
      },
      secondary: { main: '#14549c' },
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            '--TextField-brandBorderColor': '#ffffff',
            '--TextField-brandBorderHoverColor': '#ffffff',
            '--TextField-brandBorderFocusedColor': '#14549c',
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            color: 'white',
            [`& .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: '#686868',
            },
            [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: '#686868',
            },
            [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: '#14549c',
            },
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: '#686868',
            '&.Mui-focused': {
              color: '#14549c',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 'normal',
          },
        },
      },
    },
  });

  async function signInUser() {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        throw error;
      }
      const { user } = data;
      return user;
    } catch (error) {
      setErrorMessage(error.message);
      return null;
    }
  }

  function validateInputFields() {
    const isPasswordValid = password.length > 0;
    const isEmailValid = email.length > 0 && emailRegex.test(email);

    setInputFieldError((inputFieldError) => {
      return {
        ...inputFieldError,
        email: !isEmailValid,
        password: !isPasswordValid,
      };
    });

    if (!isEmailValid) {
      if (email.length === 0) {
        setHelperText((helperText) => {
          return {
            ...helperText,
            email: 'Email address is required',
          };
        });
      } else {
        setHelperText((helperText) => {
          return {
            ...helperText,
            email: 'Please enter a valid email address',
          };
        });
      }
    }

    if (!isEmailValid || !isPasswordValid) {
      throw 'Invalid input fields';
    }
  }

  async function handleContinueBtnClick() {
    try {
      validateInputFields();
    } catch (err) {
      setErrorMessage(null);
      return;
    }

    setIsLoading(true);
    const user = await signInUser();
    const notes = await fetchUserNotes(user);
    if (user && notes) {
      setUserDetails({
        id: user.id,
        fullName: user.user_metadata.full_name,
        isAnonymous: user.is_anonymous,
      });
      setNotes(notes);
      setErrorMessage(null);
    }
    setIsLoading(false);
  }

  return (
    <Box
      width={'100%'}
      height={'100vh'}
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
      backgroundColor={'#0a0a0a'}
      position={'relative'}
    >
      <ThemeProvider theme={customTheme}>
        <Stack
          width={'20%'}
          minWidth={'300px'}
          maxWidth={'350px'}
          alignItems={'center'}
          marginBottom={'10%'}
          spacing={2}
        >
          <h2 className="formHeading">Log in To NoteKeeper</h2>
          <TextField
            error={inputFieldError.email}
            fullWidth
            variant="outlined"
            label="Email Address"
            color="primary"
            onChange={(e) => setEmail(e.target.value)}
            helperText={helperText.email}
          ></TextField>
          <FormControl
            error={inputFieldError.password}
            fullWidth
            variant="outlined"
          >
            <InputLabel htmlFor="standard-adornment-password">
              Password
            </InputLabel>
            <OutlinedInput
              id="standard-adornment-password"
              type={showPassword ? 'text' : 'password'}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    color="primary"
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormHelperText>Password is required</FormHelperText>
          </FormControl>
          <Button
            sx={{ fontSize: '15px' }}
            fullWidth
            variant="contained"
            color="secondary"
            size="large"
            onClick={handleContinueBtnClick}
          >
            {isLoading && <CircularProgress color="primary" />}
            {!isLoading && 'Sign In'}
          </Button>
          {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}

          <h4>Or</h4>
          <Button
            sx={{ fontSize: '15px' }}
            fullWidth
            variant="contained"
            color="secondary"
            size="large"
            onClick={signInWithGoogle}
          >
            Continue with Google
          </Button>
          <Button
            sx={{ fontSize: '13px' }}
            color="secondary"
            size="small"
            endIcon={<ArrowForwardIcon></ArrowForwardIcon>}
            onClick={() => {
              navigate('./guest');
            }}
          >
            Create a guest account
          </Button>
        </Stack>

        <div className="bottomMenu">
          <Button
            onClick={() => navigate('/signup')}
            sx={{ fontSize: '16px' }}
            color="secondary"
          >
            Don't have an account? Sign Up
          </Button>
        </div>
      </ThemeProvider>
    </Box>
  );
}
