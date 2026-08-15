# 🎓 EduRec: Full-Stack Online Learning & Course Recommendation App

EduRec is an industry-grade, full-stack cross-platform mobile application designed to personalize learning journeys. Built using **React Native (TypeScript)** on the mobile client and **Node.js, Express, and MongoDB** on the backend, it serves as a complete solution for course discovery, syllabus tracking, interactive evaluation, and smart skill profiling.

The core differentiator of EduRec is its **intelligent hybrid recommendation engine** combined with a **Skill-Gap Analysis system**. Learners can pinpoint their target career tracks (such as Full-Stack Developer or Data Scientist), identify missing skills in their profile, and receive targeted course recommendations to close those gaps.

---

## 🚀 Key Features

*   **🔒 Secure JWT Authentication**: User sign-ups and logins, with credentials persistently stored using `@react-native-async-storage/async-storage`.
*   **📋 Interactive Learner Onboarding**: Step-by-step profile generation where users declare their experience level, technical skills, and learning interests.
*   **🔍 Advanced Course Discovery**: Search, filter courses by category or difficulty level, and explore detailed course summaries.
*   **📖 Dynamic Syllabus & Lesson Tracking**: Access structured course lessons. Unenrolled lessons are locked; once enrolled, interactive videos, descriptions, and materials become accessible.
*   **🎥 Lesson Player**: Simulated video lecture interface that tracks completion status, playback duration, and hosts auxiliary learning resources.
*   **📝 Interactive Quizzes**: Custom multiple-choice assessments for each lesson, offering instant feedback, detailed answer explanations, and automated score calculations.
*   **📈 Smart Progress Analytics**: Real-time course completion percentage calculation, updating status flags (`ACTIVE`, `COMPLETED`) as students progress.
*   **⚙️ Personalized Hybrid Recommendation Engine**: A custom recommendation algorithm combining Content-Based similarity (tags, categories, skill matching, difficulty levels, popularity) and User-to-User Collaborative Filtering.
*   **🎯 Skill-Gap Analyzer**: A specialized tool mapping user profiles against pre-defined target roles, highlighting missing skills, and recommending courses specifically teaching those missing competencies.

---

## 🛠️ Technology Stack

### Mobile Frontend
*   **Core Framework**: React Native (v0.87.0) powered by TypeScript (v6.0.3)
*   **State Management**: Redux Toolkit & React Redux (v9.3.0) for unified global session, enrollment, progress, and recommendations state
*   **Navigation**: React Navigation (v7) implementing Stack and Bottom Tab routers
*   **API Client**: Axios (v1.19.0) with request interceptors for token attachment and response interceptors for global authentication handling
*   **Local Storage**: `@react-native-async-storage/async-storage` for persisting user tokens

### Backend REST API
*   **Environment**: Node.js (v22+)
*   **Web Framework**: Express.js (v4.18.2)
*   **Database ODM**: Mongoose (v7.6.3) interfacing with MongoDB
*   **Security & Encryption**: JSON Web Token (`jsonwebtoken`) and `bcryptjs` for secure password hashing and stateless REST authentication
*   **Development Utilities**: `cors`, `dotenv` for environment variables, and `nodemon` for local hot-reloads

---

## 📁 Repository Structure

The project follows a clean client-server division with isolated routing, models, screens, and components:

```text
OnlineLearningCourseRecommendation/
├── mobile/                      # React Native Frontend Application
│   ├── src/
│   │   ├── components/          # Reusable UI Components
│   │   │   ├── CourseCard.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── RatingStars.tsx
│   │   │   └── RecommendationCard.tsx
│   │   ├── hooks/               # Custom typed hooks
│   │   │   ├── useAppDispatch.ts
│   │   │   └── useAppSelector.ts
│   │   ├── navigation/          # React Navigation stacks & bottom tabs
│   │   │   ├── RootNavigator.tsx
│   │   │   └── types.ts
│   │   ├── screens/             # Screen components
│   │   │   ├── CourseDetailsScreen.tsx
│   │   │   ├── ExploreScreen.tsx
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── LessonPlayerScreen.tsx
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── MyLearningScreen.tsx
│   │   │   ├── OnboardingScreen.tsx
│   │   │   ├── ProfileScreen.tsx
│   │   │   ├── QuizScreen.tsx
│   │   │   ├── RecommendationsScreen.tsx
│   │   │   └── RegisterScreen.tsx
│   │   ├── services/            # Axios instance and API configuration
│   │   │   └── api.ts
│   │   ├── store/               # Redux Toolkit store and slices
│   │   │   ├── authSlice.ts
│   │   │   ├── courseSlice.ts
│   │   │   ├── enrollmentSlice.ts
│   │   │   ├── progressSlice.ts
│   │   │   └── recommendationSlice.ts
│   │   └── types/               # TypeScript interface specifications
│   │       └── index.ts
│   ├── App.tsx                  # Client entry wrapper
│   └── package.json             # Frontend dependency configuration
│
└── server/                      # Node.js & Express REST Backend
    ├── config/                  # Configuration loaders (MongoDB)
    │   └── db.js
    ├── controllers/             # REST controller handlers
    │   ├── authController.js
    │   ├── courseController.js
    │   ├── enrollmentController.js
    │   ├── progressController.js
    │   ├── quizController.js
    │   └── recommendationController.js
    ├── middleware/              # Express middlewares (auth guards, error handling)
    │   ├── auth.js
    │   └── errorHandler.js
    ├── models/                  # Mongoose MongoDB schemas
    │   ├── Bookmark.js
    │   ├── Course.js
    │   ├── Enrollment.js
    │   ├── Lesson.js
    │   ├── Progress.js
    │   ├── Quiz.js
    │   ├── Recommendation.js
    │   └── User.js
    ├── routes/                  # API endpoints definition
    │   ├── authRoutes.js
    │   ├── courseRoutes.js
    │   ├── enrollmentRoutes.js
    │   ├── progressRoutes.js
    │   ├── quizRoutes.js
    │   └── recommendationRoutes.js
    ├── server.js                # Express app boot entry point
    ├── .env                     # Local environment settings
    └── package.json             # Backend dependency configuration
```

### Key File Directories Quick Links:
*   **Mobile Screens Directory**: [`mobile/src/screens`](file:///d:/AppDev/OnlineLearningCourseRecommendation/mobile/src/screens)
*   **Mobile Redux Slices**: [`mobile/src/store`](file:///d:/AppDev/OnlineLearningCourseRecommendation/mobile/src/store)
*   **Server Controllers**: [`server/controllers`](file:///d:/AppDev/OnlineLearningCourseRecommendation/server/controllers)
*   **Server Database Models**: [`server/models`](file:///d:/AppDev/OnlineLearningCourseRecommendation/server/models)
*   **Server API Routers**: [`server/routes`](file:///d:/AppDev/OnlineLearningCourseRecommendation/server/routes)
*   **Server Entrypoint**: [`server/server.js`](file:///d:/AppDev/OnlineLearningCourseRecommendation/server/server.js)

---

## 📊 Recommendation System Architecture

EduRec utilizes three custom-designed recommendation algorithms, implemented from scratch on the Express server:

### 1. Personalized Hybrid Course Recommendation
Calculates a composite recommendation score for all courses in which the learner is **not** currently enrolled.

*   **Content-Based Scoring (Weight: 70%)**: Matches the course attributes to the user's saved profile:
    *   **Interest Alignment (30%)**: The count of overlapping tags between the course tags and the user's declared interests, normalized by total user interests.
    *   **Skill Overlap (30%)**: The count of course skills matching the user's skills, normalized by total course skills.
    *   **Category Overlap (20%)**: Evaluates to $1.0$ if the course category aligns with any of the user's interests, else $0.0$.
    *   **Difficulty Suitability (10%)**: Matches user experience levels to course difficulty:
        *   *Beginner Profile*: Beginner course ($1.0$), Intermediate ($0.5$), Advanced ($0.1$).
        *   *Intermediate Profile*: Intermediate course ($1.0$), Beginner ($0.7$), Advanced ($0.5$).
        *   *Advanced Profile*: Advanced course ($1.0$), Intermediate ($0.8$), Beginner ($0.4$).
    *   **Popularity Score (10%)**: The course's total enrollment count normalized by the maximum enrollment count on the platform.

$$\text{ContentScore} = (0.3 \cdot \text{Interest}) + (0.3 \cdot \text{Skill}) + (0.2 \cdot \text{Category}) + (0.1 \cdot \text{Difficulty}) + (0.1 \cdot \text{Popularity})$$

*   **Collaborative Filtering (Weight: 30%)**:
    *   Identifies "peers" (other users) enrolled in at least one course the target user is currently taking.
    *   Scans courses those peers have enrolled in that the target user has not yet started.
    *   Computes density score:

$$\text{CollabScore} = \frac{\text{PeerEnrollments}}{\text{TotalPeers}}$$

*   **Hybrid Ranking**:
    *   If the user has active enrollments and peer overlaps are found, the final rank score is:

$$\text{FinalScore} = (0.7 \cdot \text{ContentScore}) + (0.3 \cdot \text{CollabScore})$$

    *   If no peer overlap exists or the user has no active enrollments, the scoring defaults to $100\%$ content-based matching ($\text{FinalScore} = \text{ContentScore}$).

---

### 2. Course Similarity ("Because You Watched...")
Recommends courses similar to a reference course (excluding the user's current enrollments) based on tag and category overlap:

$$\text{RelatedScore} = (0.6 \cdot \text{TagOverlap}) + (0.4 \cdot \text{CategoryMatch})$$

---

### 3. Skill-Gap Course Recommendation
Identifies the user's mismatch against specific career track skill pools:
*   **Industry Role Requirements**:
    *   `React Native Developer`: *React Native, TypeScript, Redux, REST APIs, Git, JavaScript*
    *   `Full Stack Developer`: *React, JavaScript, HTML, CSS, Node, MongoDB, REST APIs, Git*
    *   `Data Scientist`: *Python, Pandas, NumPy, Statistics, Data Visualization, Machine Learning, Scikit-Learn*
    *   `AI Engineer`: *Python, Machine Learning, Neural Networks, AI, NLP, Computer Vision*
*   **Gap Computation**: Filters the target role's required skills to extract those absent from the user's profile ($\text{MissingSkills}$).
*   **Recommendation Score**: Evaluates non-enrolled courses that teach these missing skills, ranking them by coverage:

$$\text{GapScore} = \frac{\text{MissingSkillsOverlap}}{\text{TotalMissingSkills}}$$

---

## 🔌 API Documentation

Protected routes require a `Bearer <JWT_TOKEN>` header.

| HTTP Method | Endpoint | Access | Body / Query Parameters | Success Response (200/201) |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | `{ name, email, password }` | `{ success: true, token, user }` |
| `POST` | `/api/auth/login` | Public | `{ email, password }` | `{ success: true, token, user }` |
| `GET` | `/api/auth/me` | Private | None | `{ success: true, user }` |
| `PUT` | `/api/auth/profile` | Private | `{ name, skills, interests, experienceLevel }` | `{ success: true, user }` |
| `GET` | `/api/courses` | Public | Query: `category`, `level`, `search` | `{ success: true, count, courses }` |
| `POST` | `/api/courses/seed` | Public | None (Admin seeder utility) | `{ success: true, message }` |
| `GET` | `/api/courses/:id` | Public | None | `{ success: true, course }` |
| `POST` | `/api/enrollments` | Private | `{ courseId }` | `{ success: true, enrollment }` |
| `GET` | `/api/enrollments` | Private | None | `{ success: true, count, enrollments }` |
| `GET` | `/api/enrollments/:id` | Private | None | `{ success: true, enrollment }` |
| `POST` | `/api/progress` | Private | `{ courseId, lessonId, completed }` | `{ success: true, progressPercentage }` |
| `GET` | `/api/progress/:courseId` | Private | None | `{ success: true, progress }` |
| `GET` | `/api/quizzes/:courseId` | Private | Query: `lessonId` | `{ success: true, count, quizzes }` |
| `POST` | `/api/quizzes/:id/submit` | Private | `{ answers: ["A", "C", ...] }` | `{ success: true, score, passed, feedback }` |
| `GET` | `/api/recommendations` | Private | None | `{ success: true, count, recommendations }` |
| `GET` | `/api/recommendations/because-you-watched/:courseId` | Private | None | `{ success: true, count, recommendations }` |
| `GET` | `/api/recommendations/skill-gap` | Private | Query: `role` | `{ success: true, role, skillsRequired, userSkills, missingSkills, recommendations }` |

---

## 🛠️ Installation & Setup

### Prerequisites
*   [Node.js](https://nodejs.org) (v18 or higher recommended, minimum v22.11 for mobile build compatibility)
*   [Java Development Kit (JDK)](https://www.oracle.com/java/technologies/downloads/) (JDK 17 recommended for Android)
*   [Android Studio](https://developer.android.com/studio) with configured SDK tools and virtual device emulator
*   [MongoDB](https://www.mongodb.com/try/download/community) running locally on standard port `27017` **OR** a MongoDB Atlas URI

### 1. Environment Configurations
Create a copy of the configuration properties in `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/online-learning-db
JWT_SECRET=supersecretjwtkeyforrecommendationapp123!
API_BASE_URL=http://localhost:5000/api
```

> [!IMPORTANT]
> When testing on a **physical Android device**, update `API_BASE_URL` in `server/.env` and `API_BASE_URL` in [`mobile/src/services/api.ts`](file:///d:/AppDev/OnlineLearningCourseRecommendation/mobile/src/services/api.ts) from `localhost` to your computer's local area network (LAN) IP (e.g. `http://192.168.1.50:5000/api`).
> When running in an **Android Emulator**, use `http://10.0.2.2:5000/api` for API resolution.

### 2. Backend Server Setup
Navigate into the server folder, install the modules, seed local courses, and spin up the developer server:
```bash
cd server
npm install

# Seed the database and start the Express server
npm run dev
```
Verify the backend is live by opening `http://localhost:5000` in your web browser. If it is your first time starting up, trigger course seeding by executing a POST request to `http://localhost:5000/api/courses/seed` using Postman.

### 3. Mobile Client Setup
Navigate into the mobile directory, install dependencies, and build the client binaries:
```bash
cd mobile
npm install

# Step 3.1: Start the Metro Bundle compiler
npx react-native start

# Step 3.2 (In a new terminal window): Connect your device / emulator and run the app
npx react-native run-android
```
*(If on macOS targeting iOS development, execute `cd ios && pod install && cd ..` before running `npx react-native run-ios`.)*

---

## 🎓 Interview Q&A Guide

### React Native & State Management

<details>
<summary>1. What is React Native and how does it bridge code?</summary>
<blockquote>
React Native allows developers to write cross-platform mobile apps using JavaScript/TypeScript and React. It achieves native rendering through a "bridge" (or the newer JSI architecture) that communicates asynchronously between the JavaScript runtime and the native thread. It translates React core elements (like <code>&lt;View&gt;</code> or <code>&lt;Text&gt;</code>) into direct native views (e.g. <code>android.view.ViewGroup</code> or <code>UIView</code>), matching native device speed.
</blockquote>
</details>

<details>
<summary>2. Why did you use Redux Toolkit in this project instead of React Context?</summary>
<blockquote>
Redux Toolkit was chosen to handle complex, heavily dynamic global states—including user sessions, enrollment status trackers, quiz results, and recommendations. While React Context is excellent for simple, static data, Redux Toolkit prevents unnecessary re-renders of unrelated child views by using state selectors. It also separates API fetch logs, error handling, and local storage writes inside async thunk middleware.
</blockquote>
</details>

<details>
<summary>3. Explain the navigation structure of the app.</summary>
<blockquote>
The app uses a <code>NavigationContainer</code> nesting a <code>RootStackNavigator</code>. It dynamically toggles navigation pathways depending on user session states fetched from Redux:
<ul>
  <li><strong>Unauthenticated Flow</strong>: Directs users to the <code>AuthNavigator</code> (Login/Register).</li>
  <li><strong>Onboarding Flow</strong>: Displays the <code>OnboardingNavigator</code> if a logged-in user has not selected interests/skills yet.</li>
  <li><strong>Main Application Flow</strong>: Unlocks a <code>BottomTabNavigator</code> containing 5 primary view decks (Home, Explore, My Learning, Recommendations, Profile) and exposes modular overlays like Course Details, Lesson Player, and Quiz screens.</li>
</ul>
</blockquote>
</details>

<details>
<summary>4. How did you persist the user's logged-in session?</summary>
<blockquote>
Upon successful login or registration, the backend server returns a signed JWT. The React Native app stores this token locally using <code>@react-native-async-storage/async-storage</code>. When the app initializes, an auth slice initialization thunk verifies if the token exists, executes an API request to <code>/api/auth/me</code>, and restores the user's Redux state, skipping the login screen entirely.
</blockquote>
</details>

<details>
<summary>5. How do you handle API errors gracefully in the client?</summary>
<blockquote>
We configured Axios response interceptors in <code>mobile/src/services/api.ts</code>. If the request encounters a network dropout, it returns a readable fallback message. If the backend returns a <code>401 Unauthorized</code> status (token expired or altered), the interceptor immediately clears AsyncStorage, clears Redux state, and pushes the user back to the login screen.
</blockquote>
</details>

<details>
<summary>6. What is the difference between React Native CLI and Expo, and why did you choose the CLI?</summary>
<blockquote>
Expo is a managed wrapper that handles native iOS/Android builds automatically but restricts control over native C++/Java/Objective-C configurations. React Native CLI gives direct access to native project folders (<code>/android</code> and <code>/ios</code>), allowing full customization of packages, native bridges, build scripts, and direct native module integrations. It represents standard practice for production-grade enterprise apps.
</blockquote>
</details>

<details>
<summary>7. What are custom hooks, and why did you use them in the mobile folder?</summary>
<blockquote>
Custom hooks are reusable functions that abstract React state logic. In this project, we built typed wrappers: <code>useAppDispatch</code> and <code>useAppSelector</code>. These custom hooks provide type-safe dispatching and selection against the Redux store's <code>RootState</code>, preventing runtime crashes and ensuring full autocomplete support.
</blockquote>
</details>

<details>
<summary>8. How does safe area handling work in React Native?</summary>
<blockquote>
Different mobile screens have physical obstructions like notches, camera holes, and rounded status lines. We imported <code>react-native-safe-area-context</code> to wrap app layouts inside <code>SafeAreaView</code>, dynamically computing safe layout bounds so that headers and bottom tabs do not clip behind hardware boundaries.
</blockquote>
</details>

### Backend & Database Architecture

<details>
<summary>9. Why did you choose Node.js and Express for the server stack?</summary>
<blockquote>
Node.js offers an asynchronous, event-driven, non-blocking I/O runtime, making it exceptionally fast at handling high concurrent requests (e.g. tracking video progress, fetching course metadata, and serving recommendations). Express provides a lightweight framework to organize routes, mount JWT middleware guards, and implement structured controllers.
</blockquote>
</details>

<details>
<summary>10. What is Mongoose, and how does it benefit MongoDB development?</summary>
<blockquote>
Mongoose is an Object Data Modeling (ODM) library for MongoDB. It provides schema validation rules, defines default parameters, structures references between collections (e.g., links Enrollment to Course and User), supports virtual properties (like course lesson populating), and enforces constraints (e.g. compound indices).
</blockquote>
</details>

<details>
<summary>11. How does JWT authentication operate on secure REST routes?</summary>
<blockquote>
When a user logs in, the backend signs a payload (containing the user ID) using a private key and the <code>jsonwebtoken</code> library. The client stores this string and sends it inside the HTTP headers (<code>Authorization: Bearer &lt;token&gt;</code>) for subsequent requests. The Express auth middleware verifies the signature. If valid, it decodes the payload, queries user records, and mounts the active user details onto the <code>req.user</code> object.
</blockquote>
</details>

<details>
<summary>12. Why did you choose `bcryptjs` over the native `bcrypt` package?</summary>
<blockquote>
The native <code>bcrypt</code> package compiles C++ binaries during installation, which frequently fails on host machines (especially Windows) lacking C++ compilers or Visual Studio build tools. <code>bcryptjs</code> is a pure JavaScript rewrite. It installs reliably across all host operating systems without performance bottlenecks.
</blockquote>
</details>

<details>
<summary>13. Explain how you prevented duplicate enrollments in the database.</summary>
<blockquote>
We implemented a compound unique index on the Mongoose Enrollment model: <code>EnrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true })</code>. If a duplicate enrollment request passes API checks, MongoDB rejects the insert write and throws an error, which the Express global error handler parses into a clean <code>400 Bad Request</code> response.
</blockquote>
</details>

<details>
<summary>14. How does virtual populate work in your Course schema?</summary>
<blockquote>
In MongoDB, storing arrays of lesson sub-documents inside the course document can cause documents to exceed the 16MB document size limit. Instead, our Course model defines a virtual property <code>lessons</code> referencing the Lesson schema. When fetching a course, calling <code>.populate('lessons')</code> performs an optimized lookup query matching <code>Lesson.courseId</code> with <code>Course._id</code> dynamically.
</blockquote>
</details>

### Recommendation Engine & Analytics Algorithms

<details>
<summary>15. Explain the math behind your Personalized Hybrid Scoring Engine.</summary>
<blockquote>
The system generates a recommendation score ($0.0$ to $1.0$) for candidate courses using:
$$\text{FinalScore} = 0.7 \cdot \text{ContentScore} + 0.3 \cdot \text{CollabScore}$$
where:
<ul>
  <li><strong>ContentScore</strong>: Evaluates interest tags overlap ($30\%$), skill overlap ($30\%$), category match ($20\%$), experience difficulty matching ($10\%$), and normalized course popularity ($10\%$).</li>
  <li><strong>CollabScore</strong>: Calculates the enrollment density of candidate courses among peer users who share active course enrollments with the target user.</li>
</ul>
If the user has no active enrollments or no similar peers are found, the algorithm falls back to $100\%$ ContentScore.
</blockquote>
</details>

<details>
<summary>16. How does "Because You Watched" course similarity calculate recommendations?</summary>
<blockquote>
When a student views a course details page, the related recommendation endpoint evaluates similar items based on:
$$\text{RelatedScore} = (0.6 \cdot \text{TagOverlap}) + (0.4 \cdot \text{CategoryMatch})$$
It scores non-enrolled courses by comparing their tags and category metadata against the reference course, sorting them to return the top 4 related items.
</blockquote>
</details>

<details>
<summary>17. How does the Skill-Gap Analysis function?</summary>
<blockquote>
The backend maintains required technical skill lists for target industry career paths (e.g. React Native Developer, Full Stack Developer, Data Scientist, AI Engineer). When requested, the controller compares the required skills list against the user's current skills. It isolates the missing skills, computes a coverage ratio for candidate courses, and suggests courses containing those missing topics.
</blockquote>
</details>

<details>
<summary>18. What is the "Cold Start" problem, and how did you resolve it?</summary>
<blockquote>
A cold start occurs when a new user joins (with no enrollments) or a new course is uploaded (with no user ratings or enrollments). We resolve this in two ways:
<ol>
  <li><strong>New User</strong>: We require interests, skills, and experience selections during onboarding. The system uses these content metrics to recommend courses before any enrollment data exists.</li>
  <li><strong>New Course</strong>: We normalize popularity against active course data and include category matching to ensure new items can still yield high content match scores.</li>
</ol>
</blockquote>
</details>

<details>
<summary>19. How is the overall course progress percentage updated?</summary>
<blockquote>
When a student completes a lesson or passes a lesson quiz, a Progress record is created with <code>completed: true</code>. The controller queries the total count of lessons associated with the course, counts the user's completed progress records for that course, and updates the Enrollment document's progress percentage:
$$\text{Percentage} = \left(\frac{\text{CompletedLessons}}{\text{TotalLessons}}\right) \cdot 100$$
If this matches $100$, the Enrollment status flag updates from <code>ACTIVE</code> to <code>COMPLETED</code>.
</blockquote>
</details>

<details>
<summary>20. How would you scale this recommendation system to support millions of users?</summary>
<blockquote>
Calculating hybrid recommendations synchronously on the Node.js main thread degrades server response times at scale. To resolve this:
<ol>
  <li>We would pre-calculate collaborative filtering indexes in background batch jobs using Apache Spark or Python script pipelines.</li>
  <li>We would store pre-calculated similarity scores in a fast key-value database like Redis.</li>
  <li>We would represent courses and user profiles as vectors and utilize vector search databases (like Pinecone, Milvus, or FAISS) to calculate cosine similarity matches in milliseconds.</li>
</ol>
</blockquote>
</details>

---

## 👔 Non-Technical HR Summary

"I developed **EduRec**, a full-stack mobile learning application built with **React Native**, **TypeScript**, and **MongoDB** that delivers a highly personalized course discovery interface. The application features user onboarding, progress tracking, dynamic video syllabus locks, and interactive lesson quizzes.

The technical highlight of the project is the custom-built **personalized recommendation engine**. Using a hybrid scoring algorithm, the server evaluates course popularity, user interest tags, experience level difficulty, and collaborative peer enrollment patterns. Additionally, I implemented a **Skill-Gap Analysis tool** that lets students select a target industry career (like Full-Stack Developer or AI Engineer), displays their missing skills, and recommends specific courses to bridge that gap. This project demonstrates strong proficiency in full-stack mobile architecture, database modeling, REST API security, and personalization algorithms."
