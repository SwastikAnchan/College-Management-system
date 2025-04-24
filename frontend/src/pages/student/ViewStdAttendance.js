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

    const generatePDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const currentDate = new Date().toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    
        // 🎨 Colors
        const primaryColor = [41, 128, 185];
        const secondaryColor = [52, 152, 219];
        const successColor = [39, 174, 96];
        const accentColor = [231, 76, 60];
    
        // 📌 Header
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...primaryColor);
        doc.setFontSize(18);
        doc.text("N.R.A.M POLYTECHNIC", pageWidth / 2, 18, { align: "center" });
    
        doc.setFontSize(14);
        doc.text("STUDENT ATTENDANCE REPORT", pageWidth / 2, 30, { align: "center" });
    
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(100);
        doc.text("Affiliated to Department of Technical Education, Karnataka", pageWidth / 2, 36, { align: "center" });
        doc.text("AICTE Approved | NBA Accredited", pageWidth / 2, 41, { align: "center" });
    
        doc.setDrawColor(...primaryColor);
        doc.setLineWidth(0.5);
        doc.line(20, 45, pageWidth - 20, 45);
    
        // 📋 Student Info
        autoTable(doc, {
            startY: 50,
            head: [['STUDENT INFORMATION', '']],
            body: [
                ['Full Name', currentUser?.name || "N/A"],
                ['Register Number', currentUser?.rollNum || "N/A"],
                ['Branch/Department', sclassName?.sclassName || "N/A"],
                ['Academic Year', '2023-2024'],
                ['Report Date & Time', currentDate]
            ],
            theme: 'grid',
            headStyles: {
                fillColor: primaryColor,
                textColor: 255,
                fontSize: 11,
                halign: 'center'
            },
            bodyStyles: {
                textColor: [33, 33, 33],
                fontSize: 10,
                cellPadding: 3
            },
            columnStyles: {
                0: { fontStyle: 'bold', cellWidth: 60 },
                1: { cellWidth: 'auto' }
            },
            margin: { top: 5 }
        });
    
        // 📊 Summary
        const overallPercentage = calculateOverallAttendancePercentage(subjectAttendance);
        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 5,
            head: [['ATTENDANCE SUMMARY', '']],
            body: [
                ['Total Subjects', Object.keys(attendanceBySubject).length],
                ['Overall Attendance', `${overallPercentage.toFixed(1)}%`],
                ['Attendance Status', overallPercentage >= 75 ?
                    { content: 'Satisfactory', styles: { textColor: successColor } } :
                    { content: 'Needs Improvement', styles: { textColor: accentColor } }],
                ['Minimum Required', '75%']
            ],
            theme: 'grid',
            headStyles: {
                fillColor: primaryColor,
                textColor: 255,
                fontSize: 11,
                halign: 'center'
            },
            bodyStyles: {
                textColor: [33, 33, 33],
                fontSize: 10,
                cellPadding: 3
            },
            columnStyles: {
                0: { fontStyle: 'bold', cellWidth: 60 },
                1: { cellWidth: 'auto' }
            }
        });
    
        // 📚 Subject-wise Details
        const attendanceRows = Object.entries(attendanceBySubject).map(([subName, { present, sessions }]) => {
            const percentage = calculateSubjectAttendancePercentage(present, sessions);
            return [
                subName,
                present,
                sessions,
                {
                    content: `${percentage}%`,
                    styles: {
                        textColor: percentage >= 75 ? successColor : accentColor,
                        fontStyle: percentage >= 75 ? 'bold' : 'normal'
                    }
                },
                percentage >= 75 ? '✓' : '✗'
            ];
        });
    
        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 8,
            head: [['Subject', 'Present', 'Sessions', 'Attendance %', 'Status']],
            body: attendanceRows,
            headStyles: {
                fillColor: secondaryColor,
                textColor: 255,
                fontSize: 10,
                halign: 'center'
            },
            bodyStyles: {
                textColor: [33, 33, 33],
                fontSize: 9,
                cellPadding: 2.5,
                halign: 'center'
            },
            columnStyles: {
                0: { halign: 'left' },
                3: { fontStyle: 'bold' }
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245]
            },
            margin: { top: 5 },
            didDrawPage: function () {
                doc.setFontSize(8);
                doc.setTextColor(100);
                doc.text(`Page ${doc.internal.getNumberOfPages()}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: "center" });
            }
        });
    
        // 📌 Notes
        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 5,
            body: [
                [{ content: 'IMPORTANT NOTES:', styles: { fontStyle: 'bold', fontSize: 10, textColor: accentColor } }],
                ['• Minimum 75% attendance is required to appear for exams'],
                ['• This is an official computer-generated document'],
                ['• Contact your department for any discrepancies']
            ],
            theme: 'plain',
            bodyStyles: {
                textColor: [33, 33, 33],
                fontSize: 9,
                cellPadding: 2
            },
            margin: { top: 5 }
        });
    
        // 📄 Footer
        doc.setFontSize(7.5);
        doc.setTextColor(100);
        doc.text("This document is system generated and does not require signature", pageWidth / 2, doc.internal.pageSize.getHeight() - 15, { align: "center" });
        doc.text(`Report ID: ${currentUser?.rollNum || "N/A"}-${Date.now().toString().slice(-6)}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: "center" });
    
        // 💾 Save
        const fileName = `Attendance_Report_${currentUser?.rollNum || "Student"}_${currentDate.replace(/\//g, '-')}.pdf`;
        doc.save(fileName);
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
