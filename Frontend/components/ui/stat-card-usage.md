# StatCard Component Usage Guide

## Overview
The `StatCard` component is a reusable card component with advanced hover effects, glow animations, and multiple color variants. It provides the same professional styling as the contractor dashboard.

## Import
```tsx
import StatCard from '@/components/ui/stat-card';
import { Users, Activity, Shield } from 'lucide-react';
```

## Basic Usage
```tsx
<StatCard
  title="Total Users"
  value={150}
  subtitle="Active this month"
  icon={Users}
  color="blue"
/>
```

## Props

### Required Props
- `title` (string): The main title of the card
- `value` (string | number): The main value to display
- `icon` (LucideIcon): Icon component from lucide-react

### Optional Props
- `subtitle` (string): Additional information below the value
- `color` (string): Color theme for the card
- `className` (string): Additional CSS classes
- `onClick` (function): Click handler for interactive cards

## Available Colors
- `blue` (default): Sky blue gradient
- `green`: Emerald green gradient  
- `orange`: Amber orange gradient
- `red`: Red gradient
- `purple`: Violet purple gradient
- `indigo`: Indigo gradient
- `emerald`: Pure emerald gradient
- `amber`: Pure amber gradient
- `sky`: Pure sky gradient
- `violet`: Pure violet gradient
- `pink`: Pink gradient

## Advanced Examples

### With Click Handler
```tsx
<StatCard
  title="Active Workers"
  value="45"
  subtitle="Currently working"
  icon={Users}
  color="green"
  onClick={() => console.log('Card clicked!')}
/>
```

### Grid Layout Example
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
  <StatCard
    title="Total Users"
    value={150}
    subtitle="Active accounts"
    icon={Users}
    color="blue"
  />
  <StatCard
    title="Active Sessions"
    value="89%"
    subtitle="Online now"
    icon={Activity}
    color="green"
  />
  <StatCard
    title="Security Score"
    value="98%"
    subtitle="Very secure"
    icon={Shield}
    color="purple"
  />
</div>
```

## Features

### Hover Effects
- **Card Lift**: Smooth upward movement on hover
- **Glow Effects**: Outer ring glow and inner light overlays
- **Icon Animation**: Icon scales and rotates on hover
- **Underline Effect**: Animated underline appears under the main value
- **Color Enhancement**: Background gradient intensifies on hover

### Responsive Design
- **Mobile First**: Optimized for all screen sizes
- **Flexible Text**: Responsive typography scaling
- **Adaptive Spacing**: Smart padding and margins
- **Touch Friendly**: Proper touch targets for mobile

### Accessibility
- **Semantic HTML**: Proper structure for screen readers
- **Keyboard Navigation**: Full keyboard support when clickable
- **Focus States**: Visible focus indicators
- **ARIA Labels**: Proper accessibility attributes

## Styling Notes
- Uses Tailwind CSS classes
- Includes custom hover animations
- Supports dark/light theme variations
- Maintains consistency with contractor dashboard design

## Usage in Different Contexts
- **Dashboards**: KPI cards and metrics display
- **Analytics**: Statistics and data visualization
- **Reports**: Summary information cards
- **Admin Panels**: Quick action cards
- **Landing Pages**: Feature highlight cards