import {
  Box,
  Button,
  FormControl,
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
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useState } from 'react';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';

export function NewLoginPage() {
  const [showPassword, setShowPassword] = useState(true);

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
    },
  });

  return (
    <Box
      width={'100%'}
      height={'100vh'}
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
      backgroundColor={'black'}
    >
      <ThemeProvider theme={customTheme}>
        <Stack
          width={'20%'}
          alignItems={'center'}
          marginBottom={'10%'}
          spacing={3}
        >
          <h2 className="formHeading">Log in To NoteKeeper</h2>

          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="standard-adornment-password">
              Email Address
            </InputLabel>
            <OutlinedInput
              id="standard-adornment-password"
              type={showPassword ? 'text' : 'password'}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    color="white"
                    aria-label="toggle password visibility"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Email Address"
            />
          </FormControl>

          <FormControl fullWidth variant="outlined">
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
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>
          <h4>Or</h4>
          <Button fullWidth variant="outlined" color="secondary" size="large">
            Continue with Google
          </Button>
        </Stack>
      </ThemeProvider>
    </Box>
  );
}
