// server.js - MongoDB Backend for Student Management System

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/studentManagementSystem', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Define Schemas
const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    course: { type: String, required: true },
    status: { type: String, required: true, enum: ['active', 'inactive'] },
    notes: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

const courseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true },
    category: { type: String, required: true, enum: ['programming', 'design', 'business'] },
    instructor: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, required: true, enum: ['upcoming', 'active', 'completed'] },
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

const gradeSchema = new mongoose.Schema({
    student: { type: String, required: true },
    course: { type: String, required: true },
    assignment: { type: String, required: true },
    grade: { type: Number, required: true, min: 0, max: 100 },
    date: { type: Date, required: true },
    comments: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

const attendanceSchema = new mongoose.Schema({
    student: { type: String, required: true },
    course: { type: String, required: true },
    status: { type: String, required: true, enum: ['present', 'absent', 'late'] },
    checkInTime: { type: String },
    date: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

const activitySchema = new mongoose.Schema({
    action: { type: String, required: true },
    details: { type: String, required: true },
    time: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

// Create models
const Student = mongoose.model('Student', studentSchema);
const Course = mongoose.model('Course', courseSchema);
const Grade = mongoose.model('Grade', gradeSchema);
const Attendance = mongoose.model('Attendance', attendanceSchema);
const Activity = mongoose.model('Activity', activitySchema);

// Routes - Students
app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/students/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.json(student);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/students', async (req, res) => {
    try {
        const newStudent = new Student(req.body);
        const savedStudent = await newStudent.save();
        
        // Create activity
        const activity = new Activity({
            action: 'New student enrolled',
            details: `${req.body.name} joined ${req.body.course}`,
            time: new Date().toISOString().replace('T', ' ').substring(0, 16)
        });
        await activity.save();
        
        res.status(201).json(savedStudent);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.put('/api/students/:id', async (req, res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id, 
            { ...req.body, updatedAt: Date.now() }, 
            { new: true }
        );
        
        if (!updatedStudent) {
            return res.status(404).json({ error: 'Student not found' });
        }
        
        // Create activity
        const activity = new Activity({
            action: 'Student updated',
            details: `${updatedStudent.name}'s information was updated`,
            time: new Date().toISOString().replace('T', ' ').substring(0, 16)
        });
        await activity.save();
        
        res.json(updatedStudent);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/api/students/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        
        const studentName = student.name;
        await Student.findByIdAndDelete(req.params.id);
        
        // Create activity
        const activity = new Activity({
            action: 'Student removed',
            details: `${studentName} was removed from the system`,
            time: new Date().toISOString().replace('T', ' ').substring(0, 16)
        });
        await activity.save();
        
        res.json({ message: 'Student deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Routes - Courses
app.get('/api/courses', async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/courses/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        res.json(course);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/courses', async (req, res) => {
    try {
        // Convert string dates to Date objects
        const courseData = {
            ...req.body,
            startDate: new Date(req.body.startDate),
            endDate: new Date(req.body.endDate)
        };
        
        const newCourse = new Course(courseData);
        const savedCourse = await newCourse.save();
        
        // Create activity
        const activity = new Activity({
            action: 'New course added',
            details: `${req.body.name} (${req.body.code}) was added`,
            time: new Date().toISOString().replace('T', ' ').substring(0, 16)
        });
        await activity.save();
        
        res.status(201).json(savedCourse);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.put('/api/courses/:id', async (req, res) => {
    try {
        // Convert string dates to Date objects
        const courseData = {
            ...req.body,
            startDate: new Date(req.body.startDate),
            endDate: new Date(req.body.endDate),
            updatedAt: Date.now()
        };
        
        const updatedCourse = await Course.findByIdAndUpdate(
            req.params.id, 
            courseData, 
            { new: true }
        );
        
        if (!updatedCourse) {
            return res.status(404).json({ error: 'Course not found' });
        }
        
        // Create activity
        const activity = new Activity({
            action: 'Course updated',
            details: `${updatedCourse.name} (${updatedCourse.code}) was updated`,
            time: new Date().toISOString().replace('T', ' ').substring(0, 16)
        });
        await activity.save();
        
        res.json(updatedCourse);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/api/courses/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        
        const courseName = course.name;
        await Course.findByIdAndDelete(req.params.id);
        
        // Create activity
        const activity = new Activity({
            action: 'Course removed',
            details: `${courseName} was removed from the system`,
            time: new Date().toISOString().replace('T', ' ').substring(0, 16)
        });
        await activity.save();
        
        res.json({ message: 'Course deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Routes - Grades
app.get('/api/grades', async (req, res) => {
    try {
        const grades = await Grade.find();
        res.json(grades);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/grades', async (req, res) => {
    try {
        const gradeData = {
            ...req.body,
            date: new Date(req.body.date)
        };
        
        const newGrade = new Grade(gradeData);
        const savedGrade = await newGrade.save();
        
        // Create activity
        const activity = new Activity({
            action: 'New grade added',
            details: `${req.body.student} received ${req.body.grade}% on ${req.body.assignment}`,
            time: new Date().toISOString().replace('T', ' ').substring(0, 16)
        });
        await activity.save();
        
        res.status(201).json(savedGrade);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.put('/api/grades/:id', async (req, res) => {
    try {
        const gradeData = {
            ...req.body,
            date: new Date(req.body.date),
            updatedAt: Date.now()
        };
        
        const updatedGrade = await Grade.findByIdAndUpdate(
            req.params.id, 
            gradeData, 
            { new: true }
        );
        
        if (!updatedGrade) {
            return res.status(404).json({ error: 'Grade not found' });
        }
        
        // Create activity
        const activity = new Activity({
            action: 'Grade updated',
            details: `${updatedGrade.student}'s grade for ${updatedGrade.assignment} was updated`,
            time: new Date().toISOString().replace('T', ' ').substring(0, 16)
        });
        await activity.save();
        
        res.json(updatedGrade);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/api/grades/:id', async (req, res) => {
    try {
        const grade = await Grade.findById(req.params.id);
        if (!grade) {
            return res.status(404).json({ error: 'Grade not found' });
        }
        
        await Grade.findByIdAndDelete(req.params.id);
        
        // Create activity
        const activity = new Activity({
            action: 'Grade deleted',
            details: `${grade.student}'s grade for ${grade.assignment} was deleted`,
            time: new Date().toISOString().replace('T', ' ').substring(0, 16)
        });
        await activity.save();
        
        res.json({ message: 'Grade deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Routes - Attendance
app.get('/api/attendance', async (req, res) => {
    try {
        // Allow filtering by date
        const filter = {};
        if (req.query.date) {
            const queryDate = new Date(req.query.date);
            const nextDay = new Date(queryDate);
            nextDay.setDate(nextDay.getDate() + 1);
            
            filter.date = {
                $gte: queryDate,
                $lt: nextDay
            };
        }
        
        const attendance = await Attendance.find(filter);
        res.json(attendance);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/attendance', async (req, res) => {
    try {
        // Handle bulk attendance records
        if (Array.isArray(req.body)) {
            const records = req.body.map(record => ({
                ...record,
                date: new Date(record.date)
            }));
            
            const savedRecords = await Attendance.insertMany(records);
            
            // Create activity for batch
            const dateStr = new Date(records[0].date).toISOString().split('T')[0];
            const activity = new Activity({
                action: 'Attendance saved',
                details: `Attendance records saved for ${dateStr}`,
                time: new Date().toISOString().replace('T', ' ').substring(0, 16)
            });
            await activity.save();
            
            res.status(201).json(savedRecords);
        } else {
            // Handle single attendance record
            const attendanceData = {
                ...req.body,
                date: new Date(req.body.date)
            };
            
            const newAttendance = new Attendance(attendanceData);
            const savedAttendance = await newAttendance.save();
            
            res.status(201).json(savedAttendance);
        }
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.put('/api/attendance/:id', async (req, res) => {
    try {
        const attendanceData = {
            ...req.body,
            date: new Date(req.body.date),
            updatedAt: Date.now()
        };
        
        const updatedAttendance = await Attendance.findByIdAndUpdate(
            req.params.id, 
            attendanceData, 
            { new: true }
        );
        
        if (!updatedAttendance) {
            return res.status(404).json({ error: 'Attendance record not found' });
        }
        
        res.json(updatedAttendance);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/api/attendance/:id', async (req, res) => {
    try {
        const attendance = await Attendance.findById(req.params.id);
        if (!attendance) {
            return res.status(404).json({ error: 'Attendance record not found' });
        }
        
        await Attendance.findByIdAndDelete(req.params.id);
        
        // Create activity
        const activity = new Activity({
            action: 'Attendance record deleted',
            details: `${attendance.student}'s attendance record was deleted`,
            time: new Date().toISOString().replace('T', ' ').substring(0, 16)
        });
        await activity.save();
        
        res.json({ message: 'Attendance record deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Routes - Activities
app.get('/api/activities', async (req, res) => {
    try {
        const activities = await Activity.find().sort({ timestamp: -1 }).limit(10);
        res.json(activities);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/activities', async (req, res) => {
    try {
        const newActivity = new Activity(req.body);
        const savedActivity = await newActivity.save();
        res.status(201).json(savedActivity);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Initialize sample data route
app.post('/api/initialize', async (req, res) => {
    try {
        // Clear existing data
        await Student.deleteMany({});
        await Course.deleteMany({});
        await Grade.deleteMany({});
        await Attendance.deleteMany({});
        await Activity.deleteMany({});
        
        // Sample data
        const sampleStudents = [
            { name: 'John Doe', email: 'john.doe@example.com', course: 'Web Development', status: 'active', phone: '555-123-4567', notes: 'Excellent student' },
            { name: 'Jane Smith', email: 'jane.smith@example.com', course: 'UX Design', status: 'active', phone: '555-234-5678', notes: 'Very creative' },
            { name: 'Bob Johnson', email: 'bob.johnson@example.com', course: 'Data Science', status: 'inactive', phone: '555-345-6789', notes: 'Needs improvement' },
            { name: 'Sarah Williams', email: 'sarah.williams@example.com', course: 'Web Development', status: 'active', phone: '555-456-7890', notes: '' },
            { name: 'Michael Brown', email: 'michael.brown@example.com', course: 'Mobile Development', status: 'active', phone: '555-567-8901', notes: 'Great progress' }
        ];

        const sampleCourses = [
            { name: 'Web Development', code: 'WD101', category: 'programming', instructor: 'Dr. Alan Smith', startDate: new Date('2025-01-15'), endDate: new Date('2025-05-15'), status: 'active', description: 'Learn HTML, CSS, and JavaScript.' },
            { name: 'UX Design', code: 'UX202', category: 'design', instructor: 'Prof. Emily Johnson', startDate: new Date('2025-02-10'), endDate: new Date('2025-06-10'), status: 'active', description: 'Master user experience principles.' },
            { name: 'Data Science', code: 'DS303', category: 'programming', instructor: 'Dr. Robert Wilson', startDate: new Date('2025-03-01'), endDate: new Date('2025-07-01'), status: 'upcoming', description: 'Python, R, and data analysis.' },
            { name: 'Mobile Development', code: 'MD404', category: 'programming', instructor: 'Prof. Jessica Lee', startDate: new Date('2025-01-20'), endDate: new Date('2025-05-20'), status: 'active', description: 'Building iOS and Android apps.' },
            { name: 'Digital Marketing', code: 'DM505', category: 'business', instructor: 'Dr. Thomas Brown', startDate: new Date('2024-11-15'), endDate: new Date('2025-03-15'), status: 'completed', description: 'SEO, SEM, and social media marketing.' }
        ];

        const sampleGrades = [
            { student: 'John Doe', course: 'Web Development', assignment: 'Project 1', grade: 92, date: new Date('2025-02-15'), comments: 'Excellent work!' },
            { student: 'Jane Smith', course: 'UX Design', assignment: 'User Research', grade: 88, date: new Date('2025-02-20'), comments: 'Good insights.' },
            { student: 'John Doe', course: 'Web Development', assignment: 'Project 2', grade: 85, date: new Date('2025-03-10'), comments: 'Needs improvement in responsiveness.' },
            { student: 'Sarah Williams', course: 'Web Development', assignment: 'Project 1', grade: 90, date: new Date('2025-02-15'), comments: 'Great job!' },
            { student: 'Michael Brown', course: 'Mobile Development', assignment: 'iOS App', grade: 95, date: new Date('2025-02-25'), comments: 'Impressive application!' }
        ];

        const today = new Date();
        const sampleAttendance = [
            { student: 'John Doe', course: 'Web Development', status: 'present', checkInTime: '09:05', date: today },
            { student: 'Jane Smith', course: 'UX Design', status: 'present', checkInTime: '09:00', date: today },
            { student: 'Bob Johnson', course: 'Data Science', status: 'absent', checkInTime: '', date: today },
            { student: 'Sarah Williams', course: 'Web Development', status: 'present', checkInTime: '09:10', date: today },
            { student: 'Michael Brown', course: 'Mobile Development', status: 'late', checkInTime: '09:20', date: today }
        ];

        const sampleActivities = [
            { action: 'New student enrolled', details: 'John Doe joined Web Development', time: '2025-04-08 10:15' },
            { action: 'Grade updated', details: 'Project 1 grades for Web Development posted', time: '2025-04-07 14:30' },
            { action: 'Course started', details: 'Data Science course officially began', time: '2025-04-01 09:00' },
            { action: 'Attendance recorded', details: 'Attendance taken for all active courses', time: '2025-04-10 09:30' },
            { action: 'System initialized', details: 'Sample data loaded into the system', time: new Date().toISOString().replace('T', ' ').substring(0, 16) }
        ];
        
        // Insert sample data
        await Student.insertMany(sampleStudents);
        await Course.insertMany(sampleCourses);
        await Grade.insertMany(sampleGrades);
        await Attendance.insertMany(sampleAttendance);
        await Activity.insertMany(sampleActivities);
        
        res.json({ message: 'Sample data initialized successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});