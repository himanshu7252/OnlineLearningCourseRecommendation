import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View, StyleSheet, Text } from 'react-native';

import { useAppDispatch, useAppSelector } from '../hooks';
import { loadUser } from '../store/authSlice';
import { RootStackParamList, AuthStackParamList, OnboardingStackParamList, AppTabParamList } from './types';

// Import Screens (we will create these next)
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import HomeScreen from '../screens/HomeScreen';
import ExploreScreen from '../screens/ExploreScreen';
import MyLearningScreen from '../screens/MyLearningScreen';
import RecommendationsScreen from '../screens/RecommendationsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CourseDetailsScreen from '../screens/CourseDetailsScreen';
import LessonPlayerScreen from '../screens/LessonPlayerScreen';
import QuizScreen from '../screens/QuizScreen';

const RootStack = createStackNavigator<RootStackParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>();
const OnboardingStack = createStackNavigator<OnboardingStackParamList>();
const Tab = createBottomTabNavigator<AppTabParamList>();

// --- AUTH NAVIGATOR ---
const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
  </AuthStack.Navigator>
);

// --- ONBOARDING NAVIGATOR ---
const OnboardingNavigator = () => (
  <OnboardingStack.Navigator screenOptions={{ headerShown: false }}>
    <OnboardingStack.Screen name="OnboardingSelection" component={OnboardingScreen} />
  </OnboardingStack.Navigator>
);

// --- BOTTOM TAB NAVIGATOR ---
const AppTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName = '📚';
        if (route.name === 'HomeTab') iconName = '🏠';
        else if (route.name === 'ExploreTab') iconName = '🔍';
        else if (route.name === 'MyLearningTab') iconName = '📖';
        else if (route.name === 'RecommendationsTab') iconName = '⭐';
        else if (route.name === 'ProfileTab') iconName = '👤';
        return <Text style={{ fontSize: 20 }}>{iconName}</Text>;
      },
      tabBarActiveTintColor: '#6366f1',
      tabBarInactiveTintColor: '#94a3b8',
      tabBarStyle: {
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
        paddingBottom: 8,
        height: 60,
      },
      tabBarLabelStyle: {
        fontSize: 11,
        fontWeight: '600',
      },
      headerShown: true,
      headerStyle: {
        backgroundColor: '#ffffff',
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
      },
      headerTitleStyle: {
        fontWeight: 'bold',
        color: '#1e293b',
      },
    })}
  >
    <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: 'Home' }} />
    <Tab.Screen name="ExploreTab" component={ExploreScreen} options={{ title: 'Explore' }} />
    <Tab.Screen name="MyLearningTab" component={MyLearningScreen} options={{ title: 'My Learning' }} />
    <Tab.Screen name="RecommendationsTab" component={RecommendationsScreen} options={{ title: 'For You' }} />
    <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: 'Profile' }} />
  </Tab.Navigator>
);

// --- ROOT NAVIGATOR ---
export const RootNavigator = () => {
  const dispatch = useAppDispatch();
  const { token, user, loading } = useAppSelector(state => state.auth);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  if (loading && !token) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Loading Learning Experience...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {!token ? (
          // Unauthenticated Flow
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        ) : user && (user.skills.length === 0 || user.interests.length === 0) ? (
          // Onboarding Flow (Skills/Interests Selection)
          <RootStack.Screen name="Onboarding" component={OnboardingNavigator} />
        ) : (
          // Authenticated App Flow
          <>
            <RootStack.Screen name="MainApp" component={AppTabNavigator} />
            <RootStack.Screen 
              name="CourseDetails" 
              component={CourseDetailsScreen} 
              options={{ 
                headerShown: true, 
                title: 'Course Details',
                headerTintColor: '#1e293b'
              }} 
            />
            <RootStack.Screen 
              name="LessonPlayer" 
              component={LessonPlayerScreen} 
              options={{ 
                headerShown: true, 
                title: 'Lesson Viewer',
                headerTintColor: '#1e293b'
              }} 
            />
            <RootStack.Screen 
              name="Quiz" 
              component={QuizScreen} 
              options={{ 
                headerShown: true, 
                title: 'Lesson Quiz',
                headerTintColor: '#1e293b',
                gestureEnabled: false // Prevent sliding back mid-quiz
              }} 
            />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
});

export default RootNavigator;
