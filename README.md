# EduPrompt: Learn & Quiz

EduPrompt is a web application that leverages the power of AI to create a dynamic and interactive learning experience. Users can enter any topic they wish to learn about, and EduPrompt will generate a simplified, easy-to-understand explanation along with a multi-format quiz to test their knowledge.

## Features

- **AI-Powered Explanations**: Get clear and concise explanations on virtually any topic.
- **Interactive Quizzes**: Test your understanding with auto-generated quizzes that include multiple-choice, true/false, and fill-in-the-blank questions.
- **Instant Feedback**: Receive your quiz score and review your answers immediately after submission.
- **Persistent Lesson History**: All generated lessons and quizzes are automatically saved to Firebase Firestore.
- **Responsive Design**: A clean and modern user interface that works seamlessly on both desktop and mobile devices.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **AI/Generative**: [Firebase Genkit](https://firebase.google.com/docs/genkit)
- **Database**: [Firebase Firestore](https://firebase.google.com/docs/firestore)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

## Getting Started

Follow these instructions to get a local copy of the project up and running.

### Prerequisites

- Node.js (v18 or later)
- npm or another package manager
- [Firebase CLI](https://firebase.google.com/docs/cli) (for deploying Firestore rules)

### Installation

1.  **Clone the repository** (if applicable) and navigate to the project directory.

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Set up Environment Variables**:
    Create a `.env` file in the root of your project and add your Google AI API key:
    ```
    GEMINI_API_KEY=YOUR_API_KEY_HERE
    ```

### Running the Application

1.  **Start the Next.js development server**:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:9002`.

2.  **Start the Genkit developer UI** (optional, in a separate terminal):
    This allows you to inspect and test your AI flows.
    ```bash
    npm run genkit:dev
    ```

## Firebase Setup

This project uses Firebase Firestore to store generated lessons.

### Firestore Security Rules

Secure Firestore rules have been defined in `firestore.rules`. Before running the application, you need to deploy them to your Firebase project.

1.  **Login to Firebase**:
    ```bash
    firebase login
    ```

2.  **Deploy Firestore Rules**:
    Make sure your project is correctly configured in your `.firebaserc` file, then run:
    ```bash
    firebase deploy --only firestore
    ```# edu-promt
# edu-promt
