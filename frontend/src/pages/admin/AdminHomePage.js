import React, { useEffect, useState } from 'react';
import { Container, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import SeeNotice from '../../components/SeeNotice';
import Students from "../../assets/img1.png";
import Classes from "../../assets/img2.png";
import Teachers from "../../assets/img3.png";
import Analytics from "../../assets/img4.png";
import styled from 'styled-components';
import CountUp from 'react-countup';
import { useDispatch, useSelector } from 'react-redux';
import { getAllSclasses } from '../../redux/sclassRelated/sclassHandle';
import { getAllStudents } from '../../redux/studentRelated/studentHandle';
import { getAllTeachers } from '../../redux/teacherRelated/teacherHandle';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { calculateOverallAttendancePercentage } from '../../components/attendanceCalculator';

const AdminHomePage = () => {
    const dispatch = useDispatch();
    const { studentsList } = useSelector((state) => state.student);
    const { sclassesList } = useSelector((state) => state.sclass);
    const { teachersList } = useSelector((state) => state.teacher);
    const { currentUser } = useSelector(state => state.user);
    const adminID = currentUser._id;

    useEffect(() => {
        dispatch(getAllStudents(adminID));
        dispatch(getAllSclasses(adminID, "Sclass"));
        dispatch(getAllTeachers(adminID));
    }, [adminID, dispatch]);

    // Calculate Analytics
    const numberOfStudents = studentsList?.length || 0;
    const numberOfClasses = sclassesList?.length || 0;
    const numberOfTeachers = teachersList?.length || 0;

    

    // Calculate pass percentage
    const passPercentage = studentsList && studentsList.length > 0 
        ? (studentsList.filter(student => student.result?.overallStatus === 'pass').length / numberOfStudents * 100)
        : 0;

    // Get students with low attendance (<75%)
    const attendanceShortageList = studentsList?.filter(student => {
        if (!student.attendance) return false;
        const presentDays = student.attendance.presentDays || 0;
        const totalDays = student.attendance.totalDays || 1; // Avoid division by zero
        return (presentDays / totalDays) * 100 < 75;
    }) || [];

    // Calculate overall attendance percentage
    const overallAttendancePercentage = calculateOverallAttendancePercentage(
        studentsList.flatMap(student => student.attendance?.records || [])
    );

    // Mock performance data (replace with real data)
    const performanceData = [
        { month: 'Jan', passPercentage: 75 },
        { month: 'Feb', passPercentage: 82 },
        { month: 'Mar', passPercentage: 78 },
        { month: 'Apr', passPercentage: 85 },
        { month: 'May', passPercentage: 88 },
    ];

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={3} lg={3}>
                    <StyledPaper>
                        <img src={Students} alt="Students" style={{ width: 60, height: 60 }} />
                        <Title>Total Students</Title>
                        <Data start={0} end={numberOfStudents} duration={2.5} />
                    </StyledPaper>
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                    <StyledPaper>
                        <img src={Classes} alt="Classes" style={{ width: 60, height: 60 }} />
                        <Title>Total Classes</Title>
                        <Data start={0} end={numberOfClasses} duration={5} />
                    </StyledPaper>
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                    <StyledPaper>
                        <img src={Teachers} alt="Teachers" style={{ width: 60, height: 60 }} />
                        <Title>Total Teachers</Title>
                        <Data start={0} end={numberOfTeachers} duration={2.5} />
                    </StyledPaper>
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                    <StyledPaper>
                        <img src={Analytics} alt="Analytics" style={{ width: 60, height: 60 }} />
                        <Title>Pass Percentage</Title>
                        <Data start={0} end={passPercentage} duration={2.5} suffix="%" decimals={1} />
                    </StyledPaper>
                </Grid>

                {/* Performance Chart */}
                <Grid item xs={12} md={6} lg={6}>
                    <Paper sx={{ p: 2, height: 300 }}>
                        <Typography variant="h6" gutterBottom>
                            Monthly Performance Trend
                        </Typography>
                        <ResponsiveContainer width="100%" height="80%">
                            <LineChart data={performanceData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="passPercentage" stroke="#8884d8" />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Attendance Shortage List */}
                <Grid item xs={12} md={6} lg={6}>
                    <Paper sx={{ p: 2, height: 300, overflow: 'auto' }}>
                        <Typography variant="h6" gutterBottom>
                            Attendance Shortage ({attendanceShortageList.length})
                        </Typography>
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Student Name</TableCell>
                                        <TableCell>Class</TableCell>
                                        <TableCell align="right">Attendance %</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {attendanceShortageList.map((student) => {
                                        const presentDays = student.attendance?.presentDays || 0;
                                        const totalDays = student.attendance?.totalDays || 1;
                                        const attendancePercentage = (presentDays / totalDays) * 100;

                                        return (
                                            <TableRow key={student._id}>
                                                <TableCell>{student.name}</TableCell>
                                                <TableCell>{student.sclassName?.className }</TableCell>
                                                <TableCell align="right">
                                                    {overallAttendancePercentage.toFixed(1)}%
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={12} lg={12}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                        <SeeNotice />
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

const StyledPaper = styled(Paper)`
  padding: 16px;
  display: flex;
  flex-direction: column;
  height: 200px;
  justify-content: space-between;
  align-items: center;
  text-align: center;
`;

const Title = styled.p`
  font-size: 1rem;
  margin: 8px 0;
`;

const Data = styled(CountUp)`
  font-size: 1.5rem;
  color: #1976d2;
  font-weight: bold;
`;

export default AdminHomePage;