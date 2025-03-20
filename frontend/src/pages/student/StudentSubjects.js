// import React, { useEffect, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux';
// import { getSubjectList } from '../../redux/sclassRelated/sclassHandle';
// import { BottomNavigation, BottomNavigationAction, Container, Paper, Table, TableBody, TableHead, Typography } from '@mui/material';
// import { getUserDetails } from '../../redux/userRelated/userHandle';
// import CustomBarChart from '../../components/CustomBarChart'

// import InsertChartIcon from '@mui/icons-material/InsertChart';
// import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
// import TableChartIcon from '@mui/icons-material/TableChart';
// import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
// import { StyledTableCell, StyledTableRow } from '../../components/styles';

// const StudentSubjects = () => {

//     const dispatch = useDispatch();
//     const { subjectsList, sclassDetails } = useSelector((state) => state.sclass);
//     const { userDetails, currentUser, loading, response, error } = useSelector((state) => state.user);

//     useEffect(() => {
//         dispatch(getUserDetails(currentUser._id, "Student"));
//     }, [dispatch, currentUser._id])

//     if (response) { console.log(response) }
//     else if (error) { console.log(error) }

//     const [subjectMarks, setSubjectMarks] = useState([]);
//     const [selectedSection, setSelectedSection] = useState('table');

//     useEffect(() => {
//         if (userDetails) {
//             setSubjectMarks(userDetails.examResult || []);
//         }
//     }, [userDetails])

//     useEffect(() => {
//         if (subjectMarks === []) {
//             dispatch(getSubjectList(currentUser.sclassName._id, "ClassSubjects"));
//         }
//     }, [subjectMarks, dispatch, currentUser.sclassName._id]);

//     const handleSectionChange = (event, newSection) => {
//         setSelectedSection(newSection);
//     };

//     const renderTableSection = () => {
//         return (
//             <>
//                 <Typography variant="h4" align="center" gutterBottom>
//                     Subject Marks
//                 </Typography>
//                 <Table>
//                     <TableHead>
//                         <StyledTableRow>
//                             <StyledTableCell>Subject</StyledTableCell>
//                             <StyledTableCell>Marks</StyledTableCell>
//                         </StyledTableRow>
//                     </TableHead>
//                     <TableBody>
//                         {subjectMarks.map((result, index) => {
//                             if (!result.subName || !result.marksObtained) {
//                                 return null;
//                             }
//                             return (
//                                 <StyledTableRow key={index}>
//                                     <StyledTableCell>{result.subName.subName}</StyledTableCell>
//                                     <StyledTableCell>{result.marksObtained}</StyledTableCell>
//                                 </StyledTableRow>
//                             );
//                         })}
//                     </TableBody>
//                 </Table>
//             </>
//         );
//     };

//     const renderChartSection = () => {
//         return <CustomBarChart chartData={subjectMarks} dataKey="marksObtained" />;
//     };

//     const renderClassDetailsSection = () => {
//         return (
//             <Container>
//                 <Typography variant="h4" align="center" gutterBottom>
//                     Class Details
//                 </Typography>
//                 <Typography variant="h5" gutterBottom>
//                     You are currently in Class {sclassDetails && sclassDetails.sclassName}
//                 </Typography>
//                 <Typography variant="h6" gutterBottom>
//                     And these are the subjects:
//                 </Typography>
//                 {subjectsList &&
//                     subjectsList.map((subject, index) => (
//                         <div key={index}>
//                             <Typography variant="subtitle1">
//                                 {subject.subName} ({subject.subCode})
//                             </Typography>
//                         </div>
//                     ))}
//             </Container>
//         );
//     };

//     return (
//         <>
//             {loading ? (
//                 <div>Loading...</div>
//             ) : (
//                 <div>
//                     {subjectMarks && Array.isArray(subjectMarks) && subjectMarks.length > 0
//                         ?
//                         (<>
//                             {selectedSection === 'table' && renderTableSection()}
//                             {selectedSection === 'chart' && renderChartSection()}

//                             <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
//                                 <BottomNavigation value={selectedSection} onChange={handleSectionChange} showLabels>
//                                     <BottomNavigationAction
//                                         label="Table"
//                                         value="table"
//                                         icon={selectedSection === 'table' ? <TableChartIcon /> : <TableChartOutlinedIcon />}
//                                     />
//                                     <BottomNavigationAction
//                                         label="Chart"
//                                         value="chart"
//                                         icon={selectedSection === 'chart' ? <InsertChartIcon /> : <InsertChartOutlinedIcon />}
//                                     />
//                                 </BottomNavigation>
//                             </Paper>
//                         </>)
//                         :
//                         (<>
//                             {renderClassDetailsSection()}
//                         </>)
//                     }
//                 </div>
//             )}
//         </>
//     );
// };

// export default StudentSubjects;

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
// import { jsPDF } from 'jspdf'; // For PDF generation
// import 'jspdf-autotable'; // For table support in PDF

import InsertChartIcon from '@mui/icons-material/InsertChart';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import TableChartIcon from '@mui/icons-material/TableChart';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import { StyledTableCell, StyledTableRow } from '../../components/styles';
import { calculateOverallAttendancePercentage, calculateSubjectAttendancePercentage, groupAttendanceBySubject } from '../../components/attendanceCalculator';

const StudentSubjects = () => {
    const dispatch = useDispatch();
    const { subjectsList, sclassDetails } = useSelector((state) => state.sclass);
    const { userDetails, currentUser, loading, response, error } = useSelector((state) => state.user);

    const [subjectMarks, setSubjectMarks] = useState([]);
    const [selectedSection, setSelectedSection] = useState('table');
    const [totalMarks, setTotalMarks] = useState(0);
    const [percentage, setPercentage] = useState(0);
    const [cgpa, setCgpa] = useState(0);
    const [attendancePercentage, setAttendancePercentage] = useState(0);
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

        const calculatedPercentage = (total / maxMarks) * 100;
        setPercentage(calculatedPercentage.toFixed(2));

        const calculatedCgpa = calculatedPercentage / 9.5; // CGPA formula
        setCgpa(calculatedCgpa.toFixed(2));
    };

    const handleSectionChange = (event, newSection) => {
        setSelectedSection(newSection);
    };
    const sclassName = currentUser.sclassName
    // const downloadPDF = () => {
    //     const doc = new jsPDF();
    //     doc.setFontSize(18);
    //     doc.text('Mark Sheet', 10, 10);

    //     // Add Student Details
    //     doc.setFontSize(12);
    //     doc.text(`Name: ${currentUser.name}`, 10, 20);
    //     doc.text(`Class: ${sclassDetails.sclassName}`, 10, 30);
    //     doc.text(`Attendance Percentage: ${attendancePercentage}%`, 10, 40);

    //     // Add Marks Table
    //     const tableData = subjectMarks.map((result) => [result.subName.subName, result.marksObtained]);
    //     doc.autoTable({
    //         head: [['Subject', 'Marks Obtained']],
    //         body: tableData,
    //         startY: 50,
    //     });

    //     // Add Total, Percentage, and CGPA
    //     doc.text(`Total Marks: ${totalMarks}`, 10, doc.lastAutoTable.finalY + 10);
    //     doc.text(`Percentage: ${percentage}%`, 10, doc.lastAutoTable.finalY + 20);
    //     doc.text(`CGPA: ${cgpa}`, 10, doc.lastAutoTable.finalY + 30);

    //     doc.save('mark_sheet.pdf');
    // };

        


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
        const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);
        // Header Section
        // Header Section with Institute Logo
        
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text("N.R.A.M POLYTECHNIC, Nitte", pageWidth / 2, 20, { align: "center" });
        doc.setFontSize(14);
        doc.text("OFFICIAL MARK SHEET", pageWidth / 2, 28, { align: "center" });
        doc.setFontSize(10);
        doc.text("Sessional 1", pageWidth / 2, 35, { align: "center" });
        // Institution Info
        doc.setFontSize(10)
        doc.setFont("helvetica", "normal");
        doc.text("Affiliated to Department of Technical Education, Karnataka", pageWidth / 2, 35, { align: "center" });
        doc.text("Academic Year: 2023-2024", pageWidth / 2, 40, { align: "center" });
    
        // Student Information Table
        autoTable(doc, {
            startY: 45,
            theme: "grid",
            head: [['Student Details', '']],
            body: [
                ['Name of Student', `${currentUser.name}`],
                ['Branch', `${sclassName.sclassName}`],
                ['Register Number', `${currentUser.rollNum}`]
            ],
            styles: { fontSize: 12, cellPadding: 1.5 },
            headStyles: { fillColor: [41, 128, 185], textColor: 255, fontSize: 12 },
            tableLineColor: [0, 0, 0],
            tableLineWidth: 0.1,
        });
    
        // Marks Table
        const tableData = subjectMarks.map((result) => [
            result.subName.subName,
            '100', // Assuming max marks is 100
            result.marksObtained,
            result.marksObtained >= 40 ? 'Pass' : 'Fail'
        ]);
    
        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 10,
            head: [['Subject', 'Max Marks', 'Marks Obtained', 'Result']],
            body: tableData,
            styles: { fontSize: 10, cellPadding: 2 },
            headStyles: { fillColor: [41, 128, 185], textColor: 255, fontSize: 12 }, // Blue color
            theme: "grid"
        });
    
        // Summary Table
        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 10,
            body: [
            ['Total Marks', totalMarks],
            ['Percentage', `${percentage}%`],
            ['CGPA', cgpa],
            ['Attendance Percentage', `${overallAttendancePercentage.toFixed(2)}%`],
            ['Overall Result', subjectMarks.length > 0 && subjectMarks.every(result => result.marksObtained >= 40) ? 'Pass' : 'Fail'],
            ['Eligibility', overallAttendancePercentage >= 70 ? 'Eligible' : 'Not Eligible']
            ],
            styles: { fontSize: 12, cellPadding: 2 },
            columnStyles: {
            0: { cellWidth: 80, fontStyle: 'bold' },
            1: { cellWidth: 80 }
            },
            theme: 'grid'
        });
    
        // Footer
        doc.setFontSize(10);
        doc.text("Note: This is an official computer-generated document, no signature required", pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: "center" });
    
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