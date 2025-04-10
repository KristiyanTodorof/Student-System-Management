// Data for the tables
let students = [
    { id: 1, name: 'Kristiyan Todorov', email: 'todorovk585@gmail.com', course: 'Software Engineering', status: 'active', phone: '0888916060', notes: 'Excellent student' },
    { id: 2, name: 'Krasen Nedelchev', email: 'nedelchev@gmail.com', course: 'Mathematics and Computer Science pedagogy', status: 'active', phone: '0878738732', notes: 'Good student' },
    { id: 3, name: 'Alex Dimitrov', email: 'dimitrov@gmail.com', course: 'English Philology', status: 'active', phone: '0878856480', notes: 'Good listening skills' },
    { id: 4, name: 'Ivo Indjev', email: 'indjev@abv.bg', course: 'Logistics', status: 'inactive', phone: '0882256011', notes: 'Needs improvement' },
    { id: 5, name: 'Plamena Dimitrova', email: 'dimitrova@abv.bg', course: 'Computer Science', status: 'active', phone: '0883492267', notes: 'Great progress' }
];
let courses = [
    { id: 1, name: 'Software Engineering', code: 'SE101', category: 'programming', instructor: 'Dr. Alan Smith', startDate: '2025-01-15', endDate: '2025-05-15', status: 'active', description: 'Learn .NET, JavaScipt, and Android.' },
    { id: 2, name: 'Mathematics and Computer Science pedagogy', code: 'MC202', category: 'mathematics', instructor: 'Prof. Emily Johnson', startDate: '2025-02-10', endDate: '2025-06-10', status: 'active', description: 'Master calculus.' },
    { id: 3, name: 'English Philology', code: 'EP303', category: 'english', instructor: 'Dr. Robert Wilson', startDate: '2025-03-01', endDate: '2025-07-01', status: 'upcoming', description: 'Book analysis'},
    { id: 4, name: 'Logistics', code: 'L404', category: 'cars', instructor: 'Prof. Jessica Lee', startDate: '2025-01-20', endDate: '2025-05-20', status: 'active', description: 'Building engine' },
    { id: 5, name: 'Computer Science', code: 'CM505', category: 'programming', instructor: 'Dr. Thomas Brown', startDate: '2024-11-15', endDate: '2025-03-15', status: 'completed', description: 'Learn HTML, CSS, and JavaScript.' }
];
let grades = [
    { id: 1, student: 'Kristiyan Todorov', course: 'Software Engineering', assignment: 'Project 1', grade: 92, date: '2025-02-15', comments: 'Excellent work!' },
    { id: 2, student: 'Krasen Nedelchev', course: 'Mathematics and Computer Science pedagogy', assignment: 'Calculus II', grade: 88, date: '2025-02-20', comments: 'Good insights.' },
    { id: 3, student: 'Kristiyan Todorov', course: 'Software Engineering', assignment: 'Project 2', grade: 85, date: '2025-03-10', comments: 'Needs improvement in responsiveness.' },
    { id: 4, student: 'Alex Dimitrov', course: 'English Philology', assignment: 'Project 1', grade: 70, date: '2025-02-15', comments: 'Great job!' },
    { id: 5, student: 'Plamena Dimitrova', course: 'Computer Science', assignment: 'iOS App', grade: 95, date: '2025-02-25', comments: 'Impressive application!' }
];
let attendance = [
    { id: 1, student: 'Kristiyan Todorov', course: 'Software Engineering', status: 'present', checkInTime: '09:05', date: '2025-04-10' },
    { id: 2, student: 'Krasen Nedelchev', course: 'Mathematics and Computer Science pedagogy', status: 'present', checkInTime: '09:00', date: '2025-04-10' },
    { id: 3, student: 'Ivo Indjev', course: 'Logistics', status: 'absent', checkInTime: '', date: '2025-04-10' },
    { id: 4, student: 'Plamena Dimitrova', course: 'Computer Science', status: 'present', checkInTime: '09:10', date: '2025-04-10' },
    { id: 5, student: 'Alex Dimitrov', course: 'English Philology', status: 'late', checkInTime: '09:20', date: '2025-04-10' }
];
let activities = [
    { action: 'New student enrolled', details: 'Kristiyan Todorov joined Software Engineering', time: '2025-04-08 10:15' },
    { action: 'Grade updated', details: 'Project 1 grades for Software Engineering posted', time: '2025-04-07 14:30' },
    { action: 'Course started', details: 'Logistics course officially began', time: '2025-04-01 09:00' },
    { action: 'Attendance recorded', details: 'Attendance taken for all active courses', time: '2025-04-10 09:30' }
];

// Theme switcher
document.getElementById('themeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    // Store theme preference
    const isDarkTheme = document.body.classList.contains('dark-theme');
    localStorage.setItem('darkTheme', isDarkTheme);
});

// Check theme preference on load
document.addEventListener('DOMContentLoaded', () => {
    const isDarkTheme = localStorage.getItem('darkTheme') === 'true';
    if (isDarkTheme) {
        document.body.classList.add('dark-theme');
    }
    
    // Initialize dashboard and load first page data
    updateDashboardStats();
    loadStudentsTable();
    loadCoursesGrid();
    loadGradesTable();
    initAttendance();
    updateActivityList();
    initCharts();
    
    // Set today's date for attendance
    document.getElementById('attendanceDate').valueAsDate = new Date();
    
    // Add event listeners to page-specific buttons
    document.getElementById('addStudentBtn').addEventListener('click', () => openStudentModal());
    document.getElementById('addCourseBtn').addEventListener('click', () => openCourseModal());
    document.getElementById('addGradeBtn').addEventListener('click', () => openGradeModal());
    
    // Initialize search functionality
    document.getElementById('searchBtn').addEventListener('click', performSearch);
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });
    
    // Attendance navigation
    document.getElementById('prevDateBtn').addEventListener('click', navigateAttendanceDate);
    document.getElementById('nextDateBtn').addEventListener('click', navigateAttendanceDate);
    document.getElementById('attendanceDate').addEventListener('change', loadAttendanceTable);
    document.getElementById('attendanceFilterCourse').addEventListener('change', loadAttendanceTable);
    
    // Attendance actions
    document.getElementById('markAllPresentBtn').addEventListener('click', markAllPresent);
    document.getElementById('saveAttendanceBtn').addEventListener('click', saveAttendance);
    
    // Notification close button
    document.querySelector('.close-notification').addEventListener('click', () => {
        document.getElementById('notification').style.display = 'none';
    });
});

// Navigation
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(navItem => {
            navItem.classList.remove('active');
        });
        item.classList.add('active');
        
        // Show selected page
        const pageId = item.getAttribute('data-page');
        document.querySelectorAll('.page-container').forEach(page => {
            page.classList.add('hidden');
        });
        document.getElementById(pageId).classList.remove('hidden');
    });
});

// Dashboard stats
function updateDashboardStats() {
    document.getElementById('totalStudents').textContent = students.length;
    document.getElementById('totalCourses').textContent = courses.filter(course => course.status === 'active').length;

    const allGrades = grades.map(grade => grade.grade);
    const avgGrade = allGrades.length ? 
        (allGrades.reduce((sum, grade) => sum + grade, 0) / allGrades.length).toFixed(1) : 
        '0.0';
    document.getElementById('avgGrade').textContent = avgGrade;

    const totalAttendance = attendance.length;
    const presentCount = attendance.filter(record => record.status === 'present' || record.status === 'late').length;
    const attendanceRate = totalAttendance ? Math.round((presentCount / totalAttendance) * 100) : 0;
    document.getElementById('attendanceRate').textContent = `${attendanceRate}%`;
}
