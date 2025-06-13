// import { useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { Button, Grid, Box, Typography, Paper, Checkbox, FormControlLabel, TextField, CssBaseline, IconButton, InputAdornment, CircularProgress, Backdrop } from '@mui/material';
// import { createTheme, ThemeProvider } from '@mui/material/styles';
// import { Visibility, VisibilityOff } from '@mui/icons-material';
// import bgpic from "../assets/designlogin.jpg"
// import { LightPurpleButton } from '../components/buttonStyles';
// import styled from 'styled-components';
// import { loginUser } from '../redux/userRelated/userHandle';
// import Popup from '../components/Popup';

// const defaultTheme = createTheme();

// const LoginPage = ({ role }) => {

//     const dispatch = useDispatch()
//     const navigate = useNavigate()

//     const { status, currentUser, response, error, currentRole } = useSelector(state => state.user);;

//     const [toggle, setToggle] = useState(false)
//     const [guestLoader, setGuestLoader] = useState(false)
//     const [loader, setLoader] = useState(false)
//     const [showPopup, setShowPopup] = useState(false);
//     const [message, setMessage] = useState("");

//     const [emailError, setEmailError] = useState(false);
//     const [passwordError, setPasswordError] = useState(false);
//     const [rollNumberError, setRollNumberError] = useState(false);
//     const [studentNameError, setStudentNameError] = useState(false);

//     const handleSubmit = (event) => {
//         event.preventDefault();

//         if (role === "Student") {
//             const rollNum = event.target.rollNumber.value;
//             const studentName = event.target.studentName.value;
//             const password = event.target.password.value;

//             if (!rollNum || !studentName || !password) {
//                 if (!rollNum) setRollNumberError(true);
//                 if (!studentName) setStudentNameError(true);
//                 if (!password) setPasswordError(true);
//                 return;
//             }
//             const fields = { rollNum, studentName, password }
//             setLoader(true)
//             dispatch(loginUser(fields, role))
//         }

//         else {
//             const email = event.target.email.value;
//             const password = event.target.password.value;

//             if (!email || !password) {
//                 if (!email) setEmailError(true);
//                 if (!password) setPasswordError(true);
//                 return;
//             }

//             const fields = { email, password }
//             setLoader(true)
//             dispatch(loginUser(fields, role))
//         }
//     };

//     const handleInputChange = (event) => {
//         const { name } = event.target;
//         if (name === 'email') setEmailError(false);
//         if (name === 'password') setPasswordError(false);
//         if (name === 'rollNumber') setRollNumberError(false);
//         if (name === 'studentName') setStudentNameError(false);
//     };

//     const guestModeHandler = () => {
//         const password = "zxc"

//         if (role === "Admin") {
//             const email = "yogendra@12"
//             const fields = { email, password }
//             setGuestLoader(true)
//             dispatch(loginUser(fields, role))
//         }
//         else if (role === "Student") {
//             const rollNum = "1"
//             const studentName = "Dipesh Awasthi"
//             const fields = { rollNum, studentName, password }
//             setGuestLoader(true)
//             dispatch(loginUser(fields, role))
//         }
//         else if (role === "Teacher") {
//             const email = "tony@12"
//             const fields = { email, password }
//             setGuestLoader(true)
//             dispatch(loginUser(fields, role))
//         }
//     }

//     useEffect(() => {
//         if (status === 'success' || currentUser !== null) {
//             if (currentRole === 'Admin') {
//                 navigate('/Admin/dashboard');
//             }
//             else if (currentRole === 'Student') {
//                 navigate('/Student/dashboard');
//             } else if (currentRole === 'Teacher') {
//                 navigate('/Teacher/dashboard');
//             }
//         }
//         else if (status === 'failed') {
//             setMessage(response)
//             setShowPopup(true)
//             setLoader(false)
//         }
//         else if (status === 'error') {
//             setMessage("Network Error")
//             setShowPopup(true)
//             setLoader(false)
//             setGuestLoader(false)
//         }
//     }, [status, currentRole, navigate, error, response, currentUser]);

//     return (
//         <ThemeProvider theme={defaultTheme}>
//             <Grid container component="main" sx={{ height: '100vh' }}>
//                 <CssBaseline />
//                 <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
//                     <Box
//                         sx={{
//                             my: 8,
//                             mx: 4,
//                             display: 'flex',
//                             flexDirection: 'column',
//                             alignItems: 'center',
//                         }}
//                     >
//                         <Typography variant="h4" sx={{ mb: 2, color: "#2c2143" }}>
//                             {role} Login
//                         </Typography>
//                         <Typography variant="h7">
//                             Welcome back! Please enter your details
//                         </Typography>
//                         <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }}>
//                             {role === "Student" ? (
//                                 <>
//                                     <TextField
//                                         margin="normal"
//                                         required
//                                         fullWidth
//                                         id="rollNumber"
//                                         label="Enter your Roll Number"
//                                         name="rollNumber"
//                                         autoComplete="off"
//                                         type="number"
//                                         autoFocus
//                                         error={rollNumberError}
//                                         helperText={rollNumberError && 'Roll Number is required'}
//                                         onChange={handleInputChange}
//                                     />
//                                     <TextField
//                                         margin="normal"
//                                         required
//                                         fullWidth
//                                         id="studentName"
//                                         label="Enter your name"
//                                         name="studentName"
//                                         autoComplete="name"
//                                         autoFocus
//                                         error={studentNameError}
//                                         helperText={studentNameError && 'Name is required'}
//                                         onChange={handleInputChange}
//                                     />
//                                 </>
//                             ) : (
//                                 <TextField
//                                     margin="normal"
//                                     required
//                                     fullWidth
//                                     id="email"
//                                     label="Enter your email"
//                                     name="email"
//                                     autoComplete="email"
//                                     autoFocus
//                                     error={emailError}
//                                     helperText={emailError && 'Email is required'}
//                                     onChange={handleInputChange}
//                                 />
//                             )}
//                             <TextField
//                                 margin="normal"
//                                 required
//                                 fullWidth
//                                 name="password"
//                                 label="Password"
//                                 type={toggle ? 'text' : 'password'}
//                                 id="password"
//                                 autoComplete="current-password"
//                                 error={passwordError}
//                                 helperText={passwordError && 'Password is required'}
//                                 onChange={handleInputChange}
//                                 InputProps={{
//                                     endAdornment: (
//                                         <InputAdornment position="end">
//                                             <IconButton onClick={() => setToggle(!toggle)}>
//                                                 {toggle ? (
//                                                     <Visibility />
//                                                 ) : (
//                                                     <VisibilityOff />
//                                                 )}
//                                             </IconButton>
//                                         </InputAdornment>
//                                     ),
//                                 }}
//                             />
//                             <Grid container sx={{ display: "flex", justifyContent: "space-between" }}>
//                                 <FormControlLabel
//                                     control={<Checkbox value="remember" color="primary" />}
//                                     label="Remember me"
//                                 />
//                                 <StyledLink href="#">
//                                     Forgot password?
//                                 </StyledLink>
//                             </Grid>
//                             <LightPurpleButton
//                                 type="submit"
//                                 fullWidth
//                                 variant="contained"
//                                 sx={{ mt: 3 }}
//                             >
//                                 {loader ?
//                                     <CircularProgress size={24} color="inherit" />
//                                     : "Login"}
//                             </LightPurpleButton>
//                             <Button
//                                 fullWidth
//                                 onClick={guestModeHandler}
//                                 variant="outlined"
//                                 sx={{ mt: 2, mb: 3, color: "#7f56da", borderColor: "#7f56da" }}
//                             >
//                                 Login as Guest
//                             </Button>
//                             {role === "Admin" &&
//                                 <Grid container>
//                                     <Grid>
//                                         Don't have an account?
//                                     </Grid>
//                                     <Grid item sx={{ ml: 2 }}>
//                                         <StyledLink to="/Adminregister">
//                                             Sign up
//                                         </StyledLink>
//                                     </Grid>
//                                 </Grid>
//                             }
//                         </Box>
//                     </Box>
//                 </Grid>
//                 <Grid
//                     item
//                     xs={false}
//                     sm={4}
//                     md={7}
//                     sx={{
//                         backgroundImage: `url(${bgpic})`,
//                         backgroundRepeat: 'no-repeat',
//                         backgroundColor: (t) =>
//                             t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
//                         backgroundSize: 'cover',
//                         backgroundPosition: 'center',
//                     }}
//                 />
//             </Grid>
//             <Backdrop
//                 sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
//                 open={guestLoader}
//             >
//                 <CircularProgress color="primary" />
//                 Please Wait
//             </Backdrop>
//             <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
//         </ThemeProvider>
//     );
// }

// export default LoginPage

// const StyledLink = styled(Link)`
//   margin-top: 9px;
//   text-decoration: none;
//   color: #7f56da;
// `;

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Button, Grid, Box, Typography, Paper, Checkbox, 
  FormControlLabel, TextField, CssBaseline, IconButton, 
  InputAdornment, CircularProgress, Backdrop, useMediaQuery 
} from '@mui/material';
import { createTheme, ThemeProvider, alpha } from '@mui/material/styles';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { LightPurpleButton } from '../components/buttonStyles';
import { loginUser } from '../redux/userRelated/userHandle';
import Popup from '../components/Popup';

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: '#7f56da',
    },
    secondary: {
      main: '#9c27b0',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
  },
});

const LoginPage = ({ role }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width:600px)');

    const { status, currentUser, response, error, currentRole } = useSelector(state => state.user);

    const [toggle, setToggle] = useState(false);
    const [loader, setLoader] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [rollNumberError, setRollNumberError] = useState(false);
    const [studentNameError, setStudentNameError] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();

        if (role === "Student") {
            const rollNum = event.target.rollNumber.value;
            const studentName = event.target.studentName.value;
            const password = event.target.password.value;

            if (!rollNum || !studentName || !password) {
                if (!rollNum) setRollNumberError(true);
                if (!studentName) setStudentNameError(true);
                if (!password) setPasswordError(true);
                return;
            }
            const fields = { rollNum, studentName, password }
            setLoader(true)
            dispatch(loginUser(fields, role))
        } else {
            const email = event.target.email.value;
            const password = event.target.password.value;

            if (!email || !password) {
                if (!email) setEmailError(true);
                if (!password) setPasswordError(true);
                return;
            }

            const fields = { email, password }
            setLoader(true)
            dispatch(loginUser(fields, role))
        }
    };

    const handleInputChange = (event) => {
        const { name } = event.target;
        if (name === 'email') setEmailError(false);
        if (name === 'password') setPasswordError(false);
        if (name === 'rollNumber') setRollNumberError(false);
        if (name === 'studentName') setStudentNameError(false);
    };

    useEffect(() => {
        if (status === 'success' || currentUser !== null) {
            if (currentRole === 'Admin') {
                navigate('/Admin/dashboard');
            }
            else if (currentRole === 'Student') {
                navigate('/Student/dashboard');
            } else if (currentRole === 'Teacher') {
                navigate('/Teacher/dashboard');
            }
        }
        else if (status === 'failed') {
            setMessage(response)
            setShowPopup(true)
            setLoader(false)
        }
        else if (status === 'error') {
            setMessage("Network Error")
            setShowPopup(true)
            setLoader(false)
        }
    }, [status, currentRole, navigate, error, response, currentUser]);

    return (
        <ThemeProvider theme={defaultTheme}>
            <CssBaseline />
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: `linear-gradient(135deg, ${alpha('#0f0c29', 0.9)}, ${alpha('#302b63', 0.9)})`,
                    p: isMobile ? 2 : 4,
                }}
            >
                <Paper
                    elevation={10}
                    sx={{
                        width: isMobile ? '100%' : '450px',
                        p: 4,
                        borderRadius: 4,
                        background: alpha('#ffffff', 0.15),
                        backdropFilter: 'blur(16px)',
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                        border: '1px solid rgba(255, 255, 255, 0.18)',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Typography variant="h4" sx={{ 
                            mb: 2, 
                            color: "white",
                            textShadow: '0 2px 10px rgba(0,0,0,0.2)'
                        }}>
                            {role} Login
                        </Typography>
                        <Typography variant="subtitle1" sx={{ 
                            color: alpha('#ffffff', 0.8),
                            mb: 4,
                            textAlign: 'center'
                        }}>
                            Welcome back! Please enter your details
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ width: '100%' }}>
                            {role === "Student" ? (
                                <>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="rollNumber"
                                        label="Enter your Roll Number"
                                        name="rollNumber"
                                        autoComplete="off"
                                        type="number"
                                        autoFocus
                                        error={rollNumberError}
                                        helperText={rollNumberError && 'Roll Number is required'}
                                        onChange={handleInputChange}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                color: 'white',
                                                '& fieldset': {
                                                    borderColor: alpha('#ffffff', 0.3),
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: alpha('#ffffff', 0.5),
                                                },
                                            },
                                            '& .MuiInputLabel-root': {
                                                color: alpha('#ffffff', 0.7),
                                            },
                                            '& .MuiFormHelperText-root': {
                                                color: alpha('#ff0000', 0.7),
                                            }
                                        }}
                                    />
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="studentName"
                                        label="Enter your name"
                                        name="studentName"
                                        autoComplete="name"
                                        error={studentNameError}
                                        helperText={studentNameError && 'Name is required'}
                                        onChange={handleInputChange}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                color: 'white',
                                                '& fieldset': {
                                                    borderColor: alpha('#ffffff', 0.3),
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: alpha('#ffffff', 0.5),
                                                },
                                            },
                                            '& .MuiInputLabel-root': {
                                                color: alpha('#ffffff', 0.7),
                                            },
                                            '& .MuiFormHelperText-root': {
                                                color: alpha('#ff0000', 0.7),
                                            }
                                        }}
                                    />
                                </>
                            ) : (
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Enter your email"
                                    name="email"
                                    autoComplete="email"
                                    autoFocus
                                    error={emailError}
                                    helperText={emailError && 'Email is required'}
                                    onChange={handleInputChange}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            color: 'white',
                                            '& fieldset': {
                                                borderColor: alpha('#ffffff', 0.3),
                                            },
                                            '&:hover fieldset': {
                                                borderColor: alpha('#ffffff', 0.5),
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: alpha('#ffffff', 0.7),
                                        },
                                        '& .MuiFormHelperText-root': {
                                            color: alpha('#ff0000', 0.7),
                                        }
                                    }}
                                />
                            )}
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type={toggle ? 'text' : 'password'}
                                id="password"
                                autoComplete="current-password"
                                error={passwordError}
                                helperText={passwordError && 'Password is required'}
                                onChange={handleInputChange}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton 
                                                onClick={() => setToggle(!toggle)}
                                                sx={{ color: alpha('#ffffff', 0.7) }}
                                            >
                                                {toggle ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        color: 'white',
                                        '& fieldset': {
                                            borderColor: alpha('#ffffff', 0.3),
                                        },
                                        '&:hover fieldset': {
                                            borderColor: alpha('#ffffff', 0.5),
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: alpha('#ffffff', 0.7),
                                    },
                                    '& .MuiFormHelperText-root': {
                                        color: alpha('#ff0000', 0.7),
                                    }
                                }}
                            />
                            <Grid container sx={{ 
                                display: "flex", 
                                justifyContent: "space-between",
                                alignItems: 'center',
                                mt: 1,
                                mb: 2
                            }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox 
                                            value="remember" 
                                            sx={{
                                                color: alpha('#ffffff', 0.7),
                                                '&.Mui-checked': {
                                                    color: '#7f56da',
                                                },
                                            }} 
                                        />
                                    }
                                    label={
                                        <Typography sx={{ color: alpha('#ffffff', 0.7) }}>
                                            Remember me
                                        </Typography>
                                    }
                                />
                                <Typography 
                                    component={Link}
                                    to="#"
                                    sx={{ 
                                        textDecoration: 'none',
                                        color: alpha('#7f56da', 0.8),
                                        '&:hover': {
                                            color: '#7f56da',
                                            textDecoration: 'underline'
                                        }
                                    }}
                                >
                                    Forgot password?
                                </Typography>
                            </Grid>
                            <LightPurpleButton
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ 
                                    mt: 2,
                                    mb: 3,
                                    height: 50,
                                    borderRadius: 2,
                                    fontSize: 16,
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    boxShadow: '0 4px 14px 0 rgba(127, 86, 218, 0.3)',
                                    '&:hover': {
                                        boxShadow: '0 6px 20px 0 rgba(127, 86, 218, 0.4)',
                                        transform: 'translateY(-1px)'
                                    }
                                }}
                            >
                                {loader ?
                                    <CircularProgress size={24} color="inherit" />
                                    : "Login"}
                            </LightPurpleButton>
                            {role === "Admin" &&
                                <Grid container justifyContent="center">
                                    <Typography sx={{ color: alpha('#ffffff', 0.7) }}>
                                        Don't have an account?
                                    </Typography>
                                    <Typography 
                                        component={Link} 
                                        to="/Adminregister"
                                        sx={{ 
                                            ml: 1,
                                            color: alpha('#7f56da', 0.8),
                                            fontWeight: 600,
                                            textDecoration: 'none',
                                            '&:hover': {
                                                color: '#7f56da',
                                                textDecoration: 'underline'
                                            }
                                        }}
                                    >
                                        Sign up
                                    </Typography>
                                </Grid>
                            }
                        </Box>
                    </Box>
                </Paper>
            </Box>
            <Backdrop
                sx={{ 
                    color: '#fff', 
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    backdropFilter: 'blur(8px)',
                    backgroundColor: alpha('#000000', 0.2)
                }}
                open={loader}
            >
                <Box textAlign="center">
                    <CircularProgress color="inherit" size={60} thickness={4} />
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        Authenticating...
                    </Typography>
                </Box>
            </Backdrop>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </ThemeProvider>
    );
}

export default LoginPage;