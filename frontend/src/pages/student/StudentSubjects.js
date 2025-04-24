import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSubjectList } from '../../redux/sclassRelated/sclassHandle';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
    BottomNavigation,
    BottomNavigationAction,
    Container,
    Paper,
    Table,
    TableBody,
    TableHead,
    Typography,
    Button,
    Grid,
} from '@mui/material';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import CustomBarChart from '../../components/CustomBarChart';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import TableChartIcon from '@mui/icons-material/TableChart';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import { StyledTableCell, StyledTableRow } from '../../components/styles';
import { calculateOverallAttendancePercentage } from '../../components/attendanceCalculator';

const StudentSubjects = () => {
    const dispatch = useDispatch();
    const { subjectsList, sclassDetails } = useSelector((state) => state.sclass);
    const { userDetails, currentUser, loading } = useSelector((state) => state.user);

    const [subjectMarks, setSubjectMarks] = useState([]);
    const [selectedSection, setSelectedSection] = useState('table');
    const [totalMarks, setTotalMarks] = useState(0);
    const [percentage, setPercentage] = useState(0);
    const [cgpa, setCgpa] = useState(0);
    const [, setAttendancePercentage] = useState(0);
    const [subjectAttendance, setSubjectAttendance] = useState([]);

    useEffect(() => {
        dispatch(getUserDetails(currentUser._id, 'Student'));
    }, [dispatch, currentUser._id]);

    useEffect(() => {
        if (userDetails) {
            setSubjectMarks(userDetails.examResult || []);
            setSubjectAttendance(userDetails.attendance || []);
            setAttendancePercentage(userDetails.attendancePercentage || 0);
        }
    }, [userDetails]);

    useEffect(() => {
        if (subjectMarks.length > 0) {
            calculateResults();
        }
    }, [subjectMarks]);

    useEffect(() => {
        if (subjectMarks.length === 0) {
            dispatch(getSubjectList(currentUser.sclassName._id, 'ClassSubjects'));
        }
    }, [subjectMarks, dispatch, currentUser.sclassName._id]);

    const calculateResults = () => {
        let total = 0;
        let maxMarks = 0;

        subjectMarks.forEach((result) => {
            if (result.marksObtained && result.subName) {
                total += result.marksObtained;
                maxMarks += 100; // Assuming each subject has a maximum of 100 marks
            }
        });

        setTotalMarks(total);

        const calculatedPercentage = maxMarks > 0 ? (total / maxMarks) * 100 : 0;
        setPercentage(calculatedPercentage.toFixed(2));

        const calculatedCgpa = calculatedPercentage / 9.5; // CGPA formula
        setCgpa(calculatedCgpa.toFixed(2));
    };

    const handleSectionChange = (_, newSection) => {
        setSelectedSection(newSection);
    };

    const sclassName = currentUser.sclassName;

    const renderTableSection = () => {
        const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);

        return (
            <>
                <Typography variant="h5" align="center" gutterBottom>
                    Subject Marks
                </Typography>
                <Table>
                    <TableHead>
                        <StyledTableRow>
                            <StyledTableCell>Subject</StyledTableCell>
                            <StyledTableCell>Marks</StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {subjectMarks.map((result, index) => {
                            if (!result.subName || !result.marksObtained) {
                                return null;
                            }
                            return (
                                <StyledTableRow key={index}>
                                    <StyledTableCell><strong>{result.subName.subName}</strong></StyledTableCell>
                                    <StyledTableCell><strong>{result.marksObtained}</strong></StyledTableCell>
                                </StyledTableRow>
                            );
                        })}
                        <StyledTableRow>
                            <StyledTableCell><strong>Total Marks</strong></StyledTableCell>
                            <StyledTableCell><strong>{totalMarks}</strong></StyledTableCell>
                        </StyledTableRow>
                        <StyledTableRow>
                            <StyledTableCell><strong>Percentage</strong></StyledTableCell>
                            <StyledTableCell><strong>{percentage}%</strong></StyledTableCell>
                        </StyledTableRow>
                        <StyledTableRow>
                            <StyledTableCell><strong>CGPA</strong></StyledTableCell>
                            <StyledTableCell><strong>{cgpa}</strong></StyledTableCell>
                        </StyledTableRow>
                        <StyledTableRow>
                            <StyledTableCell><strong>Attendance Percentage</strong></StyledTableCell>
                            <StyledTableCell><strong>{overallAttendancePercentage.toFixed(2)}%</strong></StyledTableCell>
                        </StyledTableRow>
                    </TableBody>
                </Table>
            </>
        );
    };

const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    const currentDate = new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });

    // Color Scheme
    const primaryColor = [41, 128, 185]; // Blue
    const successColor = [46, 204, 113]; // Green
    const dangerColor = [231, 76, 60];  // Red

    // 🏫 Institution Header
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryColor);
    doc.setFontSize(20);
    doc.text("N.R.A.M POLYTECHNIC,NITTE", pageWidth / 2, 20, { align: "center" });
    doc.text("OFFICIAL GRADE REPORT", pageWidth / 2, 45, { align: "center" });
    
    // Institution Details
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Affiliated to Department of Technical Education, Karnataka", pageWidth / 2, 52, { align: "center" });
    doc.text("AICTE Approved | NBA Accredited", pageWidth / 2, 58, { align: "center" });

     // Divider line
     doc.setDrawColor(...primaryColor);
     doc.setLineWidth(0.5);
     doc.line(20, 35, pageWidth - 20, 35);

    // 👨‍🎓 Student Information
    autoTable(doc, {
        startY: 65,
        head: [['STUDENT INFORMATION', '']],
        body: [
            ['Name', currentUser.name],
            ['Register Number', currentUser.rollNum],
            ['Branch/Department', sclassName.sclassName],
            ['Semester', currentUser.semester || "N/A"],
            ['Academic Year', '2023-2024'],
            ['Report Date', currentDate]
        ],
        theme: 'grid',
        headStyles: {
            fillColor: primaryColor,
            textColor: 255,
            fontSize: 12,
            halign: 'center'
        },
        bodyStyles: {
            textColor: [33, 33, 33],
            fontSize: 11,
            cellPadding: 4
        },
        columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 60 },
            1: { cellWidth: 'auto' }
        }
    });

    // 📊 Academic Performance Summary
    const overallResult = subjectMarks.every(result => result.marksObtained >= 40) ? 
        { content: 'PASS', styles: { textColor: successColor } } : 
        { content: 'FAIL', styles: { textColor: dangerColor } };
        const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);

    autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        head: [['ACADEMIC SUMMARY', '']],
        body: [
            ['Total Marks Obtained', totalMarks],
            ['Percentage', `${percentage}%`],
            ['CGPA', cgpa],
            ['Attendance Percentage', `${overallAttendancePercentage.toFixed(2)}%`],
            ['Overall Result', overallResult],
            ['Exam Eligibility', overallAttendancePercentage >= 70 ? 
                { content: 'ELIGIBLE', styles: { textColor: successColor } } : 
                { content: 'NOT ELIGIBLE', styles: { textColor: dangerColor } }]
        ],
        theme: 'grid',
        headStyles: {
            fillColor: primaryColor,
            textColor: 255,
            fontSize: 12,
            halign: 'center'
        },
        bodyStyles: {
            textColor: [33, 33, 33],
            fontSize: 11,
            cellPadding: 4
        },
        columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 80 },
            1: { cellWidth: 'auto' }
        }
    });

    // 📝 Subject-wise Marks
    const marksData = subjectMarks.map(result => [
        result.subName.subName,
        '100',
        result.marksObtained,
        { 
            content: result.marksObtained >= 40 ? 'PASS' : 'FAIL',
            styles: {
                textColor: result.marksObtained >= 40 ? successColor : dangerColor,
                fontStyle: 'bold'
            }
        },
        result.marksObtained >= 40 ? '✓' : '✗'
    ]);

    autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 15,
        head: [
            [
                'Subject', 
                'Max Marks', 
                'Marks Obtained', 
                'Result', 
                'Status'
            ]
        ],
        body: marksData,
        headStyles: {
            fillColor: [52, 152, 219], // Light blue
            textColor: 255,
            fontSize: 11,
            halign: 'center'
        },
        bodyStyles: {
            textColor: [33, 33, 33],
            fontSize: 10,
            cellPadding: 3,
            halign: 'center'
        },
        columnStyles: {
            0: { cellWidth: 60, halign: 'left' },  // Subject column left-aligned
            2: { fontStyle: 'bold' },  // Marks obtained bold
            3: { cellWidth: 30 }  // Result column narrower
        },
        alternateRowStyles: {
            fillColor: [245, 245, 245]
        },
        margin: { top: 10 },
        didDrawPage: function () {
           
            // Footer on each page
            doc.text(`Page ${doc.internal.getNumberOfPages()}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: "center" });
        }
    });

    // ℹ️ Grading Information
    autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        head: [['GRADING SYSTEM', 'Grade', 'CGPA', 'Percentage']],
        body: [
            ['Outstanding', 'A+', '10', '90-100%'],
            ['Excellent', 'A', '9', '80-89%'],
            ['Very Good', 'B+', '8', '70-79%'],
            ['Good', 'B', '7', '60-69%'],
            ['Average', 'C', '6', '50-59%'],
            ['Below Average', 'D', '5', '40-49%'],
            ['Fail', 'F', '0', 'Below 40%']
        ],
        headStyles: {
            fillColor: primaryColor,
            textColor: 255,
            fontSize: 11,
            halign: 'center'
        },
        bodyStyles: {
            textColor: [33, 33, 33],
            fontSize: 10,
            cellPadding: 3,
            halign: 'center'
        },
        columnStyles: {
            0: { halign: 'left', fontStyle: 'bold' }
        }
    });

    // 📌 Important Notes
    autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        body: [
            [
                { 
                    content: 'IMPORTANT NOTES:', 
                    styles: { 
                        fontStyle: 'bold', 
                        fontSize: 11,
                        textColor: dangerColor
                    } 
                }
            ],
            [
                '• Minimum 40% marks required in each subject to pass'
            ],
            [
                '• Minimum 70% attendance required to be eligible for exams'
            ],
            [
                '• This is an official computer-generated document'
            ],
            [
                '• Contact examination department for any discrepancies'
            ]
        ],
        theme: 'plain',
        bodyStyles: {
            textColor: [33, 33, 33],
            fontSize: 10,
            cellPadding: 2
        }
    });

    // 🏁 Footer
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text("This document is system generated and does not require signature", pageWidth / 2, doc.internal.pageSize.getHeight() - 15, { align: "center" });
    doc.text(`Report ID: ${currentUser.rollNum}-${Date.now().toString().slice(-6)}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: "center" });

    // 💾 Save PDF
    doc.save(`${currentUser.name}_MarkSheet.pdf`);
};
    const renderChartSection = () => {
        return <CustomBarChart chartData={subjectMarks} dataKey="marksObtained" />;
    };

    const renderClassDetailsSection = () => {
        return (
            <Container>
                <Typography variant="h4" align="center" gutterBottom>
                    Class Details
                </Typography>
                <Typography variant="h5" gutterBottom>
                    You are currently in Class {sclassDetails && sclassDetails.sclassName}
                </Typography>
                <Typography variant="h6" gutterBottom>
                    And these are the subjects:
                </Typography>
                {subjectsList &&
                    subjectsList.map((subject, index) => (
                        <div key={index}>
                            <Typography variant="subtitle1">
                                {subject.subName} ({subject.subCode})
                            </Typography>
                        </div>
                    ))}
            </Container>
        );
    };

    return (
        <>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div>
                    {subjectMarks && Array.isArray(subjectMarks) && subjectMarks.length > 0 ? (
                        <>
                            {selectedSection === 'table' && renderTableSection()}
                            {selectedSection === 'chart' && renderChartSection()}

                            <Grid container justifyContent="center" sx={{ marginTop: 2 }}>
                                <Button variant="contained" color="primary" onClick={generatePDF}>
                                    Download Mark Sheet
                                </Button>
                            </Grid>

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
                        renderClassDetailsSection()
                    )}
                </div>
            )}
        </>
    );
};

export default StudentSubjects;