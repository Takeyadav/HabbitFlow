# 🎯 HabitFlow - Habit Tracker with Authentication

A professional habit tracking application with user authentication, activity tracking, and data visualization.

## ✨ Features

### 🔐 Authentication System
- **Sign Up**: Create new user accounts with email and password
- **Login**: Secure login with email and password validation
- **User-Specific Data**: Each user's habits and activities are isolated and stored separately
- **Local Storage**: All data is stored in browser's localStorage in JSON format
- **Session Management**: Current user session is maintained across page reloads

### 📊 Habit Tracking
- Create and manage multiple habits with custom emojis
- Track daily completion status with an interactive calendar view
- View habit completion statistics and percentages
- Monitor daily and monthly progress with visual charts

### 📈 Analytics & Reports
- Daily completion trend line chart
- Monthly completion bar chart by habit
- Overall progress donut chart
- Completion percentage statistics per habit

### 🎨 User Experience
- Dark/Light mode toggle
- Responsive design for all devices
- Smooth animations and transitions
- Intuitive UI with clear navigation

### 💾 Data Management
- Export data to CSV format
- Export data to JSON format
- Reset all personal data
- Automatic data persistence

## 🏗️ Project Structure

```
Habbit/
├── index.html          # Main HTML file with authentication UI
├── script.js           # JavaScript with AuthManager & HabitTrackerApp classes
├── styles.css          # Complete CSS styling
└── README.md          # This documentation
```

## 🔄 Data Flow Architecture

### Authentication Flow
1. **User signup/login** → AuthManager validates credentials
2. **User stored in localStorage** under key: `users` (JSON format)
3. **Current user session stored** under key: `currentUser` (JSON format)
4. **Main app displays** only after successful authentication

### User-Specific Data Storage
Each user's data is stored with a unique prefix using their email address:
- `{userEmail}_habits` - User's habit list
- `{userEmail}_completions` - User's daily completions
- `{userEmail}_darkMode` - User's theme preference

Example localStorage structure:
```json
{
  "users": {
    "user@example.com": {
      "id": 1704220000000,
      "name": "John Doe",
      "email": "user@example.com",
      "password": "base64_encoded_password",
      "createdAt": "2026-01-03T10:00:00.000Z"
    }
  },
  "currentUser": {
    "id": 1704220000000,
    "name": "John Doe",
    "email": "user@example.com",
    "password": "base64_encoded_password",
    "createdAt": "2026-01-03T10:00:00.000Z"
  },
  "user@example.com_habits": [
    {
      "id": 1704220000000,
      "name": "Morning Meditation",
      "emoji": "🧘",
      "category": "mindfulness",
      "createdDate": "2026-01-03T10:00:00.000Z"
    }
  ],
  "user@example.com_completions": {
    "1704220000000": {
      "2026-01-03": true,
      "2026-01-02": true
    }
  }
}
```

## 🎯 Class Structure

### AuthManager Class
Handles all authentication operations:
- `signup(name, email, password)` - Register new user
- `login(email, password)` - Authenticate user
- `logout()` - End user session
- `getCurrentUser()` - Get current logged-in user
- `checkAuthStatus()` - Check if user is authenticated

### HabitTrackerApp Class
Manages habit tracking functionality:
- `addHabit(name, category, emoji)` - Create new habit
- `deleteHabit(id)` - Remove habit
- `toggleCompletion(habitId, date)` - Mark habit complete for a date
- `getHabitCompletionPercentage(habitId)` - Calculate habit completion %
- `exportCSV()` - Export data as CSV
- `exportJSON()` - Export data as JSON

## 🔐 Security Considerations

**Note**: This is a client-side demo application. For production use:
1. Use proper password hashing (bcrypt, argon2) on the backend
2. Implement server-side authentication with tokens (JWT)
3. Never store plain passwords in localStorage
4. Use HTTPS for all communication
5. Implement proper session management
6. Add CSRF protection
7. Use secure storage mechanisms

## 🚀 Getting Started

### Installation
1. Clone or download the project files
2. Ensure all three files are in the same directory:
   - `index.html`
   - `script.js`
   - `styles.css`

### Usage
1. Open `index.html` in a web browser
2. Click "Sign Up" to create a new account
3. Enter your name, email, and password
4. Click "Sign Up" to complete registration
5. Login with your credentials
6. Start creating and tracking your habits!

### Demo Users
For testing, you can:
1. Create a new account with any email/password
2. Add habits and track them
3. Switch users by logging out and logging in with another account
4. Each user will see only their own habits and data

## 📋 How to Use

### Adding a Habit
1. Click the **"+"** button in the sidebar
2. Enter habit name, select category, choose emoji
3. Click "Add Habit"

### Tracking Progress
1. Click on calendar cells to mark habits as complete for that day
2. Cells turn highlighted when marked complete
3. Hover over cells to see the current status

### Viewing Analytics
- **Completion Trend**: Line chart showing daily completion %
- **Monthly Summary**: Bar chart showing completions per habit
- **Overall Progress**: Donut chart showing overall completion %

### Exporting Data
1. Click "📥 Export" button
2. Choose between CSV and JSON formats
3. File downloads automatically

### Settings
1. Click "⚙️ Settings"
2. Toggle dark mode
3. Reset all data (careful - this is irreversible!)
4. Export data to CSV or JSON

## 🎨 Customization

### Adding New Categories
Edit the category options in the habit modal in `index.html`:
```html
<select id="habitCategory">
    <option value="health">Health</option>
    <option value="productivity">Productivity</option>
    <!-- Add more here -->
</select>
```

### Changing Colors
Modify CSS variables in `styles.css`:
```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #818cf8;
    --danger-color: #f87171;
    /* ... more variables */
}
```

### Adjusting Dark Mode Colors
Edit the `body.light-mode` section in `styles.css`

## 🐛 Troubleshooting

### Data Not Saving
- Check if browser allows localStorage
- Ensure JavaScript is enabled
- Check browser console for errors

### Login Issues
- Verify email and password are correct
- Check if account exists (try signing up first)
- Clear localStorage and start fresh if needed

### Charts Not Displaying
- Ensure Chart.js CDN link is accessible
- Check browser console for library errors
- Verify chart canvas elements exist in HTML

## 📝 Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 💡 Tips

1. **Regular Backups**: Export your data regularly
2. **Consistent Tracking**: Log in daily for best results
3. **Dark Mode**: Use for better visibility in low light
4. **Categories**: Use categories to organize habits by type
5. **Emojis**: Use emojis to make your habits more visual and memorable

## 🎓 Developer Notes

### Adding New Features
1. Extend `AuthManager` for auth features
2. Extend `HabitTrackerApp` for habit tracking features
3. Add CSS styles with proper dark mode support
4. Test with multiple users to ensure data isolation

### Performance Optimization
- LocalStorage is suitable for small datasets
- For large data, consider IndexedDB
- Consider implementing data compression for exports

### Future Enhancements
- Backend API integration
- Cloud synchronization
- Mobile app version
- Advanced analytics
- Habit reminders and notifications
- Social sharing features
- Habit recommendations AI

## 📄 License

This project is free to use and modify for personal and educational purposes.

## 🤝 Support

For issues or questions:
1. Check the browser console (F12 → Console tab)
2. Review the troubleshooting section
3. Verify all files are in the correct location
4. Clear browser cache and localStorage

---

**Made with ❤️ as a professional habit tracking solution**
