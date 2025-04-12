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

document.getElementById('themeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const isDarkTheme = document.body.classList.contains('dark-theme');
    localStorage.setItem('darkTheme', isDarkTheme);
});

document.addEventListener('DOMContentLoaded', () => {
    const isDarkTheme = localStorage.getItem('darkTheme') === 'true';
    if (isDarkTheme) {
        document.body.classList.add('dark-theme');
    }
    
    updateDashboardStats();
    loadStudentsTable();
    loadCoursesGrid();
    loadGradesTable();
    initAttendance();
    updateActivityList();
    initCharts();
    
    document.getElementById('attendanceDate').valueAsDate = new Date();
    
    document.getElementById('addStudentBtn').addEventListener('click', () => openStudentModal());
    document.getElementById('addCourseBtn').addEventListener('click', () => openCourseModal());
    document.getElementById('addGradeBtn').addEventListener('click', () => openGradeModal());
    
    document.getElementById('searchBtn').addEventListener('click', performSearch);
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });
    
    document.getElementById('prevDateBtn').addEventListener('click', navigateAttendanceDate);
    document.getElementById('nextDateBtn').addEventListener('click', navigateAttendanceDate);
    document.getElementById('attendanceDate').addEventListener('change', loadAttendanceTable);
    document.getElementById('attendanceFilterCourse').addEventListener('change', loadAttendanceTable);
    
    document.getElementById('markAllPresentBtn').addEventListener('click', markAllPresent);
    document.getElementById('saveAttendanceBtn').addEventListener('click', saveAttendance);
    
    document.querySelector('.close-notification').addEventListener('click', () => {
        document.getElementById('notification').style.display = 'none';
    });
});


document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.nav-item').forEach(navItem => {
            navItem.classList.remove('active');
        });
        item.classList.add('active');
        
        const pageId = item.getAttribute('data-page');
        document.querySelectorAll('.page-container').forEach(page => {
            page.classList.add('hidden');
        });
        document.getElementById(pageId).classList.remove('hidden');
    });
});

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

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    document.getElementById('notificationMessage').textContent = message;
    notification.style.display = 'flex';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

function updateActivityList() {
    const activityList = document.getElementById('activityList');
    activityList.innerHTML = '';
    
    activities.forEach(activity => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div>
                <strong>${activity.action}</strong>
                <p>${activity.details}</p>
            </div>
            <span class="activity-time">${activity.time}</span>
        `;
        activityList.appendChild(li);
    });
}

function addActivity(action, details) {
    const now = new Date();
    const time = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const newActivity = {
        action,
        details,
        time
    };
    
    activities.unshift(newActivity);
    
    if (activities.length > 10) {
        activities.pop();
    }
    
    updateActivityList();
}

function initCharts() {
    const gradeCtx = document.getElementById('gradesChart').getContext('2d');
    const gradeRanges = {
        'A (90-100)': 0,
        'B (80-89)': 0,
        'C (70-79)': 0,
        'D (60-69)': 0,
        'F (0-59)': 0
    };
    
    grades.forEach(grade => {
        if (grade.grade >= 90) gradeRanges['A (90-100)']++;
        else if (grade.grade >= 80) gradeRanges['B (80-89)']++;
        else if (grade.grade >= 70) gradeRanges['C (70-79)']++;
        else if (grade.grade >= 60) gradeRanges['D (60-69)']++;
        else gradeRanges['F (0-59)']++;
    });
    
    new Chart(gradeCtx, {
        type: 'bar',
        data: {
            labels: Object.keys(gradeRanges),
            datasets: [{
                label: 'Number of Students',
                data: Object.values(gradeRanges),
                backgroundColor: [
                    '#4caf50',
                    '#8bc34a',
                    '#ffc107',
                    '#ff9800',
                    '#f44336'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            }
        }
    });
    
    const attendanceCtx = document.getElementById('attendanceChart').getContext('2d');
    new Chart(attendanceCtx, {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
            datasets: [{
                label: 'Attendance Rate (%)',
                data: [95, 90, 88, 92, 94],
                fill: false,
                borderColor: '#4a6cfa',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

function performSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    
    if (!searchTerm) {
        showNotification('Please enter a search term');
        return;
    }
    
    const foundStudents = students.filter(student => 
        student.name.toLowerCase().includes(searchTerm) || 
        student.email.toLowerCase().includes(searchTerm)
    );
    
    const foundCourses = courses.filter(course => 
        course.name.toLowerCase().includes(searchTerm) || 
        course.code.toLowerCase().includes(searchTerm) ||
        course.instructor.toLowerCase().includes(searchTerm)
    );
    
    if (foundStudents.length > 0) {
        document.querySelectorAll('.nav-item').forEach(navItem => {
            navItem.classList.remove('active');
        });
        document.querySelector('[data-page="students"]').classList.add('active');
        
        document.querySelectorAll('.page-container').forEach(page => {
            page.classList.add('hidden');
        });
        document.getElementById('students').classList.remove('hidden');
        
        const tableBody = document.querySelector('#studentsTable tbody');
        tableBody.innerHTML = '';
        
        foundStudents.forEach(student => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.email}</td>
                <td>${student.course}</td>
                <td><span class="status-badge status-${student.status}">${student.status}</span></td>
                <td class="table-actions">
                    <button class="edit-btn" data-id="${student.id}">✏️</button>
                    <button class="delete-btn" data-id="${student.id}">🗑️</button>
                </td>
            `;
            tableBody.appendChild(tr);
        });
        
        document.querySelectorAll('#studentsTable .edit-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const studentId = parseInt(btn.getAttribute('data-id'));
                openStudentModal(studentId);
            });
        });
        
        document.querySelectorAll('#studentsTable .delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const studentId = parseInt(btn.getAttribute('data-id'));
                deleteStudent(studentId);
            });
        });
        
        showNotification(`Found ${foundStudents.length} student(s) matching "${searchTerm}"`);
    } else if (foundCourses.length > 0) {
        document.querySelectorAll('.nav-item').forEach(navItem => {
            navItem.classList.remove('active');
        });
        document.querySelector('[data-page="courses"]').classList.add('active');
        
        document.querySelectorAll('.page-container').forEach(page => {
            page.classList.add('hidden');
        });
        document.getElementById('courses').classList.remove('hidden');
        
        const courseGrid = document.getElementById('courseGrid');
        courseGrid.innerHTML = '';
        
        foundCourses.forEach(course => {
            const courseCard = document.createElement('div');
            courseCard.className = 'course-card';
            courseCard.innerHTML = `
                <div class="course-header">
                    <h3 class="course-title">${course.name}</h3>
                    <p class="course-code">${course.code}</p>
                </div>
                <div class="course-body">
                    <div class="course-instructor">
                        <span>👨‍🏫</span>
                        <span>${course.instructor}</span>
                    </div>
                    <div class="course-dates">
                        <span>📅</span>
                        <span>${formatDate(course.startDate)} - ${formatDate(course.endDate)}</span>
                    </div>
                    <div class="course-status">
                        <span>⚪</span>
                        <span class="status-badge status-${course.status}">${course.status}</span>
                    </div>
                    <p class="course-description">${course.description}</p>
                </div>
                <div class="course-footer">
                    <button class="btn btn-primary edit-course-btn" data-id="${course.id}">Edit</button>
                    <button class="btn btn-danger delete-course-btn" data-id="${course.id}">Delete</button>
                </div>
            `;
            courseGrid.appendChild(courseCard);
        });
        
        document.querySelectorAll('.edit-course-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const courseId = parseInt(btn.getAttribute('data-id'));
                openCourseModal(courseId);
            });
        });
        
        document.querySelectorAll('.delete-course-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const courseId = parseInt(btn.getAttribute('data-id'));
                deleteCourse(courseId);
            });
        });
        
        showNotification(`Found ${foundCourses.length} course(s) matching "${searchTerm}"`);
    } else {
        showNotification(`No results found for "${searchTerm}"`);
    }
}

function loadStudentsTable() {
    const tableBody = document.querySelector('#studentsTable tbody');
    tableBody.innerHTML = '';

    const courseFilter = document.getElementById('studentFilterCourse').value;
    const statusFilter = document.getElementById('studentFilterStatus').value;
    
    let filteredStudents = students;
    
    if (courseFilter) {
        filteredStudents = filteredStudents.filter(student => student.course === courseFilter);
    }
    
    if (statusFilter) {
        filteredStudents = filteredStudents.filter(student => student.status === statusFilter);
    }
    
    filteredStudents.forEach(student => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>${student.course}</td>
            <td><span class="status-badge status-${student.status}">${student.status}</span></td>
            <td class="table-actions">
                <button class="edit-btn" data-id="${student.id}">✏️</button>
                <button class="delete-btn" data-id="${student.id}">🗑️</button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
    
    document.querySelectorAll('#studentsTable .edit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const studentId = parseInt(btn.getAttribute('data-id'));
            openStudentModal(studentId);
        });
    });
    
    document.querySelectorAll('#studentsTable .delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const studentId = parseInt(btn.getAttribute('data-id'));
            deleteStudent(studentId);
        });
    });
    
    const courseSelect = document.getElementById('studentFilterCourse');
    if (courseSelect.options.length <= 1) {
        courses.forEach(course => {
            const option = document.createElement('option');
            option.value = course.name;
            option.textContent = course.name;
            courseSelect.appendChild(option);
        });
    }
    
    document.getElementById('studentFilterCourse').addEventListener('change', loadStudentsTable);
    document.getElementById('studentFilterStatus').addEventListener('change', loadStudentsTable);
}

function openStudentModal(studentId = null) {
    const modal = document.getElementById('studentModal');
    const modalTitle = document.getElementById('studentModalTitle');
    const form = document.getElementById('studentForm');
    const studentIdInput = document.getElementById('studentId');
    const nameInput = document.getElementById('studentName');
    const emailInput = document.getElementById('studentEmail');
    const phoneInput = document.getElementById('studentPhone');
    const courseSelect = document.getElementById('studentCourse');
    const statusSelect = document.getElementById('studentStatus');
    const notesInput = document.getElementById('studentNotes');
    
    courseSelect.innerHTML = '';
    courses.forEach(course => {
        const option = document.createElement('option');
        option.value = course.name;
        option.textContent = course.name;
        courseSelect.appendChild(option);
    });
    
    if (studentId) {
        modalTitle.textContent = 'Edit Student';
        const student = students.find(s => s.id === studentId);
        
        studentIdInput.value = student.id;
        nameInput.value = student.name;
        emailInput.value = student.email;
        phoneInput.value = student.phone || '';
        courseSelect.value = student.course;
        statusSelect.value = student.status;
        notesInput.value = student.notes || '';
    } else {
        modalTitle.textContent = 'Add New Student';
        form.reset();
        studentIdInput.value = '';
    }
    
    modal.style.display = 'flex';
    
    document.querySelector('#studentModal .close-modal').addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    document.getElementById('cancelStudentBtn').addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    form.onsubmit = function(e) {
        e.preventDefault();
        
        const studentData = {
            name: nameInput.value,
            email: emailInput.value,
            phone: phoneInput.value,
            course: courseSelect.value,
            status: statusSelect.value,
            notes: notesInput.value
        };
        
        if (studentId) {
            updateStudent(studentId, studentData);
        } else {
            addStudent(studentData);
        }
        
        modal.style.display = 'none';
    };
}

function addStudent(studentData) {
    const newId = students.length ? Math.max(...students.map(s => s.id)) + 1 : 1;
    
    const newStudent = {
        id: newId,
        ...studentData
    };
    
    students.push(newStudent);
    
    loadStudentsTable();
    updateDashboardStats();
    
    addActivity(`New student enrolled`, `${studentData.name} joined ${studentData.course}`);
    
    showNotification('Student added successfully!');
}

function updateStudent(id, studentData) {
    const index = students.findIndex(s => s.id === id);
    
    students[index] = {
        ...students[index],
        ...studentData
    };
    
    loadStudentsTable();
    
    addActivity('Student updated', `${studentData.name}'s information was updated`);
    
    showNotification('Student updated successfully!');
}

function deleteStudent(id) {
    if (confirm('Are you sure you want to delete this student?')) {
        const student = students.find(s => s.id === id);
        const studentName = student ? student.name : 'Unknown student';
        
        students = students.filter(student => student.id !== id);
        
        loadStudentsTable();
        updateDashboardStats();
        
        addActivity('Student removed', `${studentName} was removed from the system`);
        
        showNotification('Student deleted successfully!');
    }
}

function loadCoursesGrid() {
    const courseGrid = document.getElementById('courseGrid');
    courseGrid.innerHTML = '';
    
    const categoryFilter = document.getElementById('courseFilterCategory').value;
    const statusFilter = document.getElementById('courseFilterStatus').value;
    
    let filteredCourses = courses;
    
    if (categoryFilter) {
        filteredCourses = filteredCourses.filter(course => course.category === categoryFilter);
    }
    
    if (statusFilter) {
        filteredCourses = filteredCourses.filter(course => course.status === statusFilter);
    }
    
    filteredCourses.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.className = 'course-card';
        courseCard.innerHTML = `
            <div class="course-header">
                <h3 class="course-title">${course.name}</h3>
                <p class="course-code">${course.code}</p>
            </div>
            <div class="course-body">
                <div class="course-instructor">
                    <span>👨‍🏫</span>
                    <span>${course.instructor}</span>
                </div>
                <div class="course-dates">
                    <span>📅</span>
                    <span>${formatDate(course.startDate)} - ${formatDate(course.endDate)}</span>
                </div>
                <div class="course-status">
                    <span>⚪</span>
                    <span class="status-badge status-${course.status}">${course.status}</span>
                </div>
                <p class="course-description">${course.description}</p>
            </div>
            <div class="course-footer">
                <button class="btn btn-primary edit-course-btn" data-id="${course.id}">Edit</button>
                <button class="btn btn-danger delete-course-btn" data-id="${course.id}">Delete</button>
            </div>
        `;
        courseGrid.appendChild(courseCard);
    });
    
    document.querySelectorAll('.edit-course-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const courseId = parseInt(btn.getAttribute('data-id'));
            openCourseModal(courseId);
        });
    });
    
    document.querySelectorAll('.delete-course-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const courseId = parseInt(btn.getAttribute('data-id'));
            deleteCourse(courseId);
        });
    });
    
    document.getElementById('courseFilterCategory').addEventListener('change', loadCoursesGrid);
    document.getElementById('courseFilterStatus').addEventListener('change', loadCoursesGrid);
}

function openCourseModal(courseId = null) {
    const modal = document.getElementById('courseModal');
    const modalTitle = document.getElementById('courseModalTitle');
    const form = document.getElementById('courseForm');
    const courseIdInput = document.getElementById('courseId');
    const nameInput = document.getElementById('courseName');
    const codeInput = document.getElementById('courseCode');
    const categorySelect = document.getElementById('courseCategory');
    const instructorInput = document.getElementById('courseInstructor');
    const startDateInput = document.getElementById('courseStartDate');
    const endDateInput = document.getElementById('courseEndDate');
    const statusSelect = document.getElementById('courseStatus');
    const descriptionInput = document.getElementById('courseDescription');
    
    if (courseId) {
        modalTitle.textContent = 'Edit Course';
        const course = courses.find(c => c.id === courseId);
        
        courseIdInput.value = course.id;
        nameInput.value = course.name;
        codeInput.value = course.code;
        categorySelect.value = course.category;
        instructorInput.value = course.instructor;
        startDateInput.value = course.startDate;
        endDateInput.value = course.endDate;
        statusSelect.value = course.status;
        descriptionInput.value = course.description || '';
    } else {
        modalTitle.textContent = 'Add New Course';
        form.reset();
        courseIdInput.value = '';
    }
    
    modal.style.display = 'flex';
    
    document.querySelector('#courseModal .close-modal').addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    document.getElementById('cancelCourseBtn').addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    form.onsubmit = function(e) {
        e.preventDefault();
        
        const courseData = {
            name: nameInput.value,
            code: codeInput.value,
            category: categorySelect.value,
            instructor: instructorInput.value,
            startDate: startDateInput.value,
            endDate: endDateInput.value,
            status: statusSelect.value,
            description: descriptionInput.value
        };
        
        if (courseId) {
            updateCourse(courseId, courseData);
        } else {
            addCourse(courseData);
        }
        
        modal.style.display = 'none';
    };
}

function addCourse(courseData) {
    const newId = courses.length ? Math.max(...courses.map(c => c.id)) + 1 : 1;
    
    const newCourse = {
        id: newId,
        ...courseData
    };
    
    courses.push(newCourse);
    
    loadCoursesGrid();
    updateDashboardStats();
    
    updateCourseDropdowns();
    
    addActivity('New course added', `${courseData.name} (${courseData.code}) was added`);
    
    showNotification('Course added successfully!');
}

function updateCourse(id, courseData) {
    const index = courses.findIndex(c => c.id === id);
    
    courses[index] = {
        ...courses[index],
        ...courseData
    };
    
    loadCoursesGrid();
    updateDashboardStats();
    
    updateCourseDropdowns();
    
    addActivity('Course updated', `${courseData.name} (${courseData.code}) was updated`);
    
    showNotification('Course updated successfully!');
}

function deleteCourse(id) {
    if (confirm('Are you sure you want to delete this course?')) {
        const course = courses.find(c => c.id === id);
        const courseName = course ? course.name : 'Unknown course';
        
        courses = courses.filter(course => course.id !== id);
        
        loadCoursesGrid();
        updateDashboardStats();
        
        updateCourseDropdowns();
        
        addActivity('Course removed', `${courseName} was removed from the system`);
        
        showNotification('Course deleted successfully!');
    }
}

function updateCourseDropdowns() {
    const studentFilterCourse = document.getElementById('studentFilterCourse');
    studentFilterCourse.innerHTML = '<option value="">All Courses</option>';
    
    const gradeFilterCourse = document.getElementById('gradeFilterCourse');
    gradeFilterCourse.innerHTML = '<option value="">All Courses</option>';
    
    const attendanceFilterCourse = document.getElementById('attendanceFilterCourse');
    attendanceFilterCourse.innerHTML = '<option value="">All Courses</option>';
    
    const studentCourse = document.getElementById('studentCourse');
    if (studentCourse) studentCourse.innerHTML = '';
    
    const gradeCourse = document.getElementById('gradeCourse');
    if (gradeCourse) gradeCourse.innerHTML = '';
    
    courses.forEach(course => {
        const option1 = document.createElement('option');
        option1.value = course.name;
        option1.textContent = course.name;
        studentFilterCourse.appendChild(option1);
        
        const option2 = document.createElement('option');
        option2.value = course.name;
        option2.textContent = course.name;
        gradeFilterCourse.appendChild(option2);
        
        const option3 = document.createElement('option');
        option3.value = course.name;
        option3.textContent = course.name;
        attendanceFilterCourse.appendChild(option3);
        
        if (studentCourse) {
            const option4 = document.createElement('option');
            option4.value = course.name;
            option4.textContent = course.name;
            studentCourse.appendChild(option4);
        }

        if (gradeCourse) {
            const option5 = document.createElement('option');
            option5.value = course.name;
            option5.textContent = course.name;
            gradeCourse.appendChild(option5);
        }
    });
}

function loadGradesTable() {
    const tableBody = document.querySelector('#gradesTable tbody');
    tableBody.innerHTML = '';
    
    const studentFilter = document.getElementById('gradeFilterStudent').value;
    const courseFilter = document.getElementById('gradeFilterCourse').value;
    
    let filteredGrades = grades;
    
    if (studentFilter) {
        filteredGrades = filteredGrades.filter(grade => grade.student === studentFilter);
    }
    
    if (courseFilter) {
        filteredGrades = filteredGrades.filter(grade => grade.course === courseFilter);
    }
    
    filteredGrades.forEach(grade => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${grade.student}</td>
            <td>${grade.course}</td>
            <td>${grade.assignment}</td>
            <td>${grade.grade}</td>
            <td>${formatDate(grade.date)}</td>
            <td class="table-actions">
                <button class="edit-btn" data-id="${grade.id}">✏️</button>
                <button class="delete-btn" data-id="${grade.id}">🗑️</button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
    
    document.querySelectorAll('#gradesTable .edit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const gradeId = parseInt(btn.getAttribute('data-id'));
            openGradeModal(gradeId);
        });
    });
    
    document.querySelectorAll('#gradesTable .delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const gradeId = parseInt(btn.getAttribute('data-id'));
            deleteGrade(gradeId);
        });
    });
    
    const studentSelect = document.getElementById('gradeFilterStudent');
    if (studentSelect.options.length <= 1) { 
        const uniqueStudents = [...new Set(students.map(student => student.name))];
        
        uniqueStudents.forEach(studentName => {
            const option = document.createElement('option');
            option.value = studentName;
            option.textContent = studentName;
            studentSelect.appendChild(option);
        });
    }
    
    document.getElementById('gradeFilterStudent').addEventListener('change', loadGradesTable);
    document.getElementById('gradeFilterCourse').addEventListener('change', loadGradesTable);
}

function openGradeModal(gradeId = null) {
    const modal = document.getElementById('gradeModal');
    const modalTitle = document.getElementById('gradeModalTitle');
    const form = document.getElementById('gradeForm');
    const gradeIdInput = document.getElementById('gradeId');
    const studentSelect = document.getElementById('gradeStudent');
    const courseSelect = document.getElementById('gradeCourse');
    const assignmentInput = document.getElementById('gradeAssignment');
    const gradeInput = document.getElementById('gradeValue');
    const dateInput = document.getElementById('gradeDate');
    const commentsInput = document.getElementById('gradeComments');
    
    studentSelect.innerHTML = '';
    students.forEach(student => {
        const option = document.createElement('option');
        option.value = student.name;
        option.textContent = student.name;
        studentSelect.appendChild(option);
    });

    courseSelect.innerHTML = '';
    courses.forEach(course => {
        const option = document.createElement('option');
        option.value = course.name;
        option.textContent = course.name;
        courseSelect.appendChild(option);
    });
    
    if (gradeId) {
        modalTitle.textContent = 'Edit Grade';
        const grade = grades.find(g => g.id === gradeId);
        
        gradeIdInput.value = grade.id;
        studentSelect.value = grade.student;
        courseSelect.value = grade.course;
        assignmentInput.value = grade.assignment;
        gradeInput.value = grade.grade;
        dateInput.value = grade.date;
        commentsInput.value = grade.comments || '';
    } else {
        modalTitle.textContent = 'Add New Grade';
        form.reset();
        gradeIdInput.value = '';
        dateInput.valueAsDate = new Date();
    }
    
    modal.style.display = 'flex';
    
    document.querySelector('#gradeModal .close-modal').addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    document.getElementById('cancelGradeBtn').addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    form.onsubmit = function(e) {
        e.preventDefault();
        
        const gradeData = {
            student: studentSelect.value,
            course: courseSelect.value,
            assignment: assignmentInput.value,
            grade: parseInt(gradeInput.value),
            date: dateInput.value,
            comments: commentsInput.value
        };
        
        if (gradeId) {
            updateGrade(gradeId, gradeData);
        } else {
            addGrade(gradeData);
        }
        
        modal.style.display = 'none';
    };
}

function addGrade(gradeData) {
    const newId = grades.length ? Math.max(...grades.map(g => g.id)) + 1 : 1;
    
    const newGrade = {
        id: newId,
        ...gradeData
    };
    
    grades.push(newGrade);
    
    loadGradesTable();
    updateDashboardStats();
    initCharts();
    
    addActivity('New grade added', `${gradeData.student} received ${gradeData.grade}% on ${gradeData.assignment}`);
    
    showNotification('Grade added successfully!');
}

function updateGrade(id, gradeData) {
    const index = grades.findIndex(g => g.id === id);
    
    grades[index] = {
        ...grades[index],
        ...gradeData
    };
    
    loadGradesTable();
    updateDashboardStats();
    initCharts(); 
    
    addActivity('Grade updated', `${gradeData.student}'s grade for ${gradeData.assignment} was updated`);
    
    showNotification('Grade updated successfully!');
}

function deleteGrade(id) {
    if (confirm('Are you sure you want to delete this grade?')) {
        const grade = grades.find(g => g.id === id);
        
        grades = grades.filter(grade => grade.id !== id);
        
        loadGradesTable();
        updateDashboardStats();
        initCharts(); 
        
        addActivity('Grade deleted', `Grade for ${grade.student} on ${grade.assignment} was deleted`);
        
        showNotification('Grade deleted successfully!');
    }
}

function initAttendance() {
    loadAttendanceTable();
    
    document.getElementById('attendanceDate').addEventListener('change', loadAttendanceTable);
    document.getElementById('attendanceFilterCourse').addEventListener('change', loadAttendanceTable);
}

function loadAttendanceTable() {
    const tableBody = document.querySelector('#attendanceTable tbody');
    tableBody.innerHTML = '';
    
    const dateFilter = document.getElementById('attendanceDate').value;
    const courseFilter = document.getElementById('attendanceFilterCourse').value;
    
    let filteredAttendance = attendance;
    
    if (dateFilter) {
        filteredAttendance = filteredAttendance.filter(record => record.date === dateFilter);
    }
    
    if (courseFilter) {
        filteredAttendance = filteredAttendance.filter(record => record.course === courseFilter);
    }
    
    if (filteredAttendance.length === 0 && dateFilter) {
        let activeStudents = students.filter(student => student.status === 'active');
        
        if (courseFilter) {
            activeStudents = activeStudents.filter(student => student.course === courseFilter);
        }
        
        activeStudents.forEach(student => {
            const newRecord = {
                id: attendance.length ? Math.max(...attendance.map(a => a.id)) + 1 : 1,
                student: student.name,
                course: student.course,
                status: 'absent',
                checkInTime: '',
                date: dateFilter
            };
            
            attendance.push(newRecord);
            filteredAttendance.push(newRecord);
        });
    }
    
    filteredAttendance.forEach(record => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${record.student}</td>
            <td>${record.course}</td>
            <td>
                <select class="attendance-status" data-id="${record.id}">
                    <option value="present" ${record.status === 'present' ? 'selected' : ''}>Present</option>
                    <option value="late" ${record.status === 'late' ? 'selected' : ''}>Late</option>
                    <option value="absent" ${record.status === 'absent' ? 'selected' : ''}>Absent</option>
                </select>
            </td>
            <td>
                <input type="time" class="check-in-time" data-id="${record.id}" value="${record.checkInTime}" ${record.status === 'absent' ? 'disabled' : ''}>
            </td>
            <td class="table-actions">
                <button class="delete-btn" data-id="${record.id}">🗑️</button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
    
    document.querySelectorAll('.attendance-status').forEach(select => {
        select.addEventListener('change', function() {
            const recordId = parseInt(this.getAttribute('data-id'));
            const record = attendance.find(a => a.id === recordId);
            record.status = this.value;
            
            const timeInput = document.querySelector(`.check-in-time[data-id="${recordId}"]`);
            if (this.value === 'absent') {
                timeInput.disabled = true;
                timeInput.value = '';
                record.checkInTime = '';
            } else {
                timeInput.disabled = false;
                if (!timeInput.value && this.value === 'present') {
                    const now = new Date();
                    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
                    timeInput.value = time;
                    record.checkInTime = time;
                }
            }
        });
    });
    
    document.querySelectorAll('.check-in-time').forEach(input => {
        input.addEventListener('change', function() {
            const recordId = parseInt(this.getAttribute('data-id'));
            const record = attendance.find(a => a.id === recordId);
            record.checkInTime = this.value;
        });
    });
    
    document.querySelectorAll('#attendanceTable .delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const recordId = parseInt(btn.getAttribute('data-id'));
            deleteAttendanceRecord(recordId);
        });
    });
}

function navigateAttendanceDate(e) {
    const dateInput = document.getElementById('attendanceDate');
    const currentDate = new Date(dateInput.value);
    
    if (e.target.id === 'prevDateBtn') {
        currentDate.setDate(currentDate.getDate() - 1);
    } else {
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    dateInput.value = `${year}-${month}-${day}`;
    
    loadAttendanceTable();
}

function markAllPresent() {
    const dateFilter = document.getElementById('attendanceDate').value;
    const courseFilter = document.getElementById('attendanceFilterCourse').value;
    
    if (!dateFilter) {
        showNotification('Please select a date first');
        return;
    }
    
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    attendance.forEach(record => {
        if (record.date === dateFilter && (!courseFilter || record.course === courseFilter)) {
            record.status = 'present';
            record.checkInTime = time;
        }
    });
    
    loadAttendanceTable();
    
    showNotification('All students marked present');
}

function saveAttendance() {
    updateDashboardStats();
    
    const dateFilter = document.getElementById('attendanceDate').value;
    const courseFilter = document.getElementById('attendanceFilterCourse').value;
    
    const activityDetails = courseFilter ? 
        `Attendance for ${courseFilter} on ${formatDate(dateFilter)}` : 
        `Attendance for all courses on ${formatDate(dateFilter)}`;
    
    addActivity('Attendance saved', activityDetails);

    showNotification('Attendance saved successfully!');
}

function deleteAttendanceRecord(id) {
    if (confirm('Are you sure you want to delete this attendance record?')) {
        const record = attendance.find(a => a.id === id);
        
        attendance = attendance.filter(a => a.id !== id);
        
        loadAttendanceTable();
        updateDashboardStats();
        
        addActivity('Attendance record deleted', `Attendance record for ${record.student} on ${formatDate(record.date)} was deleted`);
        
        showNotification('Attendance record deleted successfully!');
    }
}