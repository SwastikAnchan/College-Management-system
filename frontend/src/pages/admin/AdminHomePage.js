import React from 'react';
import { 
    Container, Grid, Paper, Table, TableBody, TableCell, TableContainer, 
    TableHead, TableRow, Typography, CircularProgress, Box 
} from '@mui/material';
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

const AdminHomePage = () => {
    const dispatch = useDispatch();
    const { studentsList = [], loading: studentsLoading } = useSelector(state => state.student);
    const { sclassesList = [], loading: classesLoading } = useSelector(state => state.sclass);
    const { teachersList = [], loading: teachersLoading } = useSelector(state => state.teacher);
    const { currentUser } = useSelector(state => state.user);
    
    const adminID = currentUser?._id;
    const TOTAL_SESSIONS = 30; // Fixed total sessions as defined during class creation

    React.useEffect(() => {
        if (adminID) {
            dispatch(getAllStudents(adminID));
            dispatch(getAllSclasses(adminID, "Sclass"));
            dispatch(getAllTeachers(adminID));
        }
    }, [adminID, dispatch]);

    // Calculate attendance for each student using fixed total sessions
    const getStudentAttendanceData = (student) => {
        const attendanceRecords = student?.attendance || [];
        const presentSessions = attendanceRecords.filter(record => record.status === 'Present').length;
        
        const attendancePercentage = (presentSessions / TOTAL_SESSIONS) * 100;
            
        return {
            totalSessions: TOTAL_SESSIONS,
            presentSessions,
            attendancePercentage,
            isShortage: attendancePercentage < 75  // Flag to identify attendance shortage
        };
    };

    // Process all students and identify those with attendance shortage
    const processedStudents = studentsList.map(student => {
        const attendanceData = getStudentAttendanceData(student);
        return {
            ...student,
            ...attendanceData,
            className: student?.sclassName?.sclassName || 'N/A'
        };
    });

    // Filter students with attendance shortage (less than 75%)
    const attendanceShortageList = processedStudents.filter(student => student.isShortage);

    // School statistics
    const numberOfStudents = studentsList.length;
    const numberOfClasses = sclassesList.length;
    const numberOfTeachers = teachersList.length;

    // Calculate overall attendance percentage for all students
    const overallAttendanceData = processedStudents.reduce((acc, student) => {
        return {
            totalSessions: acc.totalSessions + student.totalSessions,
            presentSessions: acc.presentSessions + student.presentSessions
        };
    }, { totalSessions: 0, presentSessions: 0 });

    const overallAttendancePercentage = overallAttendanceData.totalSessions > 0
        ? (overallAttendanceData.presentSessions / overallAttendanceData.totalSessions) * 100
        : 0;

    if (studentsLoading || classesLoading || teachersLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress size={60} />
            </Box>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
                {/* Summary Cards */}
                <Grid item xs={12} md={3} lg={3}>
                    <StyledPaper elevation={3}>
                        <img src={Students} alt="Students" style={iconStyle} />
                        <Title>Total Students</Title>
                        <Data start={0} end={numberOfStudents} duration={2.5} />
                    </StyledPaper>
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                    <StyledPaper elevation={3}>
                        <img src={Classes} alt="Classes" style={iconStyle} />
                        <Title>Total Classes</Title>
                        <Data start={0} end={numberOfClasses} duration={2.5} />
                    </StyledPaper>
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                    <StyledPaper elevation={3}>
                        <img src={Teachers} alt="Teachers" style={iconStyle} />
                        <Title>Total Teachers</Title>
                        <Data start={0} end={numberOfTeachers} duration={2.5} />
                    </StyledPaper>
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                    <StyledPaper elevation={3}>
                        <img src={Analytics} alt="Overall Attendance" style={iconStyle} />
                        <Title>Overall Attendance</Title>
                        <Data start={0} end={overallAttendancePercentage} duration={2.5} suffix="%" />
                    </StyledPaper>
                </Grid>

                {/* Attendance Shortage Table */}
                <Grid item xs={12}>
                    <StyledPaper elevation={3}>
                        <Typography variant="h6" gutterBottom>
                            Attendance Shortage ({attendanceShortageList.length} students below 75%)
                        </Typography>
                        <TableContainer sx={{ maxHeight: 440 }}>
                            <Table stickyHeader size="small">
                                <TableHead>
                                    <StyledTableRow>
                                        <StyledTableCell>Student Name</StyledTableCell>
                                        <StyledTableCell>Roll Number</StyledTableCell>
                                        <StyledTableCell>Class</StyledTableCell>
                                        <StyledTableCell align="right">Present</StyledTableCell>
                                        <StyledTableCell align="right">Total Sessions</StyledTableCell>
                                        <StyledTableCell align="right">Attendance %</StyledTableCell>
                                    </StyledTableRow>
                                </TableHead>
                                <TableBody>
                                    {attendanceShortageList.length > 0 ? (
                                        attendanceShortageList.map((student) => (
                                            <StyledTableRow key={student._id} hover>
                                                <StyledTableCell>{student.name || 'N/A'}</StyledTableCell>
                                                <StyledTableCell>{student.rollNum || 'N/A'}</StyledTableCell>
                                                <StyledTableCell>{student.className}</StyledTableCell>
                                                <StyledTableCell align="right">{student.presentSessions}</StyledTableCell>
                                                <StyledTableCell align="right">{student.totalSessions}</StyledTableCell>
                                                <StyledTableCell 
                                                    align="right"
                                                    sx={{
                                                        color: student.attendancePercentage < 75 ? 'error.main' : 'inherit',
                                                        fontWeight: 'bold'
                                                    }}
                                                >
                                                    {student.attendancePercentage.toFixed(2)}%
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        ))
                                    ) : (
                                        <StyledTableRow>
                                            <StyledTableCell colSpan={6} align="center">
                                                No students with attendance shortage
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </StyledPaper>
                </Grid>

                {/* Notices Section */}
                <Grid item xs={12}>
                    <StyledPaper elevation={3}>
                        <SeeNotice />
                    </StyledPaper>
                </Grid>
            </Grid>
        </Container>
    );
};

// Styles remain the same as in your original code
// ... (iconStyle, StyledPaper, Title, Data, StyledTableRow, StyledTableCell)

// Styles
const iconStyle = {
    width: 60,
    height: 60,
    marginBottom: 10
};

const StyledPaper = styled(Paper)`
    padding: 24px;
    display: flex;
    flex-direction: column;
    height: 100%;
    transition: transform 0.3s ease;
    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 16px rgba(0,0,0,0.1);
    }
`;

const Title = styled(Typography)`
    font-size: 1rem;
    margin: 8px 0;
    font-weight: 500;
    color: #555;
`;

const Data = styled(CountUp)`
    font-size: 2rem;
    color: #1976d2;
    font-weight: bold;
    margin: 8px 0;
`;

const StyledTableRow = styled(TableRow)`
    &:nth-of-type(odd) {
        background-color: #f9f9f9;
    }
    &:hover {
        background-color: #f0f0f0;
    }
`;

const StyledTableCell = styled(TableCell)`
    padding: 12px;
`;

export default AdminHomePage;