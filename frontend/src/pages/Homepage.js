// import React from 'react';
// import { Link } from 'react-router-dom';
// import { Container, Grid, Box, Button } from '@mui/material';
// import styled from 'styled-components';
// import Students from "../assets/students.svg";
// import { LightPurpleButton } from '../components/buttonStyles';

// const Homepage = () => {
//     return (
//         <StyledContainer>
//             <Grid container spacing={0}>
//                 <Grid item xs={12} md={6}>
//                     <img src={Students} alt="students" style={{ width: '100%' }} />
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                     <StyledPaper elevation={3}>
//                         <StyledTitle>
//                             Welcome to
//                             <br />
//                            College Management
//                             <br />
//                             System
//                         </StyledTitle>
//                         <StyledText>
//                             Streamline College management, class organization, and add students and faculty.
//                             Seamlessly track attendance, assess performance, and provide feedback.
//                             Access records, view marks, and communicate effortlessly.
//                         </StyledText>
//                         <StyledBox>
//                             <StyledLink to="/choose">
//                                 <LightPurpleButton variant="contained" fullWidth>
//                                     Login
//                                 </LightPurpleButton>
//                             </StyledLink>
//                             <StyledLink to="/chooseasguest">
//                                 <Button variant="outlined" fullWidth
//                                     sx={{ mt: 2, mb: 3, color: "#7f56da", borderColor: "#7f56da" }}
//                                 >
//                                     Login as Guest
//                                 </Button>
//                             </StyledLink>
//                             <StyledText>
//                                 Don't have an account?{' '}
//                                 <Link to="/Adminregister" style={{color:"#550080"}}>
//                                     Sign up
//                                 </Link>
//                             </StyledText>
//                         </StyledBox>
//                     </StyledPaper>
//                 </Grid>
//             </Grid>
//         </StyledContainer>
//     );
// };

// export default Homepage;

// const StyledContainer = styled(Container)`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   height: 100vh;
// `;

// const StyledPaper = styled.div`
//   padding: 24px;
//   height: 100vh;
// `;

// const StyledBox = styled(Box)`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content:center;
//   gap: 16px;
//   padding: 24px;
// `;

// const StyledTitle = styled.h1`
//   font-size: 3rem;
//   color: #252525;
//   /* font-family: "Manrope"; */
//   font-weight: bold;
//   padding-top: 0;
//   letter-spacing: normal;
//   line-height: normal;
// `;

// const StyledText = styled.p`
//   /* color: #550080; */
//   margin-top: 30px;
//   margin-bottom: 30px; 
//   letter-spacing: normal;
//   line-height: normal;
// `;

// const StyledLink = styled(Link)`
//   text-decoration: none;
// `;


import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, Box, Button, useTheme, ThemeProvider as MuiThemeProvider } from '@mui/material';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Students from "../assets/students.svg";
import { LightPurpleButton } from '../components/buttonStyles';
import { ThemeProvider } from 'styled-components';

const Homepage = () => {
  const theme = useTheme(); // Material-UI theme

  return (
    <ThemeProvider theme={theme}> {/* Pass Material-UI theme to styled-components */}
      <StyledContainer>
        <BackgroundGradient />
        <GeometricPattern />
        
        <Grid container spacing={0} sx={{ position: 'relative', zIndex: 1 }}>
          <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center' }}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <FloatingImage src={Students} alt="students" />
            </motion.div>
          </Grid>
          
          <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center' }}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <GlassCard elevation={3}>
                <ContentWrapper>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <StyledTitle>
                      <GradientText>
                        Welcome to
                        <br />
                       Edu Sprint 
                        <br />
                       
                      </GradientText>
                    </StyledTitle>
                    
                    <StyledText>
                      Transformative education management platform with advanced analytics,
                      real-time collaboration, and intelligent resource optimization.
                    </StyledText>
                  </motion.div>

                  <ButtonGroup>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <StyledLink to="/choose">
                        <LightPurpleButton variant="contained" fullWidth>
                          University Login
                        </LightPurpleButton>
                      </StyledLink>
                    </motion.div>
                    
                    {/* <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <StyledLink to="/chooseasguest">
                        <GlassButton variant="outlined" fullWidth>
                          Guest Access
                        </GlassButton>
                      </StyledLink>
                    </motion.div> */}
                    
                    <CaptionText>
                      Register Admin?{' '}
                      <Link to="/Adminregister" style={{ fontWeight: 600 }}>
                        Request Access
                      </Link>
                    </CaptionText>
                  </ButtonGroup>
                </ContentWrapper>
              </GlassCard>
            </motion.div>
          </Grid>
        </Grid>
      </StyledContainer>
    </ThemeProvider>
  );
};

// Styled Components
const StyledContainer = styled(Container)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  padding: 2rem;
`;

const BackgroundGradient = styled.div`
  position: absolute;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    ${({ theme }) => theme.palette.primary.main} 0%,
    ${({ theme }) => theme.palette.secondary.main} 100%
  );
  transform: rotate(-15deg);
  top: -50%;
  left: -50%;
  opacity: 0.1;
`;

const GeometricPattern = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 10px,
    rgba(255,255,255,0.05) 10px,
    rgba(255,255,255,0.05) 20px
  );
`;

const FloatingImage = styled(motion.img)`
  width: 100%;
  max-width: 600px;
  filter: drop-shadow(0 10px 20px rgba(0,0,0,0.1));
  animation: float 6s ease-in-out infinite;
  
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
    100% { transform: translateY(0px); }
  }
`;

const GlassCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(31, 38, 135, 0.2);
  }
`;

const GradientText = styled.span`
  background: linear-gradient(45deg, ${({ theme }) => theme.palette.primary.main} 0%, #3f51b5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
  line-height: 1.2;
`;

const StyledTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  @media (min-width: 900px) {
    font-size: 3rem;
  }
`;

const StyledText = styled.p`
  color: #666;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  max-width: 500px;
`;

const GlassButton = styled(Button)`
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  backdrop-filter: blur(5px);
  color: ${({ theme }) => theme.palette.primary.main} !important;
  padding: 12px 24px !important;
  border-radius: 12px !important;
  transition: all 0.3s ease !important;

  &:hover {
    background: rgba(255, 255, 255, 0.2) !important;
    transform: translateY(-2px);
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
`;

const CaptionText = styled.p`
  color: #666;
  text-align: center;
  margin-top: 1rem;
  a {
    color: ${({ theme }) => theme.palette.primary.main};
    text-decoration: none;
    transition: all 0.3s ease;
    
    &:hover {
      color: ${({ theme }) => theme.palette.primary.dark};
    }
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  width: 100%;
`;

export default Homepage;