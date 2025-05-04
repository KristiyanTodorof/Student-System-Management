// script.js - Frontend JavaScript for Student Management System

// Global variables
let currentPage = 'dashboard';
let isDarkTheme = false;
const API_URL = 'http://localhost:5000/api';
let studentsData = [];
let coursesData = [];
let gradesData = [];
let attendanceData = [];
let activitiesData = [];

// DOM ready event listener
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the app
    initializeApp();
    
    // Set up navigation
    setupNavigation();
    
    // Setup theme toggle
    setupThemeToggle();
    
    // Setup search functionality
    setupSearch();
    
    // Setup modal events
    setupModals();
    
    // Setup form handlers
    setupFormHandlers();
    
    // Load initial data
    loadDashboardData();
});

// Initialize the application
function initializeApp() {
    // Check for saved theme
    if (localStorage.getItem('darkTheme') === 'true') {
        document.body.classList.add('dark-theme');
        isDarkTheme = true;
    }
    
    // Initialize button events
    document.getElementById('initFirebaseBtn').addEventListener('click', initializeData);
    document.getElementById('addStudentBtn').addEventListener('click', () => openModal('studentModal'));
    document.getElementById('addCourseBtn').addEventListener('click', () => openModal('courseModal'));
    document.getElementById('addGradeBtn').addEventListener('click', () => openModal('gradeModal'));
    
    // Attendance controls
    document.getElementById('markAllPresentBtn').addEventListener('click', markAllPresent);
    document.getElementById('saveAttendanceBtn').addEventListener('click', saveAttendance);
    document.getElementById('prevDateBtn').addEventListener('click', () => changeAttendanceDate(-1));
    document.getElementById('nextDateBtn').addEventListener('click', () => changeAttendanceDate(1));
    document.getElementById('attendanceDate').valueAsDate = new Date();
    document.getElementById('attendanceDate').addEventListener('change', loadAttendanceData);
    
    // Initialize date fields with current date
    const today = new Date();
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        if (!input.id.includes('Date')) {
            input.valueAsDate = today;
        }
    });
}

// Filter courses based on category and status
function filterCourses() {
    const categoryFilter = document.getElementById('courseFilterCategory').value;
    const statusFilter = document.getElementById('courseFilterStatus').value;
    
    let filteredCourses = [...coursesData];
    
    if (categoryFilter) {
        filteredCourses = filteredCourses.filter(course => course.category === categoryFilter);
    }
    
    if (statusFilter) {
        filteredCourses = filteredCourses.filter(course => course.status === statusFilter);
    }
    
    renderCoursesGrid(filteredCourses);
}

// Confirm and delete a course
function confirmDeleteCourse(course) {
    if (confirm(`Are you sure you want to delete ${course.name} (${course.code})?`)) {
        deleteCourse(course._id);
    }
}

// Delete a course from the API
async function deleteCourse(courseId) {
    try {
        const response = await fetch(`${API_URL}/courses/${courseId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete course');
        }
        
        showNotification('Course deleted successfully!', 'success');
        loadCoursesData();
        // Also reload dashboard to update stats
        if (currentPage === 'dashboard') {
            loadDashboardData();
        }
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

// Populate the course form with data for editing
function populateCourseForm(course) {
    document.getElementById('courseId').value = course._id;
    document.getElementById('courseName').value = course.name;
    document.getElementById('courseCode').value = course.code;
    document.getElementById('courseCategory').value = course.category;
    document.getElementById('courseInstructor').value = course.instructor;
    
    // Format date inputs properly (YYYY-MM-DD)
    const startDate = new Date(course.startDate);
    document.getElementById('courseStartDate').value = startDate.toISOString().split('T')[0];
    
    const endDate = new Date(course.endDate);
    document.getElementById('courseEndDate').value = endDate.toISOString().split('T')[0];
    
    document.getElementById('courseStatus').value = course.status;
    document.getElementById('courseDescription').value = course.description || '';
}

// Load and display Grades data
async function loadGradesData() {
    try {
        await fetchGrades();
        
        // Populate students and courses dropdowns for filters
        populateStudentsDropdown('gradeFilterStudent');
        populateCoursesDropdown('gradeFilterCourse');
        
        // Render grades table
        renderGradesTable(gradesData);
    } catch (error) {
        showNotification('Failed to load grades data: ' + error.message, 'error');
    }
}

// Fetch grades from the API
async function fetchGrades() {
    try {
        const response = await fetch(`${API_URL}/grades`);
        if (!response.ok) {
            throw new Error('Failed to fetch grades');
        }
        gradesData = await response.json();
        return gradesData;
    } catch (error) {
        throw error;
    }
}

// Render grades table
function renderGradesTable(grades) {
    const tableBody = document.querySelector('#gradesTable tbody');
    tableBody.innerHTML = '';
    
    if (grades.length === 0) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = 6;
        td.textContent = 'No grades found';
        td.style.textAlign = 'center';
        tr.appendChild(td);
        tableBody.appendChild(tr);
        return;
    }
    
    grades.forEach(grade => {
        const tr = document.createElement('tr');
        
        // Student column
        const tdStudent = document.createElement('td');
        tdStudent.textContent = grade.student;
        tr.appendChild(tdStudent);
        
        // Course column
        const tdCourse = document.createElement('td');
        tdCourse.textContent = grade.course;
        tr.appendChild(tdCourse);
        
        // Assignment column
        const tdAssignment = document.createElement('td');
        tdAssignment.textContent = grade.assignment;
        tr.appendChild(tdAssignment);
        
        // Grade column
        const tdGrade = document.createElement('td');
        tdGrade.textContent = grade.grade;
        // Apply color based on grade
        if (grade.grade >= 90) {
            tdGrade.style.color = '#4caf50'; // Green for A
        } else if (grade.grade >= 80) {
            tdGrade.style.color = '#8bc34a'; // Light green for B
        } else if (grade.grade >= 70) {
            tdGrade.style.color = '#ffeb3b'; // Yellow for C
        } else if (grade.grade >= 60) {
            tdGrade.style.color = '#ff9800'; // Orange for D
        } else {
            tdGrade.style.color = '#f44336'; // Red for F
        }
        tr.appendChild(tdGrade);
        
        // Date column
        const tdDate = document.createElement('td');
        tdDate.textContent = new Date(grade.date).toLocaleDateString();
        tr.appendChild(tdDate);
        
        // Actions column
        const tdActions = document.createElement('td');
        tdActions.classList.add('table-actions');
        
        const editBtn = document.createElement('button');
        editBtn.innerHTML = '✏️';
        editBtn.classList.add('edit-btn');
        editBtn.title = 'Edit Grade';
        editBtn.addEventListener('click', () => openModal('gradeModal', grade));
        
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '🗑️';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.title = 'Delete Grade';
        deleteBtn.addEventListener('click', () => confirmDeleteGrade(grade));
        
        tdActions.appendChild(editBtn);
        tdActions.appendChild(deleteBtn);
        tr.appendChild(tdActions);
        
        tableBody.appendChild(tr);
    });
}

// Filter grades based on student and course
function filterGrades() {
    const studentFilter = document.getElementById('gradeFilterStudent').value;
    const courseFilter = document.getElementById('gradeFilterCourse').value;
    
    let filteredGrades = [...gradesData];
    
    if (studentFilter) {
        filteredGrades = filteredGrades.filter(grade => grade.student === studentFilter);
    }
    
    if (courseFilter) {
        filteredGrades = filteredGrades.filter(grade => grade.course === courseFilter);
    }
    
    renderGradesTable(filteredGrades);
}

// Confirm and delete a grade
function confirmDeleteGrade(grade) {
    if (confirm(`Are you sure you want to delete grade for ${grade.student} on ${grade.assignment}?`)) {
        deleteGrade(grade._id);
    }
}

// Delete a grade from the API
async function deleteGrade(gradeId) {
    try {
        const response = await fetch(`${API_URL}/grades/${gradeId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete grade');
        }
        
        showNotification('Grade deleted successfully!', 'success');
        loadGradesData();
        // Also reload dashboard to update stats
        if (currentPage === 'dashboard') {
            loadDashboardData();
        }
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

// Populate the grade form with data for editing
function populateGradeForm(grade) {
    document.getElementById('gradeId').value = grade._id;
    
    // Populate students and courses dropdowns
    populateStudentsDropdown('gradeStudent', grade.student);
    populateCoursesDropdown('gradeCourse', grade.course);
    
    document.getElementById('gradeAssignment').value = grade.assignment;
    document.getElementById('gradeValue').value = grade.grade;
    
    // Format date input properly (YYYY-MM-DD)
    const gradeDate = new Date(grade.date);
    document.getElementById('gradeDate').value = gradeDate.toISOString().split('T')[0];
    
    document.getElementById('gradeComments').value = grade.comments || '';
}

// Load and display Attendance data
async function loadAttendanceData() {
    try {
        // Get selected date
        const selectedDate = document.getElementById('attendanceDate').value;
        
        // Fetch attendance for selected date
        await fetchAttendance(selectedDate);
        
        // Populate courses dropdown for filter
        populateCoursesDropdown('attendanceFilterCourse');
        
        // Render attendance table
        renderAttendanceTable(attendanceData);
    } catch (error) {
        showNotification('Failed to load attendance data: ' + error.message, 'error');
    }
}

// Fetch attendance from the API
async function fetchAttendance(date) {
    try {
        const response = await fetch(`${API_URL}/attendance?date=${date}`);
        if (!response.ok) {
            throw new Error('Failed to fetch attendance');
        }
        attendanceData = await response.json();
        
        // If no attendance records exist for this date, create from students
        if (attendanceData.length === 0) {
            // Fetch students if not already loaded
            if (studentsData.length === 0) {
                await fetchStudents();
            }
            
            // Create attendance records for active students
            attendanceData = studentsData
                .filter(student => student.status === 'active')
                .map(student => ({
                    student: student.name,
                    course: student.course,
                    status: 'absent',
                    checkInTime: '',
                    date: date
                }));
        }
        
        return attendanceData;
    } catch (error) {
        throw error;
    }
}

// Render attendance table
function renderAttendanceTable(attendance) {
    const tableBody = document.querySelector('#attendanceTable tbody');
    tableBody.innerHTML = '';
    
    if (attendance.length === 0) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = 5;
        td.textContent = 'No attendance records found';
        td.style.textAlign = 'center';
        tr.appendChild(td);
        tableBody.appendChild(tr);
        return;
    }
    
    attendance.forEach(record => {
        const tr = document.createElement('tr');
        
        // Student column
        const tdStudent = document.createElement('td');
        tdStudent.textContent = record.student;
        tr.appendChild(tdStudent);
        
        // Course column
        const tdCourse = document.createElement('td');
        tdCourse.textContent = record.course;
        tr.appendChild(tdCourse);
        
        // Status column
        const tdStatus = document.createElement('td');
        const statusSelect = document.createElement('select');
        statusSelect.classList.add('attendance-status');
        
        // Status options
        const statusOptions = ['present', 'absent', 'late'];
        statusOptions.forEach(status => {
            const option = document.createElement('option');
            option.value = status;
            option.textContent = status.charAt(0).toUpperCase() + status.slice(1);
            if (record.status === status) {
                option.selected = true;
            }
            statusSelect.appendChild(option);
        });
        
        statusSelect.addEventListener('change', (e) => {
            record.status = e.target.value;
            
            // Update check-in time for present/late
            if (record.status === 'present') {
                record.checkInTime = '09:00';
                tr.querySelector('input[type="time"]').value = '09:00';
                tr.querySelector('input[type="time"]').disabled = false;
            } else if (record.status === 'late') {
                const currentTime = new Date();
                const timeString = `${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`;
                record.checkInTime = timeString;
                tr.querySelector('input[type="time"]').value = timeString;
                tr.querySelector('input[type="time"]').disabled = false;
            } else {
                record.checkInTime = '';
                tr.querySelector('input[type="time"]').value = '';
                tr.querySelector('input[type="time"]').disabled = true;
            }
        });
        
        tdStatus.appendChild(statusSelect);
        tr.appendChild(tdStatus);
        
        // Check-in Time column
        const tdCheckInTime = document.createElement('td');
        const timeInput = document.createElement('input');
        timeInput.type = 'time';
        timeInput.value = record.checkInTime || '';
        timeInput.disabled = record.status === 'absent';
        
        timeInput.addEventListener('change', (e) => {
            record.checkInTime = e.target.value;
        });
        
        tdCheckInTime.appendChild(timeInput);
        tr.appendChild(tdCheckInTime);
        
        // Actions column
        const tdActions = document.createElement('td');
        
        // Toggle present/absent button
        const toggleBtn = document.createElement('button');
        toggleBtn.innerHTML = record.status === 'present' ? '❌' : '✅';
        toggleBtn.title = record.status === 'present' ? 'Mark Absent' : 'Mark Present';
        toggleBtn.classList.add('toggle-attendance-btn');
        
        toggleBtn.addEventListener('click', () => {
            if (record.status === 'present') {
                record.status = 'absent';
                record.checkInTime = '';
                toggleBtn.innerHTML = '✅';
                toggleBtn.title = 'Mark Present';
                statusSelect.value = 'absent';
                timeInput.value = '';
                timeInput.disabled = true;
            } else {
                record.status = 'present';
                const currentTime = new Date();
                const timeString = `${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`;
                record.checkInTime = timeString;
                toggleBtn.innerHTML = '❌';
                toggleBtn.title = 'Mark Absent';
                statusSelect.value = 'present';
                timeInput.value = timeString;
                timeInput.disabled = false;
            }
        });
        
        tdActions.appendChild(toggleBtn);
        tr.appendChild(tdActions);
        
        tableBody.appendChild(tr);
    });
}

// Filter attendance based on course
function filterAttendance() {
    const courseFilter = document.getElementById('attendanceFilterCourse').value;
    
    let filteredAttendance = [...attendanceData];
    
    if (courseFilter) {
        filteredAttendance = filteredAttendance.filter(record => record.course === courseFilter);
    }
    
    renderAttendanceTable(filteredAttendance);
}

// Change attendance date
function changeAttendanceDate(days) {
    const dateInput = document.getElementById('attendanceDate');
    const currentDate = new Date(dateInput.value);
    currentDate.setDate(currentDate.getDate() + days);
    
    // Format date as YYYY-MM-DD
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    
    dateInput.value = `${year}-${month}-${day}`;
    
    // Load attendance data for new date
    loadAttendanceData();
}

// Mark all students present
function markAllPresent() {
    const tableRows = document.querySelectorAll('#attendanceTable tbody tr');
    
    tableRows.forEach(row => {
        const statusSelect = row.querySelector('.attendance-status');
        const timeInput = row.querySelector('input[type="time"]');
        const toggleBtn = row.querySelector('.toggle-attendance-btn');
        
        if (statusSelect) {
            statusSelect.value = 'present';
            
            // Update the data object
            const studentName = row.cells[0].textContent;
            const record = attendanceData.find(r => r.student === studentName);
            
            if (record) {
                record.status = 'present';
                const currentTime = new Date();
                const timeString = `${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`;
                record.checkInTime = timeString;
                
                // Update UI
                if (timeInput) {
                    timeInput.value = timeString;
                    timeInput.disabled = false;
                }
                
                if (toggleBtn) {
                    toggleBtn.innerHTML = '❌';
                    toggleBtn.title = 'Mark Absent';
                }
            }
        }
    });
    
    showNotification('All students marked present!', 'success');
}

// Save attendance records
async function saveAttendance() {
    try {
        // Create a deep copy of attendance data to send to API
        const attendanceToSave = JSON.parse(JSON.stringify(attendanceData));
        
        // Ensure date is in correct format
        attendanceToSave.forEach(record => {
            if (typeof record.date === 'string') {
                record.date = record.date;
            }
        });
        
        const response = await fetch(`${API_URL}/attendance`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(attendanceToSave)
        });
        
        if (!response.ok) {
            throw new Error('Failed to save attendance data');
        }
        
        showNotification('Attendance saved successfully!', 'success');
        
        // Reload attendance data to get server-generated IDs
        loadAttendanceData();
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

// Helper Functions

// Populate the students dropdown
function populateStudentsDropdown(dropdownId, selectedValue = '') {
    const dropdown = document.getElementById(dropdownId);
    dropdown.innerHTML = '';
    
    // Add default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = dropdownId.includes('Filter') ? 'All Students' : 'Select Student';
    dropdown.appendChild(defaultOption);
    
    // Check if students data is loaded
    if (studentsData.length === 0) {
        fetchStudents().then(() => {
            populateStudentsDropdown(dropdownId, selectedValue);
        });
        return;
    }
    
    // Add student options
    studentsData.forEach(student => {
        const option = document.createElement('option');
        option.value = student.name;
        option.textContent = student.name;
        
        if (student.name === selectedValue) {
            option.selected = true;
        }
        
        dropdown.appendChild(option);
    });
}

// Populate the courses dropdown
function populateCoursesDropdown(dropdownId, selectedValue = '') {
    const dropdown = document.getElementById(dropdownId);
    dropdown.innerHTML = '';
    
    // Add default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = dropdownId.includes('Filter') ? 'All Courses' : 'Select Course';
    dropdown.appendChild(defaultOption);
    
    // Check if courses data is loaded
    if (coursesData.length === 0) {
        fetchCourses().then(() => {
            populateCoursesDropdown(dropdownId, selectedValue);
        });
        return;
    }
    
    // Add course options
    coursesData.forEach(course => {
        const option = document.createElement('option');
        option.value = course.name;
        option.textContent = course.name;
        
        if (course.name === selectedValue) {
            option.selected = true;
        }
        
        dropdown.appendChild(option);
    });
}

// Fetch activities from the API
async function fetchActivities() {
    try {
        const response = await fetch(`${API_URL}/activities`);
        if (!response.ok) {
            throw new Error('Failed to fetch activities');
        }
        activitiesData = await response.json();
        return activitiesData;
    } catch (error) {
        throw error;
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notificationMessage');
    
    // Set message and type
    notificationMessage.textContent = message;
    
    // Set color based on type
    switch (type) {
        case 'success':
            notification.style.backgroundColor = 'var(--success-color)';
            break;
        case 'error':
            notification.style.backgroundColor = 'var(--danger-color)';
            break;
        case 'warning':
            notification.style.backgroundColor = 'var(--warning-color)';
            notification.style.color = '#333';
            break;
        default:
            notification.style.backgroundColor = 'var(--primary-color)';
    }
    
    // Show notification
    notification.style.display = 'flex';
    
    // Set timeout to hide notification
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
    
    // Close notification on click
    const closeNotification = document.querySelector('.close-notification');
    closeNotification.addEventListener('click', () => {
        notification.style.display = 'none';
    });
}

// Initialize sample data
async function initializeData() {
    try {
        if (confirm('This will reset all data with sample data. Are you sure?')) {
            const response = await fetch(`${API_URL}/initialize`, {
                method: 'POST'
            });
            
            if (!response.ok) {
                throw new Error('Failed to initialize data');
            }
            
            showNotification('Sample data initialized successfully!', 'success');
            
            // Reload dashboard data
            loadDashboardData();
        }
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

// Set up navigation between pages
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const page = item.getAttribute('data-page');
            
            // Update active class
            navItems.forEach(navItem => navItem.classList.remove('active'));
            item.classList.add('active');
            
            // Hide all pages
            document.querySelectorAll('.page-container').forEach(container => {
                container.classList.add('hidden');
            });
            
            // Show selected page
            document.getElementById(page).classList.remove('hidden');
            
            // Set current page
            currentPage = page;
            
            // Load page specific data
            loadPageData(page);
        });
    });
}

// Load page specific data
function loadPageData(page) {
    switch (page) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'students':
            loadStudentsData();
            break;
        case 'courses':
            loadCoursesData();
            break;
        case 'grades':
            loadGradesData();
            break;
        case 'attendance':
            loadAttendanceData();
            break;
    }
}

// Setup theme toggle
function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        isDarkTheme = document.body.classList.contains('dark-theme');
        localStorage.setItem('darkTheme', isDarkTheme);
        
        // Update any charts if they exist
        updateChartsTheme();
    });
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    searchBtn.addEventListener('click', () => performSearch(searchInput.value));
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            performSearch(searchInput.value);
        }
    });
}

// Perform search based on current page
function performSearch(query) {
    if (!query.trim()) return;
    
    const searchQuery = query.toLowerCase();
    
    switch (currentPage) {
        case 'students':
            const filteredStudents = studentsData.filter(student => 
                student.name.toLowerCase().includes(searchQuery) || 
                student.email.toLowerCase().includes(searchQuery)
            );
            renderStudentsTable(filteredStudents);
            break;
        case 'courses':
            const filteredCourses = coursesData.filter(course => 
                course.name.toLowerCase().includes(searchQuery) || 
                course.code.toLowerCase().includes(searchQuery) ||
                course.instructor.toLowerCase().includes(searchQuery)
            );
            renderCoursesGrid(filteredCourses);
            break;
        case 'grades':
            const filteredGrades = gradesData.filter(grade => 
                grade.student.toLowerCase().includes(searchQuery) || 
                grade.course.toLowerCase().includes(searchQuery) ||
                grade.assignment.toLowerCase().includes(searchQuery)
            );
            renderGradesTable(filteredGrades);
            break;
        default:
            showNotification('Search is not available on this page.', 'warning');
    }
}

// Setup modal events
function setupModals() {
    // Get all modals
    const modals = document.querySelectorAll('.modal');
    
    // Get all close buttons
    const closeButtons = document.querySelectorAll('.close-modal');
    
    // Get all cancel buttons
    const cancelButtons = document.querySelectorAll('button[id$="CancelBtn"]');
    
    // Close modal when clicking close button
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            closeModal(modal.id);
        });
    });
    
    // Close modal when clicking cancel button
    cancelButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            closeModal(modal.id);
        });
    });
    
    // Close modal when clicking outside the modal content
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });
}

// Open a modal
function openModal(modalId, data = null) {
    const modal = document.getElementById(modalId);
    
    // Reset form
    const form = modal.querySelector('form');
    form.reset();
    
    // Set modal title and populate with data if editing
    if (data) {
        switch (modalId) {
            case 'studentModal':
                document.getElementById('studentModalTitle').textContent = 'Edit Student';
                populateStudentForm(data);
                break;
            case 'courseModal':
                document.getElementById('courseModalTitle').textContent = 'Edit Course';
                populateCourseForm(data);
                break;
            case 'gradeModal':
                document.getElementById('gradeModalTitle').textContent = 'Edit Grade';
                populateGradeForm(data);
                break;
        }
    } else {
        // Reset titles for new entries
        switch (modalId) {
            case 'studentModal':
                document.getElementById('studentModalTitle').textContent = 'Add New Student';
                populateCoursesDropdown('studentCourse');
                break;
            case 'courseModal':
                document.getElementById('courseModalTitle').textContent = 'Add New Course';
                break;
            case 'gradeModal':
                document.getElementById('gradeModalTitle').textContent = 'Add New Grade';
                populateStudentsDropdown('gradeStudent');
                populateCoursesDropdown('gradeCourse');
                break;
        }
    }
    
    // Show the modal
    modal.style.display = 'flex';
}

// Close a modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
}

// Setup form handlers
function setupFormHandlers() {
    // Student form submission
    document.getElementById('studentForm').addEventListener('submit', handleStudentFormSubmit);
    
    // Course form submission
    document.getElementById('courseForm').addEventListener('submit', handleCourseFormSubmit);
    
    // Grade form submission
    document.getElementById('gradeForm').addEventListener('submit', handleGradeFormSubmit);
    
    // Filter handlers
    document.getElementById('studentFilterCourse').addEventListener('change', filterStudents);
    document.getElementById('studentFilterStatus').addEventListener('change', filterStudents);
    document.getElementById('courseFilterCategory').addEventListener('change', filterCourses);
    document.getElementById('courseFilterStatus').addEventListener('change', filterCourses);
    document.getElementById('gradeFilterStudent').addEventListener('change', filterGrades);
    document.getElementById('gradeFilterCourse').addEventListener('change', filterGrades);
    document.getElementById('attendanceFilterCourse').addEventListener('change', filterAttendance);
}

// Form submission handlers
async function handleStudentFormSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const studentId = document.getElementById('studentId').value;
    const studentData = {
        name: document.getElementById('studentName').value,
        email: document.getElementById('studentEmail').value,
        phone: document.getElementById('studentPhone').value,
        course: document.getElementById('studentCourse').value,
        status: document.getElementById('studentStatus').value,
        notes: document.getElementById('studentNotes').value
    };
    
    try {
        let response;
        
        if (studentId) {
            // Update existing student
            response = await fetch(`${API_URL}/students/${studentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(studentData)
            });
            
            if (response.ok) {
                showNotification('Student updated successfully!', 'success');
            }
        } else {
            // Create new student
            response = await fetch(`${API_URL}/students`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(studentData)
            });
            
            if (response.ok) {
                showNotification('Student added successfully!', 'success');
            }
        }
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to save student data');
        }
        
        // Close the modal and reload students data
        closeModal('studentModal');
        loadStudentsData();
        // Also reload dashboard to update stats
        if (currentPage === 'dashboard') {
            loadDashboardData();
        }
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

async function handleCourseFormSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const courseId = document.getElementById('courseId').value;
    const courseData = {
        name: document.getElementById('courseName').value,
        code: document.getElementById('courseCode').value,
        category: document.getElementById('courseCategory').value,
        instructor: document.getElementById('courseInstructor').value,
        startDate: document.getElementById('courseStartDate').value,
        endDate: document.getElementById('courseEndDate').value,
        status: document.getElementById('courseStatus').value,
        description: document.getElementById('courseDescription').value
    };
    
    try {
        let response;
        
        if (courseId) {
            // Update existing course
            response = await fetch(`${API_URL}/courses/${courseId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(courseData)
            });
            
            if (response.ok) {
                showNotification('Course updated successfully!', 'success');
            }
        } else {
            // Create new course
            response = await fetch(`${API_URL}/courses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(courseData)
            });
            
            if (response.ok) {
                showNotification('Course added successfully!', 'success');
            }
        }
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to save course data');
        }
        
        // Close the modal and reload courses data
        closeModal('courseModal');
        loadCoursesData();
        // Also reload dashboard to update stats
        if (currentPage === 'dashboard') {
            loadDashboardData();
        }
        
        // Refresh dropdowns that contain courses
        populateCoursesDropdown('studentCourse');
        populateCoursesDropdown('gradeCourse');
        populateCoursesDropdown('studentFilterCourse');
        populateCoursesDropdown('gradeFilterCourse');
        populateCoursesDropdown('attendanceFilterCourse');
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

async function handleGradeFormSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const gradeId = document.getElementById('gradeId').value;
    const gradeData = {
        student: document.getElementById('gradeStudent').value,
        course: document.getElementById('gradeCourse').value,
        assignment: document.getElementById('gradeAssignment').value,
        grade: document.getElementById('gradeValue').value,
        date: document.getElementById('gradeDate').value,
        comments: document.getElementById('gradeComments').value
    };
    
    try {
        let response;
        
        if (gradeId) {
            // Update existing grade
            response = await fetch(`${API_URL}/grades/${gradeId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(gradeData)
            });
            
            if (response.ok) {
                showNotification('Grade updated successfully!', 'success');
            }
        } else {
            // Create new grade
            response = await fetch(`${API_URL}/grades`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(gradeData)
            });
            
            if (response.ok) {
                showNotification('Grade added successfully!', 'success');
            }
        }
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to save grade data');
        }
        
        // Close the modal and reload grades data
        closeModal('gradeModal');
        loadGradesData();
        // Also reload dashboard to update stats
        if (currentPage === 'dashboard') {
            loadDashboardData();
        }
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

// Load and display Dashboard data
async function loadDashboardData() {
    try {
        // Check connection to MongoDB
        updateConnectionStatus(true);
        
        // Fetch data for dashboard stats
        await Promise.all([
            fetchStudents(),
            fetchCourses(),
            fetchGrades(),
            fetchActivities()
        ]);
        
        // Update dashboard stats
        updateDashboardStats();
        
        // Create charts
        createGradesChart();
        createAttendanceChart();
        
        // Render activity list
        renderActivityList();
    } catch (error) {
        updateConnectionStatus(false);
        showNotification('Failed to load dashboard data: ' + error.message, 'error');
    }
}

// Update connection status indicator
function updateConnectionStatus(isConnected) {
    const statusElement = document.getElementById('connectionStatus');
    if (isConnected) {
        statusElement.textContent = 'Connected to MongoDB';
        statusElement.className = 'connected';
    } else {
        statusElement.textContent = 'Disconnected from MongoDB';
        statusElement.className = 'disconnected';
    }
}

// Update dashboard statistics
function updateDashboardStats() {
    document.getElementById('totalStudents').textContent = studentsData.length;
    
    const activeCourses = coursesData.filter(course => course.status === 'active');
    document.getElementById('totalCourses').textContent = activeCourses.length;
    
    // Calculate average grade
    let totalGrade = 0;
    gradesData.forEach(grade => {
        totalGrade += grade.grade;
    });
    const avgGrade = gradesData.length > 0 ? Math.round(totalGrade / gradesData.length) : 0;
    document.getElementById('avgGrade').textContent = avgGrade;
    
    // Mock attendance rate (this would normally be calculated from attendance data)
    document.getElementById('attendanceRate').textContent = '88%';
}

// Create grade distribution chart
function createGradesChart() {
    const ctx = document.getElementById('gradesChart').getContext('2d');
    
    // Categorize grades
    const gradeRanges = {
        'A (90-100)': 0,
        'B (80-89)': 0,
        'C (70-79)': 0,
        'D (60-69)': 0,
        'F (0-59)': 0
    };
    
    gradesData.forEach(grade => {
        const value = grade.grade;
        if (value >= 90) {
            gradeRanges['A (90-100)']++;
        } else if (value >= 80) {
            gradeRanges['B (80-89)']++;
        } else if (value >= 70) {
            gradeRanges['C (70-79)']++;
        } else if (value >= 60) {
            gradeRanges['D (60-69)']++;
        } else {
            gradeRanges['F (0-59)']++;
        }
    });
    
    // Configure chart
    const chartConfig = {
        type: 'bar',
        data: {
            labels: Object.keys(gradeRanges),
            datasets: [{
                label: 'Number of Grades',
                data: Object.values(gradeRanges),
                backgroundColor: [
                    '#4caf50', // Green for A
                    '#8bc34a', // Light green for B
                    '#ffeb3b', // Yellow for C
                    '#ff9800', // Orange for D
                    '#f44336'  // Red for F
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Grade Distribution',
                    color: isDarkTheme ? '#e0e0e0' : '#333'
                },
                legend: {
                    display: false
                }
            }
        }
    };
    
    // If a chart already exists, destroy it safely
    try {
        if (window.gradesChart) {
            window.gradesChart.destroy();
        }
    } catch (error) {
        console.log("Error destroying grades chart:", error);
    }
    
    // Create new chart
    try {
        window.gradesChart = new Chart(ctx, chartConfig);
    } catch (error) {
        console.log("Error creating grades chart:", error);
        // Create a placeholder text to show when chart fails
        ctx.canvas.style.height = '200px';
        ctx.font = '14px Arial';
        ctx.fillStyle = isDarkTheme ? '#e0e0e0' : '#333';
        ctx.textAlign = 'center';
        ctx.fillText('Chart could not be displayed', ctx.canvas.width / 2, ctx.canvas.height / 2);
    }
}

// Create attendance trends chart
function createAttendanceChart() {
    const ctx = document.getElementById('attendanceChart').getContext('2d');
    
    // Mock attendance data for the past 7 days
    const dates = [];
    const presentData = [];
    const absentData = [];
    const lateData = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        
        // Generate random attendance data for demonstration
        const total = studentsData.length || 5;  // Default to 5 if no students
        const present = Math.floor(Math.random() * (total - 2)) + (total - 5 > 0 ? total - 5 : 1);
        const late = Math.floor(Math.random() * 2) + 1;
        const absent = total - present - late;
        
        presentData.push(present);
        absentData.push(absent);
        lateData.push(late);
    }
    
    // Configure chart
    const chartConfig = {
        type: 'line',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'Present',
                    data: presentData,
                    borderColor: '#4caf50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Late',
                    data: lateData,
                    borderColor: '#ff9800',
                    backgroundColor: 'rgba(255, 152, 0, 0.1)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Absent',
                    data: absentData,
                    borderColor: '#f44336',
                    backgroundColor: 'rgba(244, 67, 54, 0.1)',
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Attendance Trends',
                    color: isDarkTheme ? '#e0e0e0' : '#333'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    stacked: true
                }
            }
        }
    };
    
    // If a chart already exists, destroy it safely
    try {
        if (window.attendanceChart) {
            window.attendanceChart.destroy();
        }
    } catch (error) {
        console.log("Error destroying attendance chart:", error);
    }
    
    // Create new chart
    try {
        window.attendanceChart = new Chart(ctx, chartConfig);
    } catch (error) {
        console.log("Error creating attendance chart:", error);
        // Create a placeholder text to show when chart fails
        ctx.canvas.style.height = '200px';
        ctx.font = '14px Arial';
        ctx.fillStyle = isDarkTheme ? '#e0e0e0' : '#333';
        ctx.textAlign = 'center';
        ctx.fillText('Chart could not be displayed', ctx.canvas.width / 2, ctx.canvas.height / 2);
    }
}

// Update charts theme based on dark/light mode
function updateChartsTheme() {
    const textColor = isDarkTheme ? '#e0e0e0' : '#333';
    
    try {
        if (window.gradesChart && window.gradesChart.options) {
            window.gradesChart.options.plugins.title.color = textColor;
            if (window.gradesChart.options.scales.x && window.gradesChart.options.scales.x.ticks) {
                window.gradesChart.options.scales.x.ticks.color = textColor;
            }
            if (window.gradesChart.options.scales.y && window.gradesChart.options.scales.y.ticks) {
                window.gradesChart.options.scales.y.ticks.color = textColor;
            }
            window.gradesChart.update();
        }
    } catch (error) {
        console.log("Error updating grades chart theme:", error);
    }
    
    try {
        if (window.attendanceChart && window.attendanceChart.options) {
            window.attendanceChart.options.plugins.title.color = textColor;
            if (window.attendanceChart.options.scales.x && window.attendanceChart.options.scales.x.ticks) {
                window.attendanceChart.options.scales.x.ticks.color = textColor;
            }
            if (window.attendanceChart.options.scales.y && window.attendanceChart.options.scales.y.ticks) {
                window.attendanceChart.options.scales.y.ticks.color = textColor;
            }
            window.attendanceChart.update();
        }
    } catch (error) {
        console.log("Error updating attendance chart theme:", error);
    }
}

// Render the activity list
function renderActivityList() {
    const activityList = document.getElementById('activityList');
    activityList.innerHTML = '';
    
    activitiesData.slice(0, 5).forEach(activity => {
        const li = document.createElement('li');
        
        const actionSpan = document.createElement('span');
        actionSpan.textContent = `${activity.action}: ${activity.details}`;
        
        const timeSpan = document.createElement('span');
        timeSpan.textContent = activity.time;
        timeSpan.classList.add('activity-time');
        
        li.appendChild(actionSpan);
        li.appendChild(timeSpan);
        
        activityList.appendChild(li);
    });
}

// Load and display Students data
async function loadStudentsData() {
    try {
        await fetchStudents();
        
        // Populate course filter dropdown
        populateCoursesDropdown('studentFilterCourse');
        
        // Render students table
        renderStudentsTable(studentsData);
    } catch (error) {
        showNotification('Failed to load students data: ' + error.message, 'error');
    }
}

// Fetch students from the API
async function fetchStudents() {
    try {
        const response = await fetch(`${API_URL}/students`);
        if (!response.ok) {
            throw new Error('Failed to fetch students');
        }
        studentsData = await response.json();
        return studentsData;
    } catch (error) {
        throw error;
    }
}

// Render students table
function renderStudentsTable(students) {
    const tableBody = document.querySelector('#studentsTable tbody');
    tableBody.innerHTML = '';
    
    if (students.length === 0) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = 6;
        td.textContent = 'No students found';
        td.style.textAlign = 'center';
        tr.appendChild(td);
        tableBody.appendChild(tr);
        return;
    }
    
    students.forEach(student => {
        const tr = document.createElement('tr');
        
        // Student ID column
        const tdId = document.createElement('td');
        tdId.textContent = student._id;
        tr.appendChild(tdId);
        
        // Name column
        const tdName = document.createElement('td');
        tdName.textContent = student.name;
        tr.appendChild(tdName);
        
        // Email column
        const tdEmail = document.createElement('td');
        tdEmail.textContent = student.email;
        tr.appendChild(tdEmail);
        
        // Course column
        const tdCourse = document.createElement('td');
        tdCourse.textContent = student.course;
        tr.appendChild(tdCourse);
        
        // Status column
        const tdStatus = document.createElement('td');
        const statusBadge = document.createElement('span');
        statusBadge.textContent = student.status.charAt(0).toUpperCase() + student.status.slice(1);
        statusBadge.classList.add('status-badge', `status-${student.status}`);
        tdStatus.appendChild(statusBadge);
        tr.appendChild(tdStatus);
        
        // Actions column
        const tdActions = document.createElement('td');
        tdActions.classList.add('table-actions');
        
        const editBtn = document.createElement('button');
        editBtn.innerHTML = '✏️';
        editBtn.classList.add('edit-btn');
        editBtn.title = 'Edit Student';
        editBtn.addEventListener('click', () => openModal('studentModal', student));
        
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '🗑️';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.title = 'Delete Student';
        deleteBtn.addEventListener('click', () => confirmDeleteStudent(student));
        
        tdActions.appendChild(editBtn);
        tdActions.appendChild(deleteBtn);
        tr.appendChild(tdActions);
        
        tableBody.appendChild(tr);
    });
}

// Confirm and delete a student
function confirmDeleteStudent(student) {
    if (confirm(`Are you sure you want to delete ${student.name}?`)) {
        deleteStudent(student._id);
    }
}

// Delete a student from the API
async function deleteStudent(studentId) {
    try {
        const response = await fetch(`${API_URL}/students/${studentId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete student');
        }
        
        showNotification('Student deleted successfully!', 'success');
        loadStudentsData();
        // Also reload dashboard to update stats
        if (currentPage === 'dashboard') {
            loadDashboardData();
        }
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

// Filter students based on course and status
function filterStudents() {
    const courseFilter = document.getElementById('studentFilterCourse').value;
    const statusFilter = document.getElementById('studentFilterStatus').value;
    
    let filteredStudents = [...studentsData];
    
    if (courseFilter) {
        filteredStudents = filteredStudents.filter(student => student.course === courseFilter);
    }
    
    if (statusFilter) {
        filteredStudents = filteredStudents.filter(student => student.status === statusFilter);
    }
    
    renderStudentsTable(filteredStudents);
}

// Populate the student form with data for editing
function populateStudentForm(student) {
    document.getElementById('studentId').value = student._id;
    document.getElementById('studentName').value = student.name;
    document.getElementById('studentEmail').value = student.email;
    document.getElementById('studentPhone').value = student.phone || '';
    
    // Populate course dropdown
    populateCoursesDropdown('studentCourse', student.course);
    
    document.getElementById('studentStatus').value = student.status;
    document.getElementById('studentNotes').value = student.notes || '';
}

// Load and display Courses data
async function loadCoursesData() {
    try {
        await fetchCourses();
        
        // Render courses grid
        renderCoursesGrid(coursesData);
    } catch (error) {
        showNotification('Failed to load courses data: ' + error.message, 'error');
    }
}

// Fetch courses from the API
async function fetchCourses() {
    try {
        const response = await fetch(`${API_URL}/courses`);
        if (!response.ok) {
            throw new Error('Failed to fetch courses');
        }
        coursesData = await response.json();
        return coursesData;
    } catch (error) {
        throw error;
    }
}

// Render courses grid
function renderCoursesGrid(courses) {
    const courseGrid = document.getElementById('courseGrid');
    courseGrid.innerHTML = '';
    
    if (courses.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.textContent = 'No courses found';
        emptyMessage.style.textAlign = 'center';
        emptyMessage.style.padding = '20px';
        courseGrid.appendChild(emptyMessage);
        return;
    }
    
    courses.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.classList.add('course-card');
        
        const courseHeader = document.createElement('div');
        courseHeader.classList.add('course-header');
        
        const courseTitle = document.createElement('h3');
        courseTitle.classList.add('course-title');
        courseTitle.textContent = course.name;
        
        const courseCode = document.createElement('div');
        courseCode.classList.add('course-code');
        courseCode.textContent = course.code;
        
        courseHeader.appendChild(courseTitle);
        courseHeader.appendChild(courseCode);
        
        const courseBody = document.createElement('div');
        courseBody.classList.add('course-body');
        
        // Instructor
        const courseInstructor = document.createElement('div');
        courseInstructor.classList.add('course-instructor');
        courseInstructor.innerHTML = `<span class="icon">👨‍🏫</span> <span>${course.instructor}</span>`;
        
        // Dates
        const courseDates = document.createElement('div');
        courseDates.classList.add('course-dates');
        const startDate = new Date(course.startDate).toLocaleDateString();
        const endDate = new Date(course.endDate).toLocaleDateString();
        courseDates.innerHTML = `<span class="icon">📅</span> <span>${startDate} - ${endDate}</span>`;
        
        // Status
        const courseStatus = document.createElement('div');
        courseStatus.classList.add('course-status');
        courseStatus.innerHTML = `<span class="icon">⚡</span> <span>${course.category.charAt(0).toUpperCase() + course.category.slice(1)}</span>`;
        
        courseBody.appendChild(courseInstructor);
        courseBody.appendChild(courseDates);
        courseBody.appendChild(courseStatus);
        
        const courseFooter = document.createElement('div');
        courseFooter.classList.add('course-footer');
        
        const statusBadge = document.createElement('span');
        statusBadge.classList.add('status-badge', `status-${course.status}`);
        statusBadge.textContent = course.status.charAt(0).toUpperCase() + course.status.slice(1);
        
        const courseActions = document.createElement('div');
        courseActions.classList.add('table-actions');
        
        const editBtn = document.createElement('button');
        editBtn.innerHTML = '✏️';
        editBtn.classList.add('edit-btn');
        editBtn.title = 'Edit Course';
        editBtn.addEventListener('click', () => openModal('courseModal', course));
        
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '🗑️';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.title = 'Delete Course';
        deleteBtn.addEventListener('click', () => confirmDeleteCourse(course));
        
        courseActions.appendChild(editBtn);
        courseActions.appendChild(deleteBtn);
        
        courseFooter.appendChild(statusBadge);
        courseFooter.appendChild(courseActions);
        
        courseCard.appendChild(courseHeader);
        courseCard.appendChild(courseBody);
        courseCard.appendChild(courseFooter);
        
        courseGrid.appendChild(courseCard);
    })
};