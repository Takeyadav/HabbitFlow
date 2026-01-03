// ===== Authentication Manager =====
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.users = this.loadUsers();
        this.init();
    }

    init() {
        this.checkAuthStatus();
        this.setupAuthEventListeners();
    }

    loadUsers() {
        const stored = localStorage.getItem('users');
        return stored ? JSON.parse(stored) : {};
    }

    saveUsers() {
        localStorage.setItem('users', JSON.stringify(this.users));
    }

    signup(name, email, password) {
        if (this.users[email]) {
            throw new Error('User already exists');
        }

        const user = {
            id: Date.now(),
            name,
            email,
            password: this.hashPassword(password),
            createdAt: new Date().toISOString()
        };

        this.users[email] = user;
        this.saveUsers();
        return user;
    }

    login(email, password) {
        const user = this.users[email];
        if (!user || user.password !== this.hashPassword(password)) {
            throw new Error('Invalid email or password');
        }
        return user;
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.updateAuthButtons();
        
        // Close profile dropdown
        const profileDropdown = document.getElementById('profileDropdown');
        if (profileDropdown) profileDropdown.classList.remove('show');
        
        // Hide the main app and show the auth container
        const mainApp = document.getElementById('mainApp');
        const authContainer = document.getElementById('authContainer');
        if (mainApp) mainApp.style.display = 'none';
        if (authContainer) authContainer.style.display = 'flex';
        
        // Reset the app instance
        window.app = null;
        
        // Reset form fields
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');
        if (loginForm) loginForm.reset();
        if (signupForm) signupForm.reset();
        
        // Clear any error messages
        const loginError = document.getElementById('loginError');
        const signupError = document.getElementById('signupError');
        if (loginError) loginError.textContent = '';
        if (signupError) signupError.textContent = '';
    }

    setCurrentUser(user) {
        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.updateAuthButtons();
        
        // Hide auth container and show main app
        const mainApp = document.getElementById('mainApp');
        const authContainer = document.getElementById('authContainer');
        if (authContainer) authContainer.style.display = 'none';
        if (mainApp) mainApp.style.display = 'block';
        
        // Initialize the app after successful login
        setTimeout(() => {
            window.app = new HabitTrackerApp(this);
        }, 100);
    }

    getCurrentUser() {
        if (this.currentUser) return this.currentUser;
        
        const stored = localStorage.getItem('currentUser');
        if (stored) {
            this.currentUser = JSON.parse(stored);
            return this.currentUser;
        }
        return null;
    }

    checkAuthStatus() {
        const user = this.getCurrentUser();
        const mainApp = document.getElementById('mainApp');
        const authContainer = document.getElementById('authContainer');
        
        // Always initialize the app (with or without user)
        setTimeout(() => {
            if (!window.app) {
                window.app = new HabitTrackerApp(this);
            }
            
            // Show/hide based on login status
            if (user) {
                // User is logged in - show app, hide auth
                if (mainApp) mainApp.style.display = 'block';
                if (authContainer) authContainer.style.display = 'none';
            } else {
                // User is not logged in - show auth, hide app
                if (mainApp) mainApp.style.display = 'none';
                if (authContainer) authContainer.style.display = 'flex';
            }
            
            this.updateAuthButtons();
        }, 100);
    }

    openAuthModal() {
        this.showAuthContainer();
    }

    closeAuthModal() {
        this.hideAuthContainer();
    }

    showAuthContainer() {
        const authContainer = document.getElementById('authContainer');
        if (authContainer) {
            authContainer.style.display = 'flex';
        }
    }

    hideAuthContainer() {
        const authContainer = document.getElementById('authContainer');
        if (authContainer) {
            authContainer.style.display = 'none';
        }
    }

    showAuth() {
        this.openAuthModal();
    }

    showMainApp() {
        // Main app is shown by default
    }

    hashPassword(password) {
        // Simple hash for demo purposes - in production, use proper hashing
        return btoa(password);
    }

    setupAuthEventListeners() {
        // Tab switching
        const loginTab = document.getElementById('loginTab');
        const signupTab = document.getElementById('signupTab');
        
        if (loginTab) {
            loginTab.onclick = () => {
                this.switchTab('login');
            };
        }
        
        if (signupTab) {
            signupTab.onclick = () => {
                this.switchTab('signup');
            };
        }

        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.onsubmit = (e) => {
                e.preventDefault();
                this.handleLogin();
            };
        }

        // Signup form
        const signupForm = document.getElementById('signupForm');
        if (signupForm) {
            signupForm.onsubmit = (e) => {
                e.preventDefault();
                this.handleSignup();
            };
        }
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.onclick = () => {
                this.logout();
            };
        }

        // Login button
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.onclick = () => {
                this.openAuthModal();
            };
        }
    }

    // Update button visibility based on auth state
    updateAuthButtons() {
        const loginBtn = document.getElementById('loginBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        const profileDropdownContainer = document.querySelector('.profile-dropdown-container');
        const profileDropdown = document.getElementById('profileDropdown');
        const user = this.getCurrentUser();

        if (user) {
            // User is logged in
            if (loginBtn) loginBtn.style.display = 'none';
            if (logoutBtn) logoutBtn.style.display = 'none';
            if (profileDropdownContainer) profileDropdownContainer.style.display = 'inline-block';
        } else {
            // User is not logged in
            if (loginBtn) loginBtn.style.display = 'inline-block';
            if (logoutBtn) logoutBtn.style.display = 'none';
            if (profileDropdownContainer) profileDropdownContainer.style.display = 'none';
            if (profileDropdown) profileDropdown.classList.remove('show');
        }
    }

    switchTab(tab) {
        const loginTab = document.getElementById('loginTab');
        const signupTab = document.getElementById('signupTab');
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');

        if (tab === 'login') {
            loginTab.classList.add('active');
            signupTab.classList.remove('active');
            loginForm.classList.add('active');
            signupForm.classList.remove('active');
        } else {
            signupTab.classList.add('active');
            loginTab.classList.remove('active');
            signupForm.classList.add('active');
            loginForm.classList.remove('active');
        }
    }

    handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const errorDiv = document.getElementById('loginError');

        try {
            const user = this.login(email, password);
            this.setCurrentUser(user);
            errorDiv.textContent = '';
            document.getElementById('loginForm').reset();
            this.hideAuthContainer();
        } catch (error) {
            errorDiv.textContent = error.message;
        }
    }

    handleSignup() {
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;
        const errorDiv = document.getElementById('signupError');

        if (password !== confirmPassword) {
            errorDiv.textContent = 'Passwords do not match';
            return;
        }

        if (password.length < 6) {
            errorDiv.textContent = 'Password must be at least 6 characters';
            return;
        }

        try {
            const user = this.signup(name, email, password);
            this.setCurrentUser(user);
            errorDiv.textContent = '';
            document.getElementById('signupForm').reset();
            this.hideAuthContainer();
        } catch (error) {
            errorDiv.textContent = error.message;
        }
    }
}

// ===== Habit Tracker App =====
class HabitTrackerApp {
    constructor(authManager) {
        this.authManager = authManager;
        this.currentUser = this.authManager.getCurrentUser();
        this.habits = this.loadHabits();
        this.completions = this.loadCompletions();
        this.isDarkMode = this.loadDarkMode();
        this.currentMonth = new Date();
        this.chartInstance = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.applyDarkMode();
        this.updateCurrentMonth();
        this.render();
    }

    // ===== Data Management =====
    getStorageKey(key) {
        // User-specific storage keys
        if (!this.currentUser) return null;
        return `${this.currentUser.email}_${key}`;
    }

    loadHabits() {
        if (!this.currentUser) return [];
        const stored = localStorage.getItem(this.getStorageKey('habits'));
        return stored ? JSON.parse(stored) : [];
    }

    loadCompletions() {
        if (!this.currentUser) return {};
        const stored = localStorage.getItem(this.getStorageKey('completions'));
        return stored ? JSON.parse(stored) : {};
    }

    loadDarkMode() {
        if (!this.currentUser) return true; // Default dark mode
        const stored = localStorage.getItem(this.getStorageKey('darkMode'));
        return stored !== null ? JSON.parse(stored) : true;
    }

    saveHabits() {
        if (!this.currentUser) return;
        localStorage.setItem(this.getStorageKey('habits'), JSON.stringify(this.habits));
    }

    saveCompletions() {
        if (!this.currentUser) return;
        localStorage.setItem(this.getStorageKey('completions'), JSON.stringify(this.completions));
    }

    saveDarkMode() {
        if (!this.currentUser) return;
        localStorage.setItem(this.getStorageKey('darkMode'), JSON.stringify(this.isDarkMode));
    }

    // ===== Habit Management =====
    addHabit(name, category = 'other', emoji = '🎯') {
        const habit = {
            id: Date.now(),
            name,
            category,
            emoji,
            createdDate: new Date().toISOString()
        };
        this.habits.push(habit);
        this.saveHabits();
        return habit;
    }

    deleteHabit(id) {
        this.habits = this.habits.filter(h => h.id !== id);
        delete this.completions[id];
        this.saveHabits();
        this.saveCompletions();
    }

    toggleCompletion(habitId, date) {
        if (!this.completions[habitId]) {
            this.completions[habitId] = {};
        }

        const dateStr = this.formatDate(date);
        if (this.completions[habitId][dateStr]) {
            delete this.completions[habitId][dateStr];
        } else {
            this.completions[habitId][dateStr] = true;
        }

        this.saveCompletions();
    }

    isCompleted(habitId, date) {
        const dateStr = this.formatDate(date);
        return this.completions[habitId] && this.completions[habitId][dateStr];
    }

    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    parseDate(dateStr) {
        const [year, month, day] = dateStr.split('-').map(Number);
        return new Date(year, month - 1, day);
    }

    // ===== Statistics =====
    getHabitCompletionPercentage(habitId) {
        if (!this.completions[habitId]) return 0;

        const daysInMonth = this.getDaysInMonth(this.currentMonth);
        const completionCount = Object.keys(this.completions[habitId]).filter(dateStr => {
            const date = this.parseDate(dateStr);
            return date.getMonth() === this.currentMonth.getMonth() &&
                   date.getFullYear() === this.currentMonth.getFullYear();
        }).length;

        return Math.round((completionCount / daysInMonth) * 100);
    }

    getDaysInMonth(date) {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    }

    getTodayCompletion() {
        const today = new Date();
        const todayStr = this.formatDate(today);
        let completed = 0;

        this.habits.forEach(habit => {
            if (this.completions[habit.id] && this.completions[habit.id][todayStr]) {
                completed++;
            }
        });

        return this.habits.length > 0 ? Math.round((completed / this.habits.length) * 100) : 0;
    }

    // ===== Event Listeners =====
    setupEventListeners() {
        const self = this;

        // Add habit button
        const addHabitBtn = document.getElementById('addHabitBtn');
        if (addHabitBtn) {
            addHabitBtn.onclick = function() {
                if (!self.authManager.getCurrentUser()) {
                    self.authManager.openAuthModal();
                    return;
                }
                self.openHabitModal();
            };
        }

        // Habit form
        const habitForm = document.getElementById('habitForm');
        if (habitForm) {
            habitForm.onsubmit = function(e) {
                e.preventDefault();
                const nameInput = document.getElementById('habitName');
                const categorySelect = document.getElementById('habitCategory');
                const emojiInput = document.getElementById('habitEmoji');
                
                if (!nameInput || !nameInput.value.trim()) {
                    alert('Please enter a habit name');
                    return;
                }

                const name = nameInput.value.trim();
                const category = categorySelect ? categorySelect.value : 'other';
                const emoji = (emojiInput && emojiInput.value) ? emojiInput.value : '🎯';

                self.addHabit(name, category, emoji);
                habitForm.reset();
                if (emojiInput) emojiInput.value = '🎯';
                self.closeModal('habitModal');
                self.render();
            };
        }

        // Dark mode toggle (settings modal)
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.onchange = function() {
                self.toggleDarkMode();
            };
        }

        // Dark mode button (nav bar)
        const darkModeBtn = document.getElementById('darkModeBtn');
        if (darkModeBtn) {
            darkModeBtn.onclick = function() {
                self.toggleDarkMode();
            };
        }

        // Month navigation
        const monthNavPrev = document.getElementById('monthNavPrev');
        if (monthNavPrev) {
            monthNavPrev.onclick = function() {
                self.currentMonth.setMonth(self.currentMonth.getMonth() - 1);
                self.updateCurrentMonth();
                self.render();
            };
        }

        const monthNavNext = document.getElementById('monthNavNext');
        if (monthNavNext) {
            monthNavNext.onclick = function() {
                self.currentMonth.setMonth(self.currentMonth.getMonth() + 1);
                self.updateCurrentMonth();
                self.render();
            };
        }

        // Export buttons
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.onclick = function() {
                self.openModal('exportModal');
            };
        }

        const exportCsvBtn = document.getElementById('exportCsvBtn');
        if (exportCsvBtn) {
            exportCsvBtn.onclick = function() {
                self.exportCSV();
            };
        }

        const exportJsonBtn = document.getElementById('exportJsonBtn');
        if (exportJsonBtn) {
            exportJsonBtn.onclick = function() {
                self.exportJSON();
            };
        }

        // Settings button
        const settingsBtn = document.getElementById('settingsBtn');
        if (settingsBtn) {
            settingsBtn.onclick = function() {
                self.openModal('settingsModal');
            };
        }

        // Profile button - toggle dropdown
        const profileBtn = document.getElementById('profileBtn');
        const profileDropdown = document.getElementById('profileDropdown');
        if (profileBtn) {
            profileBtn.onclick = (e) => {
                e.stopPropagation();
                const user = self.authManager.getCurrentUser();
                if (user) {
                    // Update dropdown with user info
                    const userNameEl = document.getElementById('profileUserName');
                    const userEmailEl = document.getElementById('profileUserEmail');
                    if (userNameEl) userNameEl.textContent = user.name;
                    if (userEmailEl) userEmailEl.textContent = user.email;
                    
                    // Toggle dropdown
                    if (profileDropdown) {
                        profileDropdown.classList.toggle('show');
                    }
                }
            };
        }
        
        // Dropdown logout button
        const dropdownLogoutBtn = document.getElementById('dropdownLogoutBtn');
        if (dropdownLogoutBtn) {
            dropdownLogoutBtn.onclick = () => {
                self.authManager.logout();
            };
        }
        
        // Close dropdown when clicking outside
        if (profileDropdown) {
            document.addEventListener('click', (e) => {
                if (!profileDropdown.contains(e.target) && !profileBtn.contains(e.target)) {
                    profileDropdown.classList.remove('show');
                }
            });
        }

        // Reset data
        const resetDataBtn = document.getElementById('resetDataBtn');
        if (resetDataBtn) {
            resetDataBtn.onclick = function() {
                if (confirm('Are you sure? This will delete all habits and progress.')) {
                    self.habits = [];
                    self.completions = {};
                    self.saveHabits();
                    self.saveCompletions();
                    self.render();
                    self.closeModal('settingsModal');
                }
            };
        }

        // Modal close buttons
        const closeButtons = document.querySelectorAll('.modal-close');
        closeButtons.forEach(btn => {
            btn.onclick = function(e) {
                e.preventDefault();
                const modal = this.closest('.modal');
                if (modal) {
                    modal.classList.remove('show');
                }
            };
        });

        // Modal cancel buttons
        const cancelButtons = document.querySelectorAll('.modal-cancel');
        cancelButtons.forEach(btn => {
            btn.onclick = function(e) {
                e.preventDefault();
                const modal = this.closest('.modal');
                if (modal) {
                    modal.classList.remove('show');
                }
            };
        });

        // Close modal when clicking outside
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.onclick = function(e) {
                if (e.target === this) {
                    this.classList.remove('show');
                }
            };
        });
    }

    // ===== Modal Management =====
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
        }
    }

    openHabitModal() {
        const habitForm = document.getElementById('habitForm');
        if (habitForm) {
            habitForm.reset();
        }

        const emojiInput = document.getElementById('habitEmoji');
        if (emojiInput) {
            emojiInput.value = '🎯';
        }

        this.openModal('habitModal');

        const nameInput = document.getElementById('habitName');
        if (nameInput) {
            setTimeout(() => nameInput.focus(), 100);
        }
    }

    // ===== UI Management =====
    toggleDarkMode() {
        this.isDarkMode = !this.isDarkMode;
        this.saveDarkMode();
        this.applyDarkMode();
    }

    applyDarkMode() {
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (this.isDarkMode) {
            document.body.classList.remove('light-mode');
            if (darkModeToggle) darkModeToggle.checked = true;
        } else {
            document.body.classList.add('light-mode');
            if (darkModeToggle) darkModeToggle.checked = false;
        }
    }

    updateCurrentMonth() {
        const currentMonthElement = document.getElementById('currentMonth');
        if (currentMonthElement) {
            const options = { month: 'long', year: 'numeric' };
            currentMonthElement.textContent = this.currentMonth.toLocaleDateString('en-US', options);
        }
    }

    // ===== Rendering =====
    render() {
        this.renderHabitsSidebar();
        this.renderTracker();
        this.renderChart();
        this.renderMonthlyCompletionChart();
    }

    renderHabitsSidebar() {
        const container = document.getElementById('habitsSidebarList');
        if (!container) return;

        if (this.habits.length === 0) {
            container.innerHTML = '<p style="opacity: 0.6; padding: 1rem; text-align: center;">No habits yet. Click + to add one!</p>';
            return;
        }

        let html = '';
        this.habits.forEach(habit => {
            html += `
                <div class="habit-sidebar-item">
                    <div class="habit-sidebar-item-name">
                        <span class="habit-sidebar-emoji">${habit.emoji}</span>
                        <span>${habit.name}</span>
                    </div>
                    <button class="habit-sidebar-delete" data-habit-id="${habit.id}">✕</button>
                </div>
            `;
        });

        container.innerHTML = html;

        // Attach delete listeners
        container.querySelectorAll('.habit-sidebar-delete').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                const habitId = parseInt(btn.dataset.habitId);
                if (confirm('Delete this habit?')) {
                    this.deleteHabit(habitId);
                    this.render();
                }
            };
        });
    }

    renderTracker() {
        const container = document.getElementById('trackerTable');
        if (!container) return;

        const daysInMonth = this.getDaysInMonth(this.currentMonth);

        if (this.habits.length === 0) {
            container.innerHTML = `
                <div style="padding: 3rem; text-align: center; color: var(--light-text); opacity: 0.6;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">📋</div>
                    <p>No habits yet. Click the + button to create your first habit!</p>
                </div>
            `;
            return;
        }

        let html = '<table style="width: 100%; border-collapse: collapse;">';

        // Header row with dates
        html += '<tr>';
        html += '<th class="tracker-header" style="position: sticky; left: 0; z-index: 15; background-color: var(--light-bg);">Day</th>';

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), day);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' }).substring(0, 1);
            html += `<th class="tracker-header">${dayName}<br>${day}</th>`;
        }

        html += '<th class="tracker-header">%</th>';
        html += '</tr>';

        // Habit rows
        this.habits.forEach(habit => {
            html += '<tr class="tracker-row">';
            html += `<td class="tracker-habit-name">
                        <span class="habit-emoji">${habit.emoji}</span>${habit.name}
                    </td>`;

            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), day);
                const dateStr = this.formatDate(date);
                const isChecked = this.isCompleted(habit.id, date) ? 'checked' : '';

                html += `
                    <td class="tracker-cell" data-habit-id="${habit.id}" data-date="${dateStr}">
                        <input type="checkbox" class="tracker-checkbox" ${isChecked}>
                    </td>
                `;
            }

            const percentage = this.getHabitCompletionPercentage(habit.id);
            html += `
                <td class="tracker-percentage">
                    <div class="percentage-with-icon">
                        <span>${percentage}%</span>
                    </div>
                </td>
            `;
            html += '</tr>';
        });

        html += '</table>';
        container.innerHTML = html;

        // Attach event listeners to checkboxes
        this.attachCheckboxListeners();
    }

    attachCheckboxListeners() {
        const self = this;

        document.querySelectorAll('.tracker-checkbox').forEach(checkbox => {
            checkbox.onchange = function(e) {
                if (!self.authManager.getCurrentUser()) {
                    self.authManager.openAuthModal();
                    this.checked = false;
                    return;
                }

                const cell = this.closest('.tracker-cell');
                if (!cell) return;

                const habitId = parseInt(cell.dataset.habitId);
                const dateStr = cell.dataset.date;
                const date = self.parseDate(dateStr);

                // Check if unchecking (removing tick mark)
                if (!this.checked && self.isCompleted(habitId, date)) {
                    if (confirm('Are you sure you want to remove this tick mark?')) {
                        self.toggleCompletion(habitId, date);
                        self.renderChart();
                    } else {
                        // If user cancels, restore the checked state
                        this.checked = true;
                    }
                } else {
                    // Adding a new tick mark (no confirmation needed)
                    self.toggleCompletion(habitId, date);
                    self.renderChart();
                }
            };
        });

        // Also allow clicking on the entire cell to toggle
        document.querySelectorAll('.tracker-cell').forEach(cell => {
            cell.onclick = function(e) {
                const checkbox = this.querySelector('.tracker-checkbox');
                if (checkbox && e.target !== checkbox) {
                    checkbox.click();
                }
            };
        });
    }

    // ===== Chart Functions =====
    renderChart() {
        const daysInMonth = this.getDaysInMonth(this.currentMonth);
        const data = [];

        // Calculate completion percentage for each day
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), day);
            let completed = 0;

            this.habits.forEach(habit => {
                if (this.isCompleted(habit.id, date)) {
                    completed++;
                }
            });

            const percentage = this.habits.length > 0
                ? Math.round((completed / this.habits.length) * 100)
                : 0;
            data.push(percentage);
        }

        // Update donut chart (both top and bottom)
        const overallPercentage = this.getOverallCompletion();
        this.updateDonutChart(overallPercentage);

        // Render line chart
        this.renderLineChart(data);
        this.renderMonthlyCompletionChart();
    }

    getOverallCompletion() {
        const daysInMonth = this.getDaysInMonth(this.currentMonth);
        let totalCompletions = 0;
        const maxPossibleCompletions = this.habits.length * daysInMonth;

        this.habits.forEach(habit => {
            if (this.completions[habit.id]) {
                const monthCompletions = Object.keys(this.completions[habit.id]).filter(dateStr => {
                    const date = this.parseDate(dateStr);
                    return date.getMonth() === this.currentMonth.getMonth() &&
                           date.getFullYear() === this.currentMonth.getFullYear();
                }).length;
                totalCompletions += monthCompletions;
            }
        });

        return this.habits.length > 0
            ? Math.round((totalCompletions / maxPossibleCompletions) * 100)
            : 0;
    }

    updateDonutChart(percentage) {
        const circle = document.getElementById('donutProgress');
        const textElement = document.querySelector('#donutChart text');

        if (circle && textElement) {
            const circumference = 2 * Math.PI * 45;
            const strokeDasharray = (percentage / 100) * circumference;

            circle.style.strokeDasharray = `${strokeDasharray} ${circumference}`;
            textElement.textContent = percentage + '%';
        }
    }

    renderLineChart(data) {
        const canvas = document.getElementById('completionChart');
        if (!canvas) return;

        // Destroy existing chart if it exists
        if (window.completionChartInstance) {
            window.completionChartInstance.destroy();
        }

        const daysInMonth = this.getDaysInMonth(this.currentMonth);
        const labels = Array.from({length: daysInMonth}, (_, i) => i + 1);

        window.completionChartInstance = new Chart(canvas, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Completion %',
                    data: data,
                    borderColor: '#4f46e5',
                    backgroundColor: 'rgba(79, 70, 229, 0.05)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 3,
                    pointBackgroundColor: '#4f46e5',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointHoverRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    filler: {
                        propagate: true
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    // ===== Export Functions =====
    exportCSV() {
        let csv = 'Habit,Category,Completions\n';

        const daysInMonth = this.getDaysInMonth(this.currentMonth);

        this.habits.forEach(habit => {
            const count = this.completions[habit.id] ? Object.keys(this.completions[habit.id]).length : 0;
            csv += `"${habit.name}","${habit.category}",${count}\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        this.downloadFile(blob, 'habits-export.csv');
    }

    exportJSON() {
        const data = {
            habits: this.habits,
            completions: this.completions,
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        this.downloadFile(blob, 'habits-export.json');
    }

    downloadFile(blob, filename) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }

    // ===== Monthly Completion Chart =====
    renderMonthlyCompletionChart() {
        const canvas = document.getElementById('monthlyCompletionChart');
        if (!canvas) return;

        // Destroy existing chart if it exists
        if (window.monthlyCompletionChartInstance) {
            window.monthlyCompletionChartInstance.destroy();
        }

        if (this.habits.length === 0) {
            // Show empty state
            canvas.parentElement.innerHTML = '<p style="text-align: center; opacity: 0.6; padding: 2rem;">No habits to display. Add a habit to see monthly completion data.</p>';
            return;
        }

        // Calculate total completions for each habit
        const labels = this.habits.map(h => h.emoji + ' ' + h.name);
        const data = this.habits.map(habit => {
            const daysInMonth = this.getDaysInMonth(this.currentMonth);
            if (!this.completions[habit.id]) return 0;
            
            const monthCompletions = Object.keys(this.completions[habit.id]).filter(dateStr => {
                const date = this.parseDate(dateStr);
                return date.getMonth() === this.currentMonth.getMonth() &&
                       date.getFullYear() === this.currentMonth.getFullYear();
            }).length;
            
            return monthCompletions;
        });

        const maxDays = this.getDaysInMonth(this.currentMonth);
        const backgroundColors = this.habits.map((_, index) => {
            const colors = ['#818cf8', '#a78bfa', '#c084fc', '#e879f9', '#f472b6', '#fb7185', '#fca5a5', '#fbbf24'];
            return colors[index % colors.length];
        });

        window.monthlyCompletionChartInstance = new Chart(canvas, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Completions (Days)',
                    data: data,
                    backgroundColor: backgroundColors,
                    borderColor: backgroundColors.map(color => color.replace('55%', '75%')),
                    borderWidth: 2,
                    borderRadius: 6,
                    hoverBackgroundColor: backgroundColors.map(color => color.replace('55%', '70%')),
                    hoverBorderWidth: 3,
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: { size: 12 },
                            usePointStyle: true,
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        cornerRadius: 6,
                        titleFont: { size: 13 },
                        bodyFont: { size: 12 },
                        callbacks: {
                            label: function(context) {
                                return context.parsed.x + ' / ' + maxDays + ' days';
                            },
                            afterLabel: function(context) {
                                const percentage = Math.round((context.parsed.x / maxDays) * 100);
                                return percentage + '% completion';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        max: maxDays,
                        ticks: {
                            callback: function(value) {
                                return value + ' days';
                            },
                            color: 'rgba(241, 245, 249, 0.7)',
                            font: { size: 11 }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)',
                            drawBorder: false
                        }
                    },
                    y: {
                        ticks: {
                            color: 'rgba(241, 245, 249, 0.7)',
                            font: { size: 11 }
                        },
                        grid: {
                            display: false,
                            drawBorder: false
                        }
                    }
                }
            }
        });
    }
}

// Initialize auth manager
const authManager = new AuthManager();
let app = null;

// The app will be initialized by authManager when:
// 1. User logs in (setCurrentUser)
// 2. Page loads with existing session (checkAuthStatus)
