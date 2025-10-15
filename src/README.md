# 🌸 AI Skin Analyzer

A modern, elegant skincare analysis application built with React, TypeScript, and Tailwind CSS.

## 📱 Features

- **Skin Analysis**: AI-powered facial skin analysis with detailed scoring
- **Progress Tracking**: Monitor skin improvement over time with charts and history
- **AI Chat Assistant**: Chat with Dr.SkinAI for personalized skincare advice
- **User Profile**: Manage personal information and skincare goals
- **Mobile-First Design**: Optimized for iPhone 13 (390×844px) with responsive layouts

## 🎨 Design System

### Color Palette
- **Primary Pink**: `#F8E8EE` (Light) → `#FF4FA3` (Accent)
- **Secondary Blue**: `#E9F3FA` (Light) → `#93C5FD` (Accent)
- **Background**: Soft pastel gradients
- **Text**: `#2d3748` (Dark Gray)

### Typography
- **Thai**: Prompt (300, 400, 500, 600)
- **English**: Inter (300, 400, 500, 600)
- **Base Size**: 16px

### Border Radius
- Cards: 24px - 32px
- Buttons: 16px - 24px
- Inputs: 24px (fully rounded)

## 📂 Project Structure

```
ai-skin-analyzer/
├── App.tsx                          # Main application with routing
├── components/
│   ├── BottomNavSkin.tsx           # Bottom navigation bar
│   ├── pages/
│   │   ├── LoginRegisterScreen.tsx  # Login & registration
│   │   ├── SkinHomeDashboard.tsx    # Home dashboard
│   │   ├── FaceScanScreen.tsx       # Face scanning camera
│   │   ├── SkinAnalysisResult.tsx   # Analysis results
│   │   ├── DrSkinAIChatScreen.tsx   # AI chat assistant
│   │   ├── ProfilePage.tsx          # User profile
│   │   ├── HistoryPage.tsx          # Progress history
│   │   └── EditProfilePage.tsx      # Profile editing
│   └── ui/                          # Shadcn UI components
│       ├── button.tsx
│       ├── input.tsx
│       ├── card.tsx
│       └── ... (48 components)
└── styles/
    └── globals.css                  # Tailwind v4 + custom styles
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or 20+ (LTS recommended)
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd ai-skin-analyzer

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📱 Screen Flow

```
Login/Register
    ↓
Home Dashboard → Face Scan → Analysis Result → AI Chat
    ↓              ↓             ↓                ↓
  Profile      History       Profile          Home
```

### Navigation Structure

**Bottom Navigation** (5 tabs):
1. **Home** - Dashboard with skin score and quick stats
2. **Scan** - Face scanning camera interface
3. **History** - Progress tracking with charts
4. **Chat** - AI skincare assistant
5. **Profile** - User settings and information

## 🎯 Key Components

### 1. LoginRegisterScreen
- Tab-based login/register interface
- Social login options (Google, Apple)
- Form validation ready
- Pastel gradient background

### 2. SkinHomeDashboard
- Circular skin score visualization
- Quick stats cards (Wrinkles, Acne, Pigmentation)
- Start scan CTA button
- Personalized greeting

### 3. FaceScanScreen
- Camera view with face detection overlay
- Real-time skin analysis bars
- Progress indicator during analysis
- Help and lighting tips

### 4. SkinAnalysisResult
- Detailed score breakdown
- Radar chart visualization
- Skin type and recommendations
- Chat with AI CTA

### 5. DrSkinAIChatScreen
- Modern chat interface
- AI assistant avatar
- Quick reply buttons
- Pink gradient input bar with attachment support

### 6. ProfilePage
- User information card
- Latest skin score summary
- Personal details grid
- Settings and actions

### 7. HistoryPage
- 7-day progress chart
- Metric filters (Overall, Hydration, Oil, Pores, Wrinkles)
- Scan timeline
- Before/after gallery

### 8. EditProfilePage
- Profile photo upload
- Personal information form
- Skincare details
- Save/cancel actions

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Motion (Framer Motion)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Build Tool**: Vite
- **UI Components**: Shadcn UI (48 components)

## 🎨 Component Library (Shadcn UI)

Available components in `/components/ui`:
- Form elements: Button, Input, Textarea, Select, Checkbox, Radio
- Layout: Card, Separator, Tabs, Accordion, Collapsible
- Feedback: Alert, Toast (Sonner), Progress, Skeleton
- Overlays: Dialog, Sheet, Popover, Tooltip, Dropdown Menu
- Navigation: Breadcrumb, Pagination, Navigation Menu
- Data Display: Table, Badge, Avatar, Calendar
- Charts: Line, Bar, Area, Pie (Recharts integration)

## 📝 Code Quality

### TypeScript
- Full type safety
- Interface definitions for all props
- No `any` types (except where necessary)

### Accessibility
- ARIA labels on interactive elements
- Semantic HTML structure
- Keyboard navigation support
- Screen reader friendly

### Performance
- Code splitting by route
- Lazy loading ready
- Optimized animations
- Minimal re-renders

## 🌐 Browser Support

- Chrome 90+
- Safari 14+
- Firefox 88+
- Edge 90+

## 📦 Build for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build
npm run preview
```

Output files will be in the `dist/` directory.

## 🚢 Deployment

### Recommended Platforms
- **Vercel** (Zero config, auto SSL, CDN)
- **Netlify** (Easy setup, form handling)
- **GitHub Pages** (Free hosting)
- **Firebase Hosting** (Google integration)

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

## 🔧 Environment Variables

Create a `.env` file for API keys (not included):

```env
# API Configuration
VITE_API_BASE_URL=https://api.example.com
VITE_AI_API_KEY=your_api_key_here

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_CHAT=true
```

## 📖 API Integration Guide

### Example: Skin Analysis API

```typescript
// Example API call for skin analysis
const analyzeSkin = async (imageData: string) => {
  const response = await fetch('/api/skin-analysis', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify({ image: imageData })
  });
  
  const result = await response.json();
  return result;
};
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Design inspired by Apple Health and Glow App
- UI components from Shadcn UI
- Icons from Lucide React
- Fonts from Google Fonts (Prompt, Inter)

## 📞 Support

For questions or support, please open an issue in the repository.

---

Made with ❤️ for beautiful skin
