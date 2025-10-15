# 📤 Export Guide - AI Skin Analyzer

## ✅ Project Quality Checklist

This project has been optimized with the following best practices:

### 🏗️ Structure & Organization
- ✅ Clear component hierarchy
- ✅ Semantic HTML structure
- ✅ Proper TypeScript types and interfaces
- ✅ Modular component architecture
- ✅ Centralized routing in App.tsx

### 🎨 Styling & Design
- ✅ Consistent Tailwind CSS usage
- ✅ Mobile-first responsive design (390×844px base)
- ✅ Pastel color palette (`#F8E8EE`, `#E9F3FA`)
- ✅ Rounded corners (24px standard)
- ✅ Soft shadows and gradients

### 🔤 Naming Conventions
- ✅ All components in PascalCase
- ✅ All props in camelCase
- ✅ All files named in English
- ✅ Descriptive variable names
- ✅ Clear function names

### ♿ Accessibility
- ✅ ARIA labels on interactive elements
- ✅ Semantic HTML tags (`<nav>`, `<button>`, `<main>`)
- ✅ Keyboard navigation support
- ✅ Screen reader friendly
- ✅ Color contrast compliance

### 📝 Documentation
- ✅ JSDoc comments on functions
- ✅ README with full documentation
- ✅ Type definitions for all props
- ✅ Code comments where needed

---

## 🎯 Component Markup Guide

### Button Components

All buttons in this project follow this pattern:

```tsx
<button
  onClick={handleClick}
  className="w-full h-12 rounded-2xl bg-gradient-to-r from-pink-400 to-pink-500"
  aria-label="Descriptive action label"
  type="button"
>
  Button Text
</button>
```

**Identifiers:**
- Primary CTA: `bg-gradient-to-r from-pink-400 to-pink-500`
- Secondary: `border border-pink-200 text-pink-600`
- Icon buttons: Circular with icon from `lucide-react`

### Input Components

All inputs follow this pattern:

```tsx
<Input
  id="unique-id"
  type="text"
  placeholder="Placeholder text"
  className="h-12 rounded-2xl border-gray-200 focus:border-pink-300"
  aria-label="Input purpose"
/>
```

**Identifiers:**
- Height: `h-12` (48px)
- Border radius: `rounded-2xl` (24px)
- Focus state: `focus:border-pink-300`

### Card Components

All cards follow this pattern:

```tsx
<Card className="bg-white rounded-3xl p-6 shadow-lg border-0">
  <CardContent>
    {/* Card content */}
  </CardContent>
</Card>
```

**Identifiers:**
- Border radius: `rounded-3xl` (32px)
- Padding: `p-6` (24px)
- Shadow: `shadow-lg`

---

## 📱 Screen Specifications

### iPhone 13 Base (390×844px)

All screens are designed for mobile-first:

```tsx
<div className="max-w-md mx-auto">
  {/* Content centered, max 390px width */}
</div>
```

### Safe Areas

Bottom navigation reserves 80px:
```css
pb-24  /* 96px padding-bottom */
```

---

## 🎨 Design Tokens

### Colors

```css
/* Primary */
--pink-50: #FFF5FA
--pink-100: #FFEAF3
--pink-400: #FF4FA3
--pink-500: #EC4899

/* Secondary */
--blue-50: #E9F3FA
--blue-100: #DBEAFE
--purple-50: #F5F3FF

/* Neutral */
--gray-400: #9CA3AF
--gray-600: #4B5563
--gray-800: #1F2937
```

### Spacing

```css
/* Common spacing values */
gap-2: 8px
gap-3: 12px
gap-4: 16px
gap-6: 24px

/* Padding */
p-4: 16px
p-5: 20px
p-6: 24px

/* Margins */
mb-2: 8px
mb-4: 16px
mb-6: 24px
```

### Typography

```css
/* Font sizes */
text-xs: 12px
text-sm: 14px
text-base: 16px
text-lg: 18px
text-xl: 20px
text-2xl: 24px

/* Font weights */
font-normal: 400
font-medium: 500
font-semibold: 600
```

### Border Radius

```css
rounded-full: 9999px (circular)
rounded-2xl: 16px
rounded-3xl: 24px
```

---

## 🔍 Component Mapping

### Main Screens

| Component | File | Purpose |
|-----------|------|---------|
| LoginRegisterScreen | `/components/pages/LoginRegisterScreen.tsx` | Authentication |
| SkinHomeDashboard | `/components/pages/SkinHomeDashboard.tsx` | Main dashboard |
| FaceScanScreen | `/components/pages/FaceScanScreen.tsx` | Camera interface |
| SkinAnalysisResult | `/components/pages/SkinAnalysisResult.tsx` | Results display |
| DrSkinAIChatScreen | `/components/pages/DrSkinAIChatScreen.tsx` | AI chat |
| ProfilePage | `/components/pages/ProfilePage.tsx` | User profile |
| HistoryPage | `/components/pages/HistoryPage.tsx` | Progress tracking |
| EditProfilePage | `/components/pages/EditProfilePage.tsx` | Profile editing |

### Navigation

| Component | File | Purpose |
|-----------|------|---------|
| BottomNavSkin | `/components/BottomNavSkin.tsx` | Bottom navigation |

---

## 📋 Interactive Elements Inventory

### Buttons (by screen)

**LoginRegisterScreen:**
- Login button (primary CTA)
- Register button (primary CTA)
- Google login (outline)
- Apple login (outline)
- Tab switcher (2 buttons)

**SkinHomeDashboard:**
- Start Face Scan (primary CTA, gradient)

**FaceScanScreen:**
- Analyze Now (primary CTA, gradient)
- Back button (icon)
- Help button (icon)
- Lighting button (icon)

**SkinAnalysisResult:**
- Chat with AI (primary CTA, gradient)
- Back button (text link)

**DrSkinAIChatScreen:**
- Send button (circular, pink)
- Microphone button (circular, gray)
- Add attachment button (circular, outlined)
- Quick reply buttons (3, pill-shaped)

**ProfilePage:**
- Edit Profile (outline, pink)
- Change Password (outline)
- Connect Device (outline)
- Logout (outline, red)

**HistoryPage:**
- Metric filters (5, pill-shaped)
- View All (ghost)
- View Full Gallery (outline, purple)

**EditProfilePage:**
- Save Changes (primary CTA, gradient)
- Cancel (outline)
- Change Photo (outline, pink)
- Upload photo button (dashed border)

### Input Fields

**LoginRegisterScreen:**
- Email/Phone input
- Password input
- Confirm Password input
- Full Name input
- Birthday date picker
- Gender select
- Skin Type select
- Photo upload

**DrSkinAIChatScreen:**
- Message input (rounded, with icons)

**EditProfilePage:**
- Full Name input
- Email input
- Age number input
- Gender select
- Skin Type select
- Skincare Goal select

---

## 🎨 Animation Specifications

All animations use **Motion (Framer Motion)**:

```tsx
// Page entrance
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>

// Stagger children
transition={{ delay: index * 0.1 }}

// Spring animation
transition={{ 
  type: 'spring', 
  stiffness: 300, 
  damping: 30 
}}

// Layout animation
<motion.div layoutId="uniqueId" />
```

---

## 📦 Export Checklist

Before exporting to another platform or framework:

- [ ] All text in English
- [ ] All components properly named
- [ ] All buttons have aria-labels
- [ ] All inputs have labels/placeholders
- [ ] Responsive classes applied
- [ ] Colors use design tokens
- [ ] Spacing is consistent
- [ ] Typography follows scale
- [ ] Images have alt text
- [ ] Forms have proper validation
- [ ] Navigation works correctly
- [ ] Build succeeds (`npm run build`)
- [ ] No console errors
- [ ] TypeScript compiles
- [ ] All imports resolved

---

## 🔄 Platform Export Notes

### If exporting to Figma via Locofy:

**Not recommended** - This is already production React code. Locofy converts Figma → Code, not Code → Figma.

### If exporting to React Native:

1. Replace `className` with `style` objects
2. Replace HTML tags with RN components:
   - `<div>` → `<View>`
   - `<button>` → `<TouchableOpacity>`
   - `<input>` → `<TextInput>`
3. Replace Tailwind with StyleSheet
4. Replace Motion with React Native Animated

### If exporting to Vue/Svelte:

1. Convert JSX to template syntax
2. Replace `className` with `class`
3. Update event handlers (onClick → @click)
4. Convert TypeScript interfaces

### If exporting to Next.js:

1. Add `'use client'` to interactive components
2. Convert to App Router if needed
3. Optimize images with next/image
4. Add metadata exports

---

## 📚 Additional Resources

- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Motion Documentation](https://motion.dev)
- [Shadcn UI](https://ui.shadcn.com)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app)

---

**Project Status**: ✅ Production Ready

Last Updated: October 15, 2025
