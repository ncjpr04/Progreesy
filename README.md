# Electron Life Timeline Widget App

A desktop widget application that visualizes your life as a timeline, similar to GitHub's contribution graph, with the following features:

## App Concept: Life Timeline Widget

Create an Electron desktop widget application that visualizes your life as a timeline, similar to GitHub's contribution graph, with the following features:

### Core Features

1. **Timeline Visualization**
   - Display a grid of squares/cells representing days (similar to GitHub's contribution graph)
   - Color-code days based on activity/completion levels
   - Show the current date highlighted
   - Visualize past, present, and future days in different styles

2. **Day Interaction**
   - Clicking on any day opens a detailed view of todos/activities for that day
   - Allow adding, editing, and completing todos for each day
   - Track completion status of todos

3. **Alarm Functionality**
   - Set alarms/reminders for specific todos or times
   - Display notifications when alarms trigger
   - Configure recurring alarms (daily, weekly, etc.)
   - Snooze or dismiss alarm options

4. **Life Perspective Features**
   - Display a "life progress" indicator showing percentage of expected lifespan completed
   - Option to set life expectancy for calculation purposes
   - Visual indication of weeks/months/years passed and remaining

### Technical Requirements

1. **Electron Framework**
   - Create a lightweight, always-on-top widget
   - Allow resizing and repositioning on desktop
   - Implement auto-start on system boot option

2. **Data Storage**
   - Store todos and settings locally
   - Implement data backup/restore functionality
   - Optional cloud sync for multi-device usage

3. **User Interface**
   - Clean, minimalist design
   - Dark/light mode support
   - Customizable color schemes
   - Adjustable opacity for desktop integration

4. **Performance**
   - Minimal resource usage
   - Efficient rendering of timeline grid
   - Background process for alarm monitoring

## Tech Stack

- Next.js
- Electron.js
- TypeScript
- Tailwind CSS
- shadcn UI

## Getting Started

1. Clone this repository
2. Install dependencies with `npm install`
3. Run the development server with `npm run dev`
4. Build the application with `npm run build`

## Project Structure

- `main/` - Electron main process code
- `renderer/` - Next.js application (renderer process)
- `components/` - React components
- `lib/` - Utility functions and shared code
- `styles/` - Global styles and Tailwind configuration #   P r o g r e e s y  
 