# React Authentication Starter Template

A comprehensive, production-ready React TypeScript starter template with authentication, role-based access control, and modern UI components.

## 🚀 Features

### Authentication System
- ✅ **Login & Registration** - Complete user authentication flow
- ✅ **Role-Based Access Control** - Admin, Manager, and User roles
- ✅ **Forgot Password** - Password reset with OTP verification
- ✅ **Email & Mobile Fields** - Complete user profile information
- ✅ **Terms & Conditions** - Checkbox validation during registration
- ✅ **Password Strength Indicator** - Real-time password strength feedback
- ✅ **Remember Me** - Persistent login functionality

### UI Components
- 🎨 **Modern Design** - Beautiful gradient backgrounds and smooth transitions
- 📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile
- 🎯 **Reusable Components** - Input, Button, Select, Checkbox, Card components
- 🔔 **Form Validation** - Built-in validation with error messages
- ⚡ **Loading States** - Loading indicators for async operations

### Navigation
- 📊 **Sidebar Navigation** - Collapsible sidebar for desktop
- 📱 **Bottom Navigation** - Mobile-optimized bottom navigation bar
- 🔐 **Protected Routes** - Route guards based on authentication and roles
- 🎯 **Role-Based Menu Items** - Menu visibility based on user role

### Layout & Pages
- 🏠 **Dashboard** - Statistics, recent activity, and quick actions
- 👥 **Users Management** - User list and management (Admin/Manager only)
- 📈 **Analytics** - Detailed analytics and insights (Admin/Manager only)
- 📄 **Reports** - Generate and download reports
- ⚙️ **Settings** - User profile and preferences management

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn**

## 🛠️ Installation

1. **Clone or download this template:**
   ```bash
   cd starter-template
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser and visit:**
   ```
   http://localhost:5173
   ```

## 📦 Project Structure

```
starter-template/
├── public/                  # Static assets
├── src/
│   ├── components/          # Reusable components
│   │   ├── layout/          # Layout components (Sidebar, BottomNav, MainLayout)
│   │   ├── ui/              # UI components (Button, Input, Card, etc.)
│   │   └── ProtectedRoute.tsx
│   ├── contexts/            # React contexts
│   │   └── AuthContext.tsx  # Authentication context
│   ├── pages/               # Page components
│   │   ├── auth/            # Authentication pages
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── ForgotPassword.tsx
│   │   │   ├── VerifyOTP.tsx
│   │   │   └── ResetPassword.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Users.tsx
│   │   ├── Analytics.tsx
│   │   ├── Reports.tsx
│   │   └── Settings.tsx
│   ├── types/               # TypeScript type definitions
│   │   └── auth.types.ts
│   ├── App.tsx              # Main app component with routing
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## 🎯 Usage Guide

### Authentication Flow

#### 1. Registration
- Navigate to `/register`
- Fill in all required fields:
  - First Name & Last Name
  - Email Address
  - Mobile Number (with country code)
  - Select Role (User, Manager, Admin)
  - Create a strong password
  - Accept Terms & Conditions
- Password strength indicator shows real-time feedback
- Confirmation password must match

#### 2. Login
- Navigate to `/login`
- Enter email and password
- Optional: Check "Remember Me" for persistent login
- Click "Sign In"

#### 3. Forgot Password
- Click "Forgot password?" on login page
- Enter your email address
- Receive OTP (simulated in demo)
- Enter 6-digit OTP code
- Create new password
- Redirected to login

### Role-Based Access Control

Three user roles are supported:

| Role    | Access Level |
|---------|-------------|
| **Admin** | Full access to all pages and features |
| **Manager** | Access to Users, Analytics, Dashboard, Reports, Settings |
| **User** | Access to Dashboard, Reports, Settings |

### Customization

#### Adding New Pages

1. **Create the page component:**
   ```tsx
   // src/pages/NewPage.tsx
   export const NewPage: React.FC = () => {
     return <div>New Page Content</div>;
   };
   ```

2. **Add route in App.tsx:**
   ```tsx
   import { NewPage } from './pages/NewPage';
   
   // Inside MainLayout routes
   <Route path="new-page" element={<NewPage />} />
   ```

3. **Add navigation item in Sidebar.tsx:**
   ```tsx
   const navItems = [
     // ... existing items
     { path: '/new-page', icon: YourIcon, label: 'New Page', roles: ['admin', 'user', 'manager'] },
   ];
   ```

#### Customizing Colors

Edit `tailwind.config.js`:
```js
theme: {
  extend: {
    colors: {
      primary: {
        // Change these values to your brand colors
        500: '#0ea5e9',
        600: '#0284c7',
        700: '#0369a1',
        // ... etc
      },
    },
  },
},
```

#### Adding New UI Components

All reusable UI components are in `src/components/ui/`. Follow the same pattern:
```tsx
// src/components/ui/NewComponent.tsx
import React from 'react';

interface NewComponentProps {
  // Define props
}

export const NewComponent: React.FC<NewComponentProps> = ({ ...props }) => {
  return (
    // Component JSX
  );
};
```

### Backend Integration

This template uses mock authentication. To connect to a real backend:

1. **Update AuthContext.tsx:**
   ```tsx
   const login = async (data: LoginData): Promise<void> => {
     try {
       // Replace with your API call
       const response = await fetch('YOUR_API_URL/login', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(data),
       });
       
       const result = await response.json();
       setUser(result.user);
       localStorage.setItem('token', result.token);
     } catch (error) {
       throw new Error('Login failed');
     }
   };
   ```

2. **Add API service file:**
   ```tsx
   // src/services/api.ts
   const API_BASE_URL = process.env.VITE_API_URL;

   export const api = {
     login: async (data) => {
       // API call implementation
     },
     register: async (data) => {
       // API call implementation
     },
     // ... other API methods
   };
   ```

3. **Add environment variables:**
   ```bash
   # .env
   VITE_API_URL=https://your-api-url.com
   ```

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 📱 Responsive Design

- **Desktop (1024px+)**: Full sidebar navigation
- **Tablet (768px-1023px)**: Collapsible sidebar + bottom navigation
- **Mobile (<768px)**: Bottom navigation only

## 🎨 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router v6** - Routing
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## 🔐 Security Features

- Password strength validation
- Confirm password matching
- Protected routes with authentication checks
- Role-based access control
- Secure token storage in localStorage
- OTP verification for password reset

## 📝 Best Practices Included

- ✅ TypeScript for type safety
- ✅ Component composition and reusability
- ✅ Centralized authentication state management
- ✅ Consistent code structure and naming
- ✅ Responsive design with mobile-first approach
- ✅ Loading states and error handling
- ✅ Clean and maintainable code

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

The build files will be in the `dist/` directory. Deploy this directory to your hosting service:

- **Vercel**: `vercel deploy`
- **Netlify**: `netlify deploy --prod`
- **GitHub Pages**: Use `gh-pages` package
- **Docker**: Create Dockerfile with nginx

## 🤝 Contributing

This is a starter template. Feel free to:
- Customize it for your needs
- Add new features
- Modify existing components
- Change the styling

## 📄 License

This project is open source and available under the MIT License.

## 💡 Tips for Using This Template

1. **Start with Authentication**: The auth flow is ready to use, just connect it to your backend API
2. **Customize Branding**: Update colors, logo, and app name in the codebase
3. **Add Your Pages**: Use the existing pages as reference for creating new ones
4. **Extend Components**: Build upon the existing UI components
5. **Configure Roles**: Adjust role-based permissions as needed for your app

## 🐛 Troubleshooting

### Module not found errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Port already in use
```bash
# Change port in vite.config.ts
export default defineConfig({
  server: {
    port: 3000, // Change this
  },
})
```

## 📞 Support

For issues or questions:
1. Check the code comments for inline documentation
2. Review the TypeScript types for component props
3. Refer to the examples in existing pages

---

**Happy Coding! 🎉**

Save time on your next project by using this starter template. Focus on building features, not boilerplate!
