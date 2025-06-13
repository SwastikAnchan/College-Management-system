// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   Grid,
//   Paper,
//   Box,
//   Container,
//   CircularProgress,
//   Backdrop,
// } from '@mui/material';
// import { AccountCircle, School, Group } from '@mui/icons-material';
// import styled from 'styled-components';
// import { useDispatch, useSelector } from 'react-redux';
// import { loginUser } from '../redux/userRelated/userHandle';
// import Popup from '../components/Popup';

// const ChooseUser = ({ visitor }) => {
//   const dispatch = useDispatch()
//   const navigate = useNavigate()
//   const password = "zxc"

//   const { status, currentUser, currentRole } = useSelector(state => state.user);;

//   const [loader, setLoader] = useState(false)
//   const [showPopup, setShowPopup] = useState(false);
//   const [message, setMessage] = useState("");

//   const navigateHandler = (user) => {
//     if (user === "Admin") {
//       if (visitor === "guest") {
//         const email = "yogendra@12"
//         const fields = { email, password }
//         setLoader(true)
//         dispatch(loginUser(fields, user))
//       }
//       else {
//         navigate('/Adminlogin');
//       }
//     }

//     else if (user === "Student") {
//       if (visitor === "guest") {
//         const rollNum = "1"
//         const studentName = "Dipesh Awasthi"
//         const fields = { rollNum, studentName, password }
//         setLoader(true)
//         dispatch(loginUser(fields, user))
//       }
//       else {
//         navigate('/Studentlogin');
//       }}

     
      
//       if (user === "Teacher") {
//       if (visitor === "guest") {
//         const email = "tony@12"
//         const fields = { email, password }
//         setLoader(true)
//         dispatch(loginUser(fields, user))
//       }
//       else {
//         navigate('/Teacherlogin');
//       }
//     }
//   }

//   useEffect(() => {
//     if (status === 'success' || currentUser !== null) {
//       if (currentRole === 'Admin') {
//         navigate('/Admin/dashboard');
//       }
//       else if (currentRole === 'Student') {
//         navigate('/Student/dashboard');
//       } else if (currentRole === 'Teacher') {
//         navigate('/Teacher/dashboard');
//       }
//     }
//     else if (status === 'error') {
//       setLoader(false)
//       setMessage("Network Error")
//       setShowPopup(true)
//     }
//   }, [status, currentRole, navigate, currentUser]);

//   return (
//     <StyledContainer>
//       <Container>
//         <Grid container spacing={2} justifyContent="center">
//           <Grid item xs={12} sm={6} md={4}>
//             <div onClick={() => navigateHandler("Admin")}>
//               <StyledPaper elevation={3}>
//                 <Box mb={2}>
//                   <AccountCircle fontSize="large" />
//                 </Box>
//                 <StyledTypography>
//                   Admin
//                 </StyledTypography>
//                 Login as an administrator to access the dashboard to manage app data.
//               </StyledPaper>
//             </div>
//           </Grid>
//           <Grid item xs={12} sm={6} md={4}>
//             <StyledPaper elevation={3}>
//               <div onClick={() => navigateHandler("Student")}>
//                 <Box mb={2}>
//                   <School fontSize="large" />
//                 </Box>
//                 <StyledTypography>
//                   Student
//                 </StyledTypography>
//                 Login as a student to explore course materials and assignments.
//               </div>
//             </StyledPaper>
//           </Grid>

        
//           <Grid item xs={12} sm={6} md={4}>
//             <StyledPaper elevation={3}>
//               <div onClick={() => navigateHandler("Teacher")}>
//                 <Box mb={2}>
//                   <Group fontSize="large" />
//                 </Box>
//                 <StyledTypography>
//                   Teacher
//                 </StyledTypography>
//                 Login as a teacher to  track student progress.
//               </div>
//             </StyledPaper>
//           </Grid>
//         </Grid>
//       </Container>
//       <Backdrop
//         sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
//         open={loader}
//       >
//         <CircularProgress color="inherit" />
//         Please Wait
//       </Backdrop>
//       <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
//     </StyledContainer>
//   );
// };

// export default ChooseUser;

// const StyledContainer = styled.div`
//   background: linear-gradient(to bottom,rgb(29, 23, 37),rgb(26, 21, 87));
//   height: 100vh;
//   display: flex;
//   justify-content: center;
//   padding: 2rem;
//   border-radius:10px;
// `;

// const StyledPaper = styled(Paper)`
//   padding: 20px;
//   text-align: center;
//   background-color: #1f1f38;
//   color:rgba(255, 255, 255, 0.6);
//   cursor:pointer;

//   &:hover {
//     background-color: #2c2c6c;
//     color:white;
//   }
// `;

// const StyledTypography = styled.h2`
//   margin-bottom: 10px;
// `;
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Paper,
  Box,
  Container,
  CircularProgress,
  Backdrop,
  Typography,
  useTheme,
  useMediaQuery,
  styled
} from '@mui/material';
import { AccountCircle, School, Groups } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/userRelated/userHandle';
import Popup from '../components/Popup';

const ChooseUser = ({ visitor }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const password = "zxc";
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { status, currentUser, currentRole } = useSelector(state => state.user);

  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [hoveredCard, setHoveredCard] = useState(null);

  const navigateHandler = (user) => {
    if (user === "Admin") {
      if (visitor === "guest") {
        const email = "yogendra@12";
        const fields = { email, password };
        setLoader(true);
        dispatch(loginUser(fields, user));
      } else {
        navigate('/Adminlogin');
      }
    } else if (user === "Student") {
      if (visitor === "guest") {
        const rollNum = "1";
        const studentName = "Dipesh Awasthi";
        const fields = { rollNum, studentName, password };
        setLoader(true);
        dispatch(loginUser(fields, user));
      } else {
        navigate('/Studentlogin');
      }
    } else if (user === "Teacher") {
      if (visitor === "guest") {
        const email = "tony@12";
        const fields = { email, password };
        setLoader(true);
        dispatch(loginUser(fields, user));
      } else {
        navigate('/Teacherlogin');
      }
    }
  };

  useEffect(() => {
    if (status === 'success' || currentUser !== null) {
      if (currentRole === 'Admin') {
        navigate('/Admin/dashboard');
      } else if (currentRole === 'Student') {
        navigate('/Student/dashboard');
      } else if (currentRole === 'Teacher') {
        navigate('/Teacher/dashboard');
      }
    } else if (status === 'error') {
      setLoader(false);
      setMessage("Network Error");
      setShowPopup(true);
    }
  }, [status, currentRole, navigate, currentUser]);

  const userTypes = [
    {
      id: 'Admin',
      icon: <AccountCircle fontSize="large" />,
      title: 'Admin',
      description: 'Login as an administrator to access the dashboard to manage app data.',
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      id: 'Student',
      icon: <School fontSize="large" />,
      title: 'Student',
      description: 'Login as a student to explore course materials and assignments.',
      color: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)'
    },
    {
      id: 'Teacher',
      icon: <Groups fontSize="large" />,
      title: 'Teacher',
      description: 'Login as a teacher to track student progress and manage classes.',
      color: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)'
    }
  ];

  return (
    <Container component="main" sx={{
      background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      py: 4,
      px: 2,
      alignItems: 'center'
    }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography 
          variant={isMobile ? 'h4' : 'h2'} 
          sx={{ 
            fontWeight: 700, 
            color: 'white',
            mb: 2,
            textShadow: '0 2px 10px rgba(0,0,0,0.2)'
          }}
        >
          Welcome to EduSphere
        </Typography>
        <Typography 
          variant={isMobile ? 'subtitle1' : 'h6'} 
          sx={{ color: 'rgba(255,255,255,0.8)' }}
        >
          Select your role to continue
        </Typography>
      </Box>

      <Container maxWidth="lg">
        <Grid container spacing={3} justifyContent="center">
          {userTypes.map((user) => (
            <Grid item xs={12} sm={6} md={4} key={user.id}>
              <Paper 
                elevation={hoveredCard === user.id ? 8 : 4}
                onClick={() => navigateHandler(user.id)}
                onMouseEnter={() => setHoveredCard(user.id)}
                onMouseLeave={() => setHoveredCard(null)}
                sx={{
                  background: hoveredCard === user.id ? user.color : '#1f1f38',
                  transform: hoveredCard === user.id ? 'translateY(-5px)' : 'none',
                  padding: '2rem 1.5rem',
                  textAlign: 'center',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  borderRadius: '16px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                  backdropFilter: 'blur(4px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)'
                  }
                }}
              >
                <Box sx={{
                  marginBottom: '1.5rem',
                  padding: '1rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {React.cloneElement(user.icon, {
                    sx: { 
                      fontSize: isMobile ? '3rem' : '4rem',
                      color: 'white'
                    }
                  })}
                </Box>
                <Typography variant="h5" sx={{
                  marginBottom: '1rem',
                  fontWeight: 600,
                  color: 'white'
                }}>
                  {user.title}
                </Typography>
                <Typography sx={{
                  marginBottom: '1.5rem',
                  color: 'rgba(255, 255, 255, 0.8)',
                  flexGrow: 1
                }}>
                  {user.description}
                </Typography>
                <Typography sx={{
                  color: 'white',
                  fontWeight: 500,
                  transition: 'all 0.3s ease',
                  opacity: 0.8,
                  '&:hover': {
                    opacity: 1,
                    transform: 'translateX(5px)'
                  }
                }}>
                  {visitor === "guest" ? "Try as guest" : "Login now"} →
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Backdrop
        sx={{ 
          color: '#fff', 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backdropFilter: 'blur(5px)'
        }}
        open={loader}
      >
        <Box textAlign="center">
          <CircularProgress color="inherit" size={60} thickness={4} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading your dashboard...
          </Typography>
        </Box>
      </Backdrop>
      
      <Popup 
        message={message} 
        setShowPopup={setShowPopup} 
        showPopup={showPopup} 
      />
    </Container>
  );
};

export default ChooseUser;