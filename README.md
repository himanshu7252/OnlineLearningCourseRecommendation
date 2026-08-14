# Online Learning & Course Recommendation Mobile App

EduRec is an industry-oriented, full-stack cross-platform mobile application built using **React Native + TypeScript** on the frontend, and **Node.js + Express + MongoDB** on the backend. 

The core feature of the platform is a **Personalized Hybrid Recommendation System** and a **Skill-Gap Analysis** engine that helps learners identify their missing skills for target career roles and recommends courses to close those gaps.

---

## 🚀 Features

*   **Secure Authentication**: JWT-based sign-up and login, with credentials persisted in local storage (`AsyncStorage`).
*   **Learner Onboarding**: Interactive selection of experience levels, skill sets, and interests to customize recommendations.
*   **Course Directory**: Search, filter by difficulty/category/skills, and browse detailed descriptions.
*   **Dynamic Syllabus**: Locked lessons before enrollment, which unlock as interactive links once a student subscribes.
*   **Lesson Player**: Simulated video player tracking completed status, watched durations, and supplementary resources.
*   **Interactive Quizzes**: Multiple-choice lesson assessments with immediate feedback, scoring, passing limits, and answers explanation.
*   **Progress Tracking**: Calculates course completion percentages and updates status flags (`ACTIVE`, `COMPLETED`).
*   **Hybrid Recommendation Engine**: Incorporates user tags overlap, skill matching, collaborative filtering, popularity, and difficulty matches.
*   **Skill-Gap Analyzer**: Select a target role (e.g. *React Native Developer*, *Data Scientist*) to see missing skills and bridge them with matching courses.

---

## 🛠️ Tech Stack

*   **Mobile App**: React Native CLI, TypeScript, React Navigation (Stack & Bottom Tabs), Redux Toolkit, Axios, AsyncStorage.
*   **Backend Server**: Node.js, Express.js, JWT, bcryptjs, CORS.
*   **Database**: MongoDB, Mongoose (schemas, compound indexes, virtual populates).

---

## 📊 Recommendation System Scoring Logic

EduRec uses a multi-level hybrid algorithm:

### 1. Content-Based Score (Weight: 70%)
The system extracts course features and matches them against the user profile:
*   **Interest Score (30%)**: Number of matching tags divided by user's total selected interests.
*   **Skill Score (30%)**: Overlap between course skills and user's current/target skills.
*   **Category Match (20%)**: Binary check ($1.0$ or $0.0$) if course category overlaps with user interests.
*   **Difficulty Match (10%)**: Matches experience level:
    *   *Beginner*: Beginner ($1.0$), Intermediate ($0.5$), Advanced ($0.1$)
    *   *Intermediate*: Intermediate ($1.0$), Beginner ($0.7$), Advanced ($0.5$)
    *   *Advanced*: Advanced ($1.0$), Intermediate ($0.8$), Beginner ($0.4$)
*   **Popularity Score (10%)**: Enrollment count normalized against maximum enrollments on the platform.

$$\text{ContentScore} = (0.3 \cdot \text{Interest}) + (0.3 \cdot \text{Skill}) + (0.2 \cdot \text{Category}) + (0.1 \cdot \text{Difficulty}) + (0.1 \cdot \text{Popularity})$$

### 2. Collaborative Filtering (Weight: 30%)
*   Identifies peer users who are enrolled in similar courses.
*   Extracts courses enrolled by those peers that the target user has **not** taken yet.
*   Scores courses based on peer enrollment density:
    $$\text{CollaborativeScore} = \frac{\text{PeerEnrollments}}{\text{TotalSimilarPeers}}$$

### 3. Hybrid Ranking
*   **Exclusion**: Already enrolled courses are strictly filtered out.
*   **Combination**: If peer data is present, the final rank score is:
    $$\text{FinalScore} = (0.7 \cdot \text{ContentScore}) + (0.3 \cdot \text{CollaborativeScore})$$
    Otherwise, it defaults to $100\%$ ContentScore.

---

## 📁 Repository Structure

```text
online-learning-course-recommendation-mobile/
├── mobile/                  # React Native client folder
│   ├── src/
│   │   ├── components/      # Reusable UI elements (Cards, Bars, Stars)
│   │   ├── hooks/           # Typed useDispatch/useSelector hooks
│   │   ├── navigation/      # React Navigation parameters and stack routers
│   │   ├── screens/         # Screen pages (Auth, Onboarding, Home, Player, Quiz)
│   │   ├── services/        # Axios API clients
│   │   ├── store/           # Redux Toolkit slices
│   │   └── types/           # Interface specifications
│   ├── App.tsx              # App root wrapper
│   └── package.json
│
├── server/                  # Node.js backend folder
│   ├── config/              # MongoDB Mongoose configurations
│   ├── controllers/         # Routing handlers (Auth, Course, Progress, Recs)
│   ├── middleware/          # JWT auth guards, global error parsers
│   ├── models/              # Mongoose schemas (User, Course, Progress, Quiz)
│   ├── routes/              # Routing maps
│   ├── server.js            # Express application boot entry
│   └── package.json
```

---

## 🔌 API Documentation

All protected routes require a `Bearer <token>` header inside requests.

| Method | Endpoint | Auth | Request Body / Query Params | Success Response (200/201) |
|---|---|---|---|---|
| `POST` | `/api/auth/register` | Public | `{ name, email, password }` | `{ success: true, token, user }` |
| `POST` | `/api/auth/login` | Public | `{ email, password }` | `{ success: true, token, user }` |
| `GET` | `/api/auth/me` | Private | None | `{ success: true, user }` |
| `PUT` | `/api/auth/profile` | Private | `{ name, skills, interests, ... }` | `{ success: true, user }` |
| `GET` | `/api/courses` | Public | Query: `category`, `level`, `search` | `{ success: true, count, courses }` |
| `POST` | `/api/courses/seed` | Public | None (Utility seeder) | `{ success: true, message }` |
| `GET` | `/api/courses/:id` | Public | None | `{ success: true, course }` |
| `POST` | `/api/enrollments` | Private | `{ courseId }` | `{ success: true, enrollment }` |
| `GET` | `/api/enrollments` | Private | None | `{ success: true, count, enrollments }` |
| `POST` | `/api/progress` | Private | `{ courseId, lessonId, completed }` | `{ success: true, progressPercentage }` |
| `GET` | `/api/quizzes/:courseId`| Private | Query: `lessonId` | `{ success: true, count, quizzes }` |
| `POST` | `/api/quizzes/:id/submit`| Private | `{ answers: ["A", "C", ...] }` | `{ success: true, score, passed, feedback }` |
| `GET` | `/api/recommendations` | Private | None | `{ success: true, recommendations }` |
| `GET` | `/api/recommendations/because-you-watched/:courseId` | Private | None | `{ success: true, recommendations }` |
| `GET` | `/api/recommendations/skill-gap` | Private | Query: `role` | `{ success: true, missingSkills, recommendations }` |

---

## 🛠️ Installation & Setup

### Prerequisites
*   Node.js (v18+)
*   Java JDK 17
*   Android Studio & configured SDK
*   MongoDB running locally **OR** a MongoDB Atlas cluster.

### 1. Environment Configuration
Create a `.env` file in the root directory:
```env
PORT=5000
# For Local MongoDB:
MONGO_URI=mongodb://localhost:27017/online-learning-db
# For MongoDB Atlas (replace placeholders):
# MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/online-learning-db?retryWrites=true&w=majority
JWT_SECRET=supersecretjwtkeyforrecommendationapp123!
```

### 2. Backend Installation
```bash
cd server
npm install
# Seed the database and start the dev server
npm run dev
```
Verify the seeder by visiting: `http://localhost:5000/api/courses/seed` using Postman (a POST request) to populate data.

### 3. Mobile Client Installation
Ensure your `.env` settings are updated. In a physical Android device or emulator, locate your host computer's LAN IP address (e.g., `192.168.1.50`).
Edit `mobile/src/services/api.ts` and set:
```typescript
export const API_BASE_URL = 'http://192.168.1.50:5000/api'; // Replace with LAN IP
```
Then execute:
```bash
cd mobile
npm install
# Boot up Metro Bundler
npx react-native start
# Connect physical device via USB, verify ADB, and run the app
adb devices
npx react-native run-android
```

---

## 🎓 Interview Preparation (Q&As)

### React Native & State Management
1.  **What is React Native and how does it bridge code?**
    *Answer*: React Native compiles JavaScript into native platform views. It compiles rendering instructions and passes them asynchronously through a "bridge" (or JSI in newer versions) to map React elements into native UI structures (such as Android Views or iOS UIViews).
2.  **Why did you use Redux Toolkit in this project?**
    *Answer*: Redux Toolkit manages global states like user authentication tokens, active course enrollments, and lesson progress records. Slices manage reducer states cleanly while async thunks isolate Axios REST request logic from layout pages.
3.  **Explain the navigation structure of the app.**
    *Answer*: We used React Navigation. A root stack router listens to the user session token in Redux. If unauthenticated, it boots the `AuthNavigator`. If authenticated but lacking onboarding inputs, it mounts `OnboardingNavigator`. Otherwise, it unlocks the tab navigator which nests course detail stacks and lesson players.
4.  **How did you persist the user's logged-in session?**
    *Answer*: Upon successful registration or login, the Express server responds with a JWT token. The app saves this string using React Native's `@react-native-async-storage/async-storage`. On mount, a loading splash verifies this token and queries the `/auth/me` endpoint to restore credentials.
5.  **How do you handle API errors gracefully in the client?**
    *Answer*: We implemented Axios response interceptors. If a request experiences a network failure, it yields a descriptive error message. If a `401 Unauthorized` status is caught (indicating token expiration), the interceptor clears local storage and forces the user to the log-in deck.

### Backend & Database
6.  **Why did you choose Node.js and Express?**
    *Answer*: Node's asynchronous event loop manages high volumes of non-blocking I/O queries efficiently, which is ideal for a mobile backend. Express allows us to build REST controllers, JWT middleware guards, and structured routers with minimal boilerplate.
7.  **What is Mongoose and how does it benefit MongoDB development?**
    *Answer*: Mongoose is an Object Data Modeling (ODM) library for MongoDB. It provides schema validation, defines composite index rules (like preventing duplicate enrollments via `userId: 1, courseId: 1`), and supports virtual properties for sub-document query population.
8.  **How does JWT authentication operate secure REST routes?**
    *Answer*: On credentials validation, the server signs a user payload with a server-private secret key using `jsonwebtoken`. Protected endpoints verify this signature using auth guard middleware before granting controller access.
9.  **Why did you choose `bcryptjs` over native `bcrypt`?**
    *Answer*: Native `bcrypt` compiles C++ binaries during node module installation, which frequently throws compilation errors on Windows environments lacking Microsoft Visual Studio build tooling. `bcryptjs` is a pure JavaScript alternative that installs cleanly and runs securely.
10. **Explain how you prevented duplicate enrollments in the database.**
    *Answer*: We implemented a compound index on the Mongoose `EnrollmentSchema` referencing both `userId` and `courseId` with a `{ unique: true }` constraint. The controller also executes a pre-check query, responding with a `400 Bad Request` if a subscription already exists.

### Recommendation System & Analytics
11. **Explain the mathematical formula behind your hybrid scoring engine.**
    *Answer*: The engine generates a composite score. Content matches weight $70\%$ (sub-split: $30\%$ user tag overlap, $30\%$ skills match, $20\%$ category match, $10\%$ difficulty level check, and $10\%$ course popularity volume). Collaborative filtering weights $30\%$ by density mapping of courses enrolled by peers who took identical classes.
12. **How does "Because You Watched" course similarity operate?**
    *Answer*: When viewing related items, the controller inspects the reference course's tags and category. It calculates tag overlap ($60\%$ weight) and category match ($40\%$ weight) against all candidate courses, ranking relevant topics.
13. **How does the Skill-Gap Analysis function?**
    *Answer*: The backend stores target skills lists required by roles (e.g. *React Native Developer* requires Git, Redux, REST, etc.). The engine subtracts the user's possessed profile skills from the target list, returning missing skills and recommending courses teaching those skills.
14. **What is the "Cold Start" problem and how did you resolve it?**
    *Answer*: A cold start occurs when a new user joins and has no enrollment history, or a new course is added with no subscribers. We resolve this by requesting user interests/skills during onboarding to calculate interest scores, and fall back to popularity ratings.
15. **How did you prevent recommended courses from including enrolled items?**
    *Answer*: The recommendation controller queries the `Enrollment` collection for the active user, extracts a list of enrolled `courseId` strings, and filters them out of candidate lists during candidates generation.
16. **Why did you include popularity and difficulty matching in the algorithm?**
    *Answer*: Solely matching keywords can lead to recommending beginner courses to advanced developers or obscure low-quality courses. Factoring in normalized enrollment volumes (popularity) and matching user experience levels ensures high-quality, relevant results.
17. **How is overall course progress percentage updated?**
    *Answer*: Upon lesson completion or quiz passing, a `Progress` entry is created. The controller counts total lessons for the course, finds how many progress records are flagged `completed` by the user, and calculates:
    $$\text{Percentage} = \frac{\text{CompletedLessons}}{\text{TotalLessons}} \cdot 100$$
    This value is then saved in the user's `Enrollment` document.
18. **How does the quiz grading pipeline update progress?**
    *Answer*: When a quiz is submitted, the controller grades options against the answer key. If the percentage is $\ge$ the passing limit, it marks the lesson as completed in `Progress` and recalculates the overall course percentage.
19. **How would you scale this recommendation system with millions of users?**
    *Answer*: In-memory scoring in Node becomes slow with large datasets. We would offload collaborative scoring to a pipeline like Apache Spark, cache results in Redis, utilize vector database embeddings (such as Milvus or Pinecone) for similarity checks, and run calculations in background jobs.
20. **What are the key Version 2 features you would prioritize?**
    *Answer*: I would prioritize integrating AWS S3 for streaming video storage, real-time push notifications for learning streaks, downloadable offline media playback, and machine learning models for vector-based semantic search.

---

## 👔 Non-Technical HR Summary

"I developed a full-stack mobile learning platform named **EduRec** that personalized course discovery for students using React Native, TypeScript, and MongoDB. The application allows students to onboard their skills and interests, browse a premium course catalog, track lesson progress, and take quizzes to earn credits.

The core highlight of this project is a **hybrid recommendation system** that scores courses based on user interests, popular trends, and similar student behaviors. It also features a **skill-gap analysis tool** that compares a student's skills against industry roles like React Native Developer, lists their missing skills, and recommends specific courses to help them qualify. This project gave me solid, hands-on experience in full-stack mobile development, API security, and personalization algorithms."
