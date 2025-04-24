import React, { useEffect, useState } from 'react';
import { Container, Grid, Paper, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { calculateOverallAttendancePercentage } from '../../components/attendanceCalculator';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import { getSubjectList } from '../../redux/sclassRelated/sclassHandle';
import styled from 'styled-components';
import SeeNotice from '../../components/SeeNotice';
import CountUp from 'react-countup';
import Subject from "../../assets/subjects.svg";
import Assignment from "../../assets/assignment.svg";

const StudentHomePage = () => {
    const dispatch = useDispatch();
    const { userDetails, currentUser } = useSelector((state) => state.user);
    const { subjectsList } = useSelector((state) => state.sclass);

    const [subjectAttendance, setSubjectAttendance] = useState([]);
    const [cgpa, setCgpa] = useState(0);
    const [percentage, setPercentage] = useState(0);
    const [subjectMarks, setSubjectMarks] = useState([]);

    const classID = currentUser.sclassName._id;

    useEffect(() => {
        dispatch(getUserDetails(currentUser._id, "Student"));
        dispatch(getSubjectList(classID, "ClassSubjects"));
    }, [dispatch, currentUser._id, classID]);

    useEffect(() => {
        if (userDetails) {
            setSubjectAttendance(userDetails.attendance || []);
            setSubjectMarks(userDetails.examResult || []);
        }
    }, [userDetails]);

    useEffect(() => {
        if (subjectMarks.length > 0) {
            calculateResults();
        }
    }, [subjectMarks]);

    const calculateResults = () => {
        let totalMarks = 0;
        let maxPossibleMarks = 0;

        subjectMarks.forEach((subject) => {
            if (subject.marksObtained && subject.subName) {
                totalMarks += subject.marksObtained;
                maxPossibleMarks += 100; // Assuming each subject is out of 100
            }
        });

        const calculatedPercentage = maxPossibleMarks > 0 
            ? (totalMarks / maxPossibleMarks) * 100 
            : 0;
        
        const calculatedCgpa = calculatedPercentage / 9.5; // Standard CGPA calculation formula

        setPercentage(parseFloat(calculatedPercentage.toFixed(2)));
        setCgpa(parseFloat(calculatedCgpa.toFixed(2)));
    };

    const numberOfSubjects = subjectsList?.length || 0;
    const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);

    return (
        <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={3} lg={3}>
                    <StyledPaper>
                        <img src={Subject} alt="Subjects" style={styles.icon} />
                        <Title>Total Subjects</Title>
                        <Data start={0} end={numberOfSubjects} duration={2.5} />
                    </StyledPaper>
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                    <StyledPaper>
                        <img src={Assignment} alt="CGPA" style={styles.icon} />
                        <Title>CGPA</Title>
                        <Data start={0} end={cgpa} duration={4} decimals={2} />
                        <Typography variant="body2" sx={{ mt: -1 }}>
                            {getCGPAGrade(cgpa)}
                        </Typography>
                    </StyledPaper>
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                    <StyledPaper>
                        <img src={Assignment} alt="Percentage" style={styles.icon} />
                        <Title>Percentage</Title>
                        <Data start={0} end={percentage} duration={4} decimals={1} suffix="%" />
                        <Typography variant="body2" sx={{ mt: -1 }}>
                            {getPercentageGrade(percentage)}
                        </Typography>
                    </StyledPaper>
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                    <StyledPaper>
                        <img src={Assignment} alt="Attendance" style={styles.icon} />
                        <Title>Attendance</Title>
                        <Data start={0} end={overallAttendancePercentage} duration={4} decimals={1} suffix="%" />
                        <Typography variant="body2" sx={{ mt: -1 }}>
                            {overallAttendancePercentage >= 75 ? 'Good' : 'Needs Improvement'}
                        </Typography>
                    </StyledPaper>
                </Grid>
                <Grid item xs={12}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                        <SeeNotice />
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

const getCGPAGrade = (cgpa) => {
    if (cgpa >= 9) return 'Excellent (A+)';
    if (cgpa >= 8) return 'Very Good (A)';
    if (cgpa >= 7) return 'Good (B+)';
    if (cgpa >= 6) return 'Average (B)';
    if (cgpa >= 5) return 'Below Average (C)';
    return 'Needs Improvement';
};

const getPercentageGrade = (percentage) => {
    if (percentage >= 90) return 'Outstanding';
    if (percentage >= 80) return 'Excellent';
    if (percentage >= 70) return 'Very Good';
    if (percentage >= 60) return 'Good';
    if (percentage >= 50) return 'Average';
    if (percentage >= 40) return 'Below Average';
    return 'Fail';
};

const styles = {
    icon: {
        width: '50px',
        height: '50px',
        marginBottom: '10px'
    }
};

const StyledPaper = styled(Paper)`
  padding: 16px;
  display: flex;
  flex-direction: column;
  height: 200px;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  transition: transform 0.3s ease;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0,0,0,0.1);
  }
`;

const Title = styled.p`
  font-size: 1.25rem;
  margin-bottom: 8px;
  color: #333;
`;

const Data = styled(CountUp)`
  font-size: calc(1.3rem + .6vw);
  color: #2e7d32;
  font-weight: bold;
`;

export default StudentHomePage;