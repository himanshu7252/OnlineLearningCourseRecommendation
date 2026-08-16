import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type OnboardingStackParamList = {
  OnboardingSelection: undefined;
};

export type AppTabParamList = {
  HomeTab: undefined;
  ExploreTab: undefined;
  MyLearningTab: undefined;
  RecommendationsTab: undefined;
  ProfileTab: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Onboarding: NavigatorScreenParams<OnboardingStackParamList>;
  MainApp: NavigatorScreenParams<AppTabParamList>;
  CourseDetails: { courseId: string };
  LessonPlayer: { courseId: string; lessonId: string };
  Quiz: { quizId: string; courseId: string; lessonId: string };
};
