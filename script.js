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




// Theme switcher
document.getElementById('themeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const isDarkTheme = document.body.classList.contains('dark-theme');
    localStorage.setItem('darkTheme', isDarkTheme);
});
document.addEventListener('DOMContentLoaded', () => {
    const isDarkTheme = localStorage.getItem('darkTheme') === 'true';
    if (isDarkTheme) {
        document.body.classList.add('dark-theme');
    }});