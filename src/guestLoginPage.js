import {
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import './loginPage.css';
import { useState } from 'react';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';
import { supabase } from './supabase/supabaseClient';
import { fetchUserNotes } from './utils';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export function GuestLoginPage(props) {
  const { setUserDetails, setNotes } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [inputFieldError, setInputFieldError] = useState({
    name: false,
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

  async function createAnonymousUser() {
    try {
      const { data, error } = await supabase.auth.signInAnonymously({
        options: {
          data: {
            full_name: name,
          },
        },
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
    const isNameValid = name.length > 0;

    setInputFieldError((inputFieldError) => {
      return {
        ...inputFieldError,
        name: !isNameValid,
      };
    });

    if (!isNameValid) {
      throw 'Invalid input fields';
    }
  }

  async function handleLoginBtnClick() {
    try {
      validateInputFields();
    } catch (err) {
      setErrorMessage(null);
      return;
    }

    setIsLoading(true);
    const user = await createAnonymousUser();
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
          <h2 className="formHeading">Create Your Guest Account</h2>

          <TextField
            error={inputFieldError.name}
            fullWidth
            variant="outlined"
            label="Name"
            color="primary"
            onChange={(e) => setName(e.target.value)}
            helperText="Name is required"
          ></TextField>

          <Button
            sx={{ fontSize: '15px' }}
            fullWidth
            variant="contained"
            color="secondary"
            size="large"
            onClick={handleLoginBtnClick}
          >
            {isLoading && <CircularProgress color="primary" />}
            {!isLoading && 'Login'}
          </Button>

          {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}

          <Button
            sx={{ fontSize: '13px' }}
            color="secondary"
            size="small"
            startIcon={<ArrowBack></ArrowBack>}
            onClick={() => {
              navigate('/');
            }}
          >
            Other Login options
          </Button>
        </Stack>

        <div className="bottomMenu">
          <Button
            sx={{ fontSize: '16px' }}
            color="secondary"
            onClick={() => navigate('/signup')}
          >
            Don't have an account? Sign Up
          </Button>
        </div>
      </ThemeProvider>
    </Box>
  );
}
