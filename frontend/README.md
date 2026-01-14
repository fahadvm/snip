# Snip - URL Shortener Frontend

A beautiful, modern URL shortener application built with React, TypeScript, and GSAP animations.

## 🚀 Features

### Pages Implemented

1. **Landing Page** (`/`)
   - Hero section with animated gradient text
   - Floating decorative elements
   - Quick URL shortener demo
   - Stats section with animated counters
   - Feature cards with scroll-triggered animations
   - Call-to-action sections

2. **Login Page** (`/login`)
   - Glassmorphism card design
   - Animated form entrance
   - Password visibility toggle
   - Social login options (Google, GitHub)
   - Floating background decorations

3. **Register Page** (`/register`)
   - 3D entrance animations
   - Password strength indicator
   - Terms & conditions checkbox
   - Social signup options
   - Form validation

4. **Dashboard** (`/dashboard`)
   - Animated statistics cards
   - URL creation form with custom alias
   - URL management table
   - Click tracking
   - Quick actions (Copy, QR Code, Analytics, Delete)

5. **Analytics Page** (`/analytics`)
   - Overview cards with key metrics
   - Animated bar chart for clicks over time
   - Donut chart for device distribution
   - Top performing links table
   - Geographic data visualization

## 🎨 Design Features

- **Premium Dark Theme** with custom color palette
- **Glassmorphism Effects** for modern UI
- **GSAP Animations** throughout the application:
  - Entrance animations
  - Scroll-triggered animations
  - Floating elements
  - Chart animations
  - Micro-interactions
- **Gradient Text** and backgrounds
- **Responsive Design** for all screen sizes
- **Custom Icons** using SVG
- **Smooth Transitions** and hover effects

## 🛠️ Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router DOM** - Navigation
- **GSAP** - Animations
- **CSS3** - Styling with custom properties

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎯 Project Structure

```
src/
├── components/
│   ├── Navbar.tsx
│   └── Navbar.css
├── pages/
│   ├── LandingPage.tsx
│   ├── LandingPage.css
│   ├── LoginPage.tsx
│   ├── LoginPage.css
│   ├── RegisterPage.tsx
│   ├── RegisterPage.css
│   ├── Dashboard.tsx
│   ├── Dashboard.css
│   ├── Analytics.tsx
│   └── Analytics.css
├── App.tsx
├── App.css
├── index.css
└── main.tsx
```

## 🎨 Design System

### Color Palette
- Primary: `#667eea` → `#764ba2` (Gradient)
- Secondary: `#f093fb` → `#f5576c` (Gradient)
- Success: `#4facfe` → `#00f2fe` (Gradient)
- Accent: `#fa709a` → `#fee140` (Gradient)

### Typography
- Headings: Space Grotesk
- Body: Inter

### Spacing Scale
- xs: 0.5rem
- sm: 1rem
- md: 1.5rem
- lg: 2rem
- xl: 3rem

## 🌟 Key Components

### Navbar
- Fixed position with scroll effect
- Glassmorphism background on scroll
- Responsive mobile menu
- Animated logo and links

### Cards
- Glassmorphism effect
- Hover animations
- Border glow on hover
- Backdrop blur

### Forms
- Custom styled inputs
- Icon integration
- Password toggle
- Validation states

### Buttons
- Multiple variants (primary, secondary, outline, ghost)
- Ripple effect on click
- Smooth hover transitions

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🎭 Animation Details

### GSAP Animations
- **Timeline animations** for sequential effects
- **Scroll triggers** for on-scroll animations
- **Stagger animations** for list items
- **Counter animations** for statistics
- **Chart animations** for data visualization

### CSS Animations
- Floating elements
- Fade in/out
- Slide in from sides
- Pulse effects
- Smooth transitions

## 🔧 Customization

### Changing Colors
Edit CSS variables in `src/index.css`:
```css
:root {
  --primary: #667eea;
  --secondary: #764ba2;
  /* ... more variables */
}
```

### Modifying Animations
GSAP animations can be customized in each page component's `useEffect` hook.

## 📝 Notes

- This is a **frontend-only** implementation with mock data
- Authentication is simulated (not connected to backend)
- All data is static for demonstration purposes
- Ready to be connected to a backend API

## 🚀 Next Steps

To make this production-ready:
1. Connect to backend API
2. Implement real authentication
3. Add state management (Redux/Zustand)
4. Add form validation library
5. Implement real-time analytics
6. Add QR code generation
7. Implement actual URL shortening logic
8. Add error handling and loading states
9. Add toast notifications
10. Implement protected routes

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Created with ❤️ using React, TypeScript, and GSAP
