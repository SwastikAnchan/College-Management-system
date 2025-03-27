import React, { useEffect, useState } from 'react';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { BottomNavigation, BottomNavigationAction, Box, Button, Collapse, Paper, Table, TableBody, TableHead, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import { calculateOverallAttendancePercentage, calculateSubjectAttendancePercentage, groupAttendanceBySubject } from '../../components/attendanceCalculator';
import CustomBarChart from '../../components/CustomBarChart';

import InsertChartIcon from '@mui/icons-material/InsertChart';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import TableChartIcon from '@mui/icons-material/TableChart';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import { StyledTableCell, StyledTableRow } from '../../components/styles';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ViewStdAttendance = () => {
    const dispatch = useDispatch();
    const [openStates, setOpenStates] = useState({});
    const [subjectAttendance, setSubjectAttendance] = useState([]);
    const [selectedSection, setSelectedSection] = useState('table');

    const { userDetails, currentUser, loading } = useSelector((state) => state.user);

    useEffect(() => {
        if (currentUser?._id) {
            dispatch(getUserDetails(currentUser._id, "Student"));
        }
    }, [dispatch, currentUser?._id]);

    useEffect(() => {
        if (userDetails) {
            setSubjectAttendance(userDetails.attendance || []);
        }
    }, [userDetails]);

    const attendanceBySubject = groupAttendanceBySubject(subjectAttendance);
    const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);

    const subjectData = Object.entries(attendanceBySubject).map(([subName, { present, sessions }]) => {
        const subjectAttendancePercentage = calculateSubjectAttendancePercentage(present, sessions);
        return {
            subject: subName,
            attendancePercentage: subjectAttendancePercentage,
            totalClasses: sessions,
            attendedClasses: present
        };
    });

    const handleOpen = (subId) => {
        setOpenStates((prevState) => ({
            ...prevState,
            [subId]: !prevState[subId],
        }));
    };

    const handleSectionChange = (event, newSection) => {
        setSelectedSection(newSection);
    };

    const sclassName = currentUser?.sclassName || "N/A";

    /** 📌 Function to Generate PDF Report */
    const generatePDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // 📌 Institution Header
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.text("N.R.A.M POLYTECHNIC, Nitte", pageWidth / 2, 20, { align: "center" });

        doc.setFontSize(14);
        doc.text("OFFICIAL ATTENDANCE REPORT", pageWidth / 2, 28, { align: "center" });

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("Affiliated to Department of Technical Education, Karnataka", pageWidth / 2, 35, { align: "center" });
        doc.text("Academic Year: 2023-2024", pageWidth / 2, 40, { align: "center" });

        // 📌 Student Information Table
        autoTable(doc, {
            startY: 45,
            theme: "grid",
            head: [['Student Details', '']],
            body: [
                ['Name of Student', `${currentUser?.name || "N/A"}`],
                ['Branch', `${sclassName.sclassName}`],
                ['Register Number', `${currentUser?.rollNum || "N/A"}`],
            ],
            styles: { fontSize: 12, cellPadding: 2, textColor: 0 },
            headStyles: { fillColor: [41, 128, 185], textColor: 255, fontSize: 12 },
            tableLineColor: [0, 0, 0],
            tableLineWidth: 0.1,
        });

        // 📌 Attendance Table Header
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("Subject-wise Attendance Details", 14, doc.lastAutoTable.finalY + 10);

        // 📌 Attendance Data Table
        const tableColumn = ["Subject", "Present", "Total Sessions", "Attendance %"];
        const tableRows = [];

        Object.entries(attendanceBySubject).forEach(([subName, { present, sessions }]) => {
            const attendancePercentage = calculateSubjectAttendancePercentage(present, sessions);
            tableRows.push([subName, present, sessions, `${attendancePercentage}%`]);
        });

        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 15,
            head: [tableColumn],
            body: tableRows,
            styles: { fontSize: 11, cellPadding: 3 },
            headStyles: { fillColor: [52, 152, 219], textColor: 255, fontSize: 11 },
            alternateRowStyles: { fillColor: [240, 240, 240] },
            margin: { top: 10 },
        });

        // 📌 Footer with Report Generation Date
        const currentDate = new Date().toLocaleDateString();
        doc.setFontSize(10);
        doc.text(`Report Generated on: ${currentDate}`, 14, doc.internal.pageSize.getHeight() - 10);

        // 📌 Save PDF
        doc.save(`Attendance_Report_${currentUser?.rollNum || "N/A"}.pdf`);
    };

    /** 📌 Table View */
    const renderTableSection = () => {
        return (
            <>
                <Typography variant="h4" align="center" gutterBottom>
                    Attendance
                </Typography>
                <Table>
                    <TableHead>
                        <StyledTableRow>
                            <StyledTableCell>Subject</StyledTableCell>
                            <StyledTableCell>Present</StyledTableCell>
                            <StyledTableCell>Total Sessions</StyledTableCell>
                            <StyledTableCell>Attendance Percentage</StyledTableCell>
                            <StyledTableCell align="center">Actions</StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    {Object.entries(attendanceBySubject).map(([subName, { present, allData, subId, sessions }], index) => {
                        const subjectAttendancePercentage = calculateSubjectAttendancePercentage(present, sessions);

                        return (
                            <TableBody key={index}>
                                <StyledTableRow>
                                    <StyledTableCell>{subName}</StyledTableCell>
                                    <StyledTableCell>{present}</StyledTableCell>
                                    <StyledTableCell>{sessions}</StyledTableCell>
                                    <StyledTableCell>{subjectAttendancePercentage}%</StyledTableCell>
                                    <StyledTableCell align="center">
                                        <Button variant="contained" onClick={() => handleOpen(subId)}>
                                            {openStates[subId] ? <KeyboardArrowUp /> : <KeyboardArrowDown />} Details
                                        </Button>
                                    </StyledTableCell>
                                </StyledTableRow>
                                <StyledTableRow>
                                    <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                        <Collapse in={openStates[subId]} timeout="auto" unmountOnExit>
                                            <Box sx={{ margin: 1 }}>
                                                <Typography variant="h6" gutterBottom component="div">
                                                    Attendance Details
                                                </Typography>
                                                <Table size="small" aria-label="purchases">
                                                    <TableHead>
                                                        <StyledTableRow>
                                                            <StyledTableCell>Date</StyledTableCell>
                                                            <StyledTableCell align="right">Status</StyledTableCell>
                                                        </StyledTableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {allData.map((data, index) => {
                                                            const date = new Date(data.date);
                                                            const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date";
                                                            return (
                                                                <StyledTableRow key={index}>
                                                                    <StyledTableCell component="th" scope="row">
                                                                        {dateString}
                                                                    </StyledTableCell>
                                                                    <StyledTableCell align="right">{data.status}</StyledTableCell>
                                                                </StyledTableRow>
                                                            );
                                                        })}
                                                    </TableBody>
                                                </Table>
                                            </Box>
                                        </Collapse>
                                    </StyledTableCell>
                                </StyledTableRow>
                            </TableBody>
                        );
                    })}
                </Table>
                <div>
                    <Typography variant="h6">
                        Overall Attendance Percentage: {overallAttendancePercentage.toFixed(2)}%
                    </Typography>
                </div>
            </>
        );
    };

    /** 📌 Chart View */
    const renderChartSection = () => {
        return <CustomBarChart chartData={subjectData} dataKey="attendancePercentage" />;
    };

    return (
        <>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div>
                    {subjectAttendance && Array.isArray(subjectAttendance) && subjectAttendance.length > 0 ? (
                        <>
                            {selectedSection === 'table' && renderTableSection()}
                            {selectedSection === 'chart' && renderChartSection()}

                            {/* 📌 PDF Download Button */}
                            <Button variant="contained" color="primary" onClick={generatePDF} style={{ margin: '20px' }}>
                                Download PDF
                            </Button>

                            {/* 📌 Bottom Navigation */}
                            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                                <BottomNavigation value={selectedSection} onChange={handleSectionChange} showLabels>
                                    <BottomNavigationAction
                                        label="Table"
                                        value="table"
                                        icon={selectedSection === 'table' ? <TableChartIcon /> : <TableChartOutlinedIcon />}
                                    />
                                    <BottomNavigationAction
                                        label="Chart"
                                        value="chart"
                                        icon={selectedSection === 'chart' ? <InsertChartIcon /> : <InsertChartOutlinedIcon />}
                                    />
                                </BottomNavigation>
                            </Paper>
                        </>
                    ) : (
                        <Typography variant="h6" gutterBottom>
                            Currently, You Have No Attendance Details
                        </Typography>
                    )}
                </div>
            )}
        </>
    );
};

export default ViewStdAttendance;
