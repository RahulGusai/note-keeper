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
import './newLoginPage.css';
import { useState } from 'react';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';
import { supabase } from './supabase/supabaseClient';
import { fetchUserNotes } from './utils';
import { ArrowBack, Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export function NewSignupPage(props) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const { setUserDetails, setNotes } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formNavigation, setFormNavigation] = useState({
    viewOne: true,
    viewTwo: false,
  });
  const [input, setInput] = useState({ fullName: '', email: '', password: '' });
  const [inputFieldError, setInputFieldError] = useState({
    fullName: false,
    email: false,
    password: false,
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [helperText, setHelperText] = useState({
    email: null,
  });
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

  function validateViewOneInputFields() {
    const isNameValid = input.fullName.length > 0;

    setInputFieldError((inputFieldError) => {
      return {
        ...inputFieldError,
        fullName: !isNameValid,
      };
    });

    if (!isNameValid) {
      throw 'Invalid input fields';
    }
  }

  function validateViewTwoInputFields() {
    const isEmailValid = input.email.length > 0 && emailRegex.test(input.email);
    const isPasswordValid = input.password.length > 0;

    setInputFieldError((inputFieldError) => {
      return {
        ...inputFieldError,
        email: !isEmailValid,
        password: !isPasswordValid,
      };
    });

    if (!isEmailValid) {
      if (input.email.length === 0) {
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

  async function handleContinueBtnClick(e) {
    e.preventDefault();

    if (formNavigation.viewOne) {
      try {
        validateViewOneInputFields();
      } catch (err) {
        setErrorMessage(null);
        return;
      }

      setFormNavigation((formNavigation) => {
        return {
          ...formNavigation,
          viewOne: false,
          viewTwo: true,
        };
      });
      return;
    }

    if (formNavigation.viewTwo) {
      try {
        validateViewTwoInputFields();
      } catch (err) {
        setErrorMessage(null);
        return;
      }

      setIsLoading(true);
      const user = await createNewUser();
      if (user) {
        const notes = await fetchUserNotes(user);
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
  }

  async function createNewUser() {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: input.email,
        password: input.password,
        options: {
          data: {
            full_name: input.fullName,
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
          <Stack alignItems={'center'} padding={'10px'} spacing={2}>
            <div className="divHeading">Create Your</div>
            <div className="divHeading">NoteKeeper Account</div>
          </Stack>

          {formNavigation.viewOne && (
            <TextField
              error={inputFieldError.fullName}
              fullWidth
              variant="outlined"
              label="FullName"
              color="primary"
              onChange={(e) =>
                setInput((input) => {
                  return { ...input, fullName: e.target.value };
                })
              }
              helperText="Name is required"
            ></TextField>
          )}

          {formNavigation.viewTwo && (
            <>
              <TextField
                error={inputFieldError.email}
                fullWidth
                variant="outlined"
                label="Email Address"
                color="primary"
                onChange={(e) =>
                  setInput((input) => {
                    return { ...input, email: e.target.value };
                  })
                }
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
                  onChange={(e) =>
                    setInput((input) => {
                      return { ...input, password: e.target.value };
                    })
                  }
                />
                <FormHelperText>Password is required</FormHelperText>
              </FormControl>
            </>
          )}

          <Button
            sx={{ fontSize: '15px' }}
            fullWidth
            variant="contained"
            color="secondary"
            size="large"
            onClick={handleContinueBtnClick}
          >
            {isLoading && <CircularProgress color="primary" />}
            {!isLoading && 'Continue'}
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
            Back to Login
          </Button>
        </Stack>
      </ThemeProvider>
    </Box>
  );
}
