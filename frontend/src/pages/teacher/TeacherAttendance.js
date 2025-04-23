import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Button,
  Typography,
  Box
} from '@mui/material';
import AnnouncementOutlinedIcon from '@mui/icons-material/AnnouncementOutlined';

const TeacherAttendance = () => {
  const { classId } = useParams();
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    // Fetch students for this class
    const fetchStudents = async () => {
      const response = await fetch(`/api/classes/${classId}/students`);
      const data = await response.json();
      setStudents(data);
      
      // Initialize attendance status
      const initialAttendance = {};
      data.forEach(student => {
        initialAttendance[student._id] = 'present'; // default to present
      });
      setAttendance(initialAttendance);
    };
    
    fetchStudents();
  }, [classId]);

  const handleStatusChange = (studentId) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: prev[studentId] === 'present' ? 'absent' : 'present'
    }));
  };

  const submitAttendance = async () => {
    const attendanceData = {
      date: new Date(date),
      class: classId,
      students: Object.keys(attendance).map(studentId => ({
        student: studentId,
        status: attendance[studentId]
      }))
    };

    const response = await fetch('/api/attendance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(attendanceData)
    });

    if (response.ok) {
      alert('Attendance submitted successfully!');
    } else {
      alert('Error submitting attendance');
    }
  };

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Student Attendance</Typography>
        <input 
          type="date" 
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student Name</TableCell>
              <TableCell>Roll Number</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student._id}>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.rollNumber}</TableCell>
                <TableCell>
                  <Checkbox
                    checked={attendance[student._id] === 'present'}
                    onChange={() => handleStatusChange(student._id)}
                    color="primary"
                  />
                  {attendance[student._id] === 'present' ? 'Present' : 'Absent'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Button 
        variant="contained" 
        color="primary" 
        onClick={submitAttendance}
        sx={{ mt: 2 }}
      >
        Submit Attendance
      </Button>
      
      <Button 
        component={Link}
        to={`/Teacher/attendance/reports/${classId}`}
        variant="outlined"
        sx={{ mt: 2, ml: 2 }}
      >
        View Attendance Reports
      </Button>
    </div>
  );
};

export default TeacherAttendance;