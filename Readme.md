# Quiz App - Interactive React Quiz Application

A modern, responsive quiz application built with React and Next.js that fetches questions from the Open Trivia Database API. Features include timed questions, difficulty selection, score tracking, and persistent high scores.

Live-Link : [https://quizassignment.vercel.app/]

### Installation
\`\`\`bash
1.# Clone the repository
git clone [repository-url]

2.# Install dependencies
npm install

3.# Start development server
npm run dev
\`\`\`


##  Features

### Core Functionality
- **Dynamic Question Loading**: Fetches 8 multiple-choice questions from Open Trivia DB API
- **Real-time Scoring**: Tracks correct/incorrect answers with detailed feedback
- **Question Timer**: 30-second countdown per question with auto-advance
- **Progress Tracking**: Visual progress bar showing quiz completion status
- **Results Summary**: Comprehensive results page with question review

### Enhanced Features
- **Difficulty Selection**: Choose from Easy, Medium, Hard, or Mixed difficulty levels
- **Persistent High Scores**: Local storage integration for score history
- **Responsive Design**: Optimized for desktop and mobile devices
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support
- **Smooth Animations**: Fade transitions and interactive feedback
- **Offline Fallback**: Mock questions when API is unavailable

##  Technical Approach

### Architecture Overview
The application follows a component-based architecture with centralized state management using React hooks:

\`\`\`
components/
├── quiz-app.jsx          # Main quiz container with state management
├── Icons.jsx             # Reusable Icons
└── Ui-components    # Reusable UI components (Button, Card, Progress, etc.)
\`\`\`

### State Management Strategy
I implemented a comprehensive state management approach using React's `useState` and `useEffect` hooks:


This approach provides:
- **Centralized State**: All quiz data managed in one component
- **Predictable Updates**: Clear state transitions between quiz phases
- **Type Safety**: TypeScript interfaces for all data structures

### API Integration Implementation


#### Open Trivia DB Integration
I implemented a robust API integration with comprehensive error handling:



#### Data Normalization Strategy
The API returns data in a specific format that needed normalization for the UI:

**API Response Format:**
\`\`\`json
{
  "question": "What is 2+2?",
  "correct_answer": "4",
  "incorrect_answers": ["3", "5", "6"]
}
\`\`\`

**Normalization Process:**
1. **HTML Decoding**: Used `decodeURIComponent` to handle HTML entities
2. **Answer Shuffling**: Randomized option order to prevent pattern recognition
3. **ID Generation**: Created unique identifiers for each question
4. **Type Conversion**: Ensured consistent data types across the application

##  Challenges Faced & Solutions

### 1. API Reliability and Error Handling
**Challenge**: The Open Trivia DB API can be unreliable with rate limiting and occasional downtime.

**Solution**: Implemented a multi-layered error handling approach:
- **Timeout Protection**: 10-second request timeout to prevent hanging
- **Specific Error Codes**: Handle different API response codes (rate limiting, no results, etc.)
- **Graceful Fallback**: High-quality mock questions when API fails
- **User Feedback**: Clear error messages explaining the situation


### 2. Timer Management Complexity
**Challenge**: Managing a countdown timer that persists across component re-renders while handling edge cases.

**Solution**: Implemented a robust timer system with cleanup:
- **useEffect Cleanup**: Proper timer cleanup to prevent memory leaks
- **Auto-advance Logic**: Automatic question progression when timer expires
- **State Synchronization**: Timer resets properly between questions
- **Pause Functionality**: Timer stops during loading and results phases


### 3. State Management Complexity
**Challenge**: Coordinating multiple pieces of state (questions, answers, timer, quiz phase) without conflicts.

**Solution**: Designed a clear state flow with defined transitions:
- **Single Source of Truth**: Centralized state management in main component
- **Predictable Transitions**: Clear state machine pattern (setup → loading → active → completed)
- **Immutable Updates**: Used functional state updates to prevent race conditions

### 4. Accessibility Implementation
**Challenge**: Making the quiz fully accessible while maintaining visual appeal.

**Solution**: Comprehensive accessibility features:
- **ARIA Labels**: Descriptive labels for all interactive elements
- **Keyboard Navigation**: Full keyboard support with proper focus management
- **Screen Reader Support**: Semantic HTML and proper heading hierarchy
- **Color Contrast**: WCAG AA compliant color combinations
- **Focus Indicators**: Clear visual focus states for all interactive elements

### 5. Responsive Design Challenges
**Challenge**: Creating a layout that works seamlessly across all device sizes.

**Solution**: Mobile-first responsive design approach:
- **Flexible Grid System**: CSS Grid and Flexbox for adaptive layouts
- **Scalable Typography**: Responsive font sizes using Tailwind's responsive prefixes
- **Touch-Friendly Interactions**: Adequate touch targets for mobile devices
- **Progressive Enhancement**: Core functionality works on all devices

##  Design Decisions

### Typography Hierarchy
- **Headings**: Bold weights (600-700) for clear information hierarchy
- **Body Text**: Regular weight (400) with increased line height for readability
- **Interactive Elements**: Medium weight (500) for buttons and links

### Animation Strategy
Subtle animations enhance user experience without being distracting:
- **Fade Transitions**: Smooth question transitions using CSS transitions
- **Hover Effects**: Interactive feedback on buttons and options
- **Progress Animation**: Smooth progress bar updates


##  Setup and Usage

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation
\`\`\`bash
1.# Clone the repository
git clone [repository-url]

2.# Install dependencies
npm install

3.# Start development server
npm run dev
\`\`\`

### Usage
1. **Start Quiz**: Select difficulty level and click "Start Quiz"
2. **Answer Questions**: Click on your chosen answer within 30 seconds
3. **Navigate**: Use Previous/Next buttons or let timer auto-advance
4. **View Results**: See detailed results with correct answer explanations
5. **Retry**: Start a new quiz with different difficulty settings

##  Code Structure

### Component Organization
- **quiz-app.jsx**: Main container with all state management and API logic
- **UI Components**: Reusable shadcn/ui components for consistent styling
- **Type Definitions**: TypeScript interfaces for type safety




## 📝 Lessons Learned

1. **API Integration**: Always implement comprehensive error handling for external APIs
2. **State Management**: Clear state transitions prevent bugs in complex applications
3. **User Experience**: Loading states and error messages are crucial for user satisfaction
4. **Accessibility**: Building accessible features from the start is easier than retrofitting
5. **Performance**: Proper cleanup of timers and effects prevents memory leaks

This quiz application demonstrates modern React development practices with a focus on user experience, accessibility, and robust error handling.
