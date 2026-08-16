import React, { useEffect, useRef } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import BootSplash from 'react-native-bootsplash';
import { ActivityIndicator, View, StyleSheet, Text, TouchableOpacity, Animated, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import * as shape from 'd3-shape';
import TabIcon from '../components/TabIcon';

import { useAppDispatch, useAppSelector } from '../hooks';
import { loadUser } from '../store/authSlice';
import { RootStackParamList, AuthStackParamList, OnboardingStackParamList, AppTabParamList } from './types';

// Import Screens (we will create these next)
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
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
    <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </AuthStack.Navigator>
);

// --- ONBOARDING NAVIGATOR ---
const OnboardingNavigator = () => (
  <OnboardingStack.Navigator screenOptions={{ headerShown: false }}>
    <OnboardingStack.Screen name="OnboardingSelection" component={OnboardingScreen} />
  </OnboardingStack.Navigator>
);

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TAB_WIDTH = SCREEN_WIDTH / 5;

// Generate the exact curve path used by the library
const getCustomPath = (width: number, height: number, centerWidth: number, cutOutX: number) => {
  const circleWidth = centerWidth + 16;
  const position = cutOutX - circleWidth / 2;
  const trim = cutOutX;

  const linePart = `M 0 0 L ${position - 20} 0`;

  const curveGen = shape
    .line()
    .curve(shape.curveBasis);

  const curvePath = curveGen([
    [position - 20, 0],
    [position - 10, 2],
    [position - 2, 10],
    [position, 17],

    [trim - 25, height / 2 + 2],
    [trim - 10, height / 2 + 10],
    [trim, height / 2 + 10],
    [trim + 10, height / 2 + 10],
    [trim + 25, height / 2 + 2],

    [position + circleWidth, 17],
    [position + circleWidth + 2, 10],
    [position + circleWidth + 10, 2],
    [position + circleWidth + 20, 0],
  ]) || '';

  const curvePathWithoutM = curvePath.replace(/^M/, 'L');
  const endPart = `L ${width} 0 L ${width} ${height} L 0 ${height} Z`;

  return `${linePart} ${curvePathWithoutM} ${endPart}`;
};

// --- CUSTOM TAB BAR WITH SLIDING CURVE ---
const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  const activeIndex = state.index;
  const animationValue = useRef(new Animated.Value(activeIndex)).current;

  useEffect(() => {
    Animated.spring(animationValue, {
      toValue: activeIndex,
      useNativeDriver: true,
      tension: 35,
      friction: 8,
    }).start();
  }, [activeIndex]);

  const translateX = animationValue.interpolate({
    inputRange: [0, 4],
    outputRange: [-2 * TAB_WIDTH, 2 * TAB_WIDTH],
  });

  const svgWidth = SCREEN_WIDTH * 3;
  const barHeight = 65;
  const cutOutX = SCREEN_WIDTH * 1.5;

  const d = getCustomPath(svgWidth, barHeight, 55, cutOutX);

  return (
    <View style={styles.tabBarContainer}>
      {/* Sliding SVG background */}
      <Animated.View
        style={[
          styles.svgContainer,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        <Svg width={svgWidth} height={barHeight} viewBox={`0 0 ${svgWidth} ${barHeight}`}>
          <Path d={d} fill="#FF6B00" />
        </Svg>
      </Animated.View>

      {/* Sliding Elevated Circle Button */}
      <Animated.View
        style={[
          styles.btnCircle,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.circleInner}
          activeOpacity={0.8}
          onPress={() => {
            const route = state.routes[activeIndex];
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!event.defaultPrevented) {
              navigation.navigate({ name: route.name, merge: true });
            }
          }}
        >
          <TabIcon name={state.routes[activeIndex].name} focused={true} color="#FF6B00" size={24} />
        </TouchableOpacity>
      </Animated.View>

      {/* Flat Tabs */}
      <View style={styles.tabsContainer}>
        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;
          const { options } = descriptors[route.key];

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate({ name: route.name, merge: true });
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={styles.tabItem}
              activeOpacity={0.7}
            >
              <View style={{ opacity: isFocused ? 0 : 1 }}>
                <TabIcon name={route.name} focused={false} color="#ffffff80" size={24} />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

// --- BOTTOM TAB NAVIGATOR ---
const AppTabNavigator = () => (
  <Tab.Navigator
    tabBar={(props) => <CustomTabBar {...props} />}
    screenOptions={{
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
    }}
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
  const { token, user, isCheckingAuth } = useAppSelector(state => state.auth);

  useEffect(() => {
    const init = async () => {
      try {
        await dispatch(loadUser());
      } catch (error) {
        console.error('Error loading user session:', error);
      } finally {
        await BootSplash.hide({ fade: true });
      }
    };
    init();
  }, [dispatch]);

  if (isCheckingAuth) {
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
              name="Onboarding"
              component={OnboardingNavigator}
            />
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
  tabBarContainer: {
    height: 65,
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  svgContainer: {
    position: 'absolute',
    top: 0,
    left: -SCREEN_WIDTH,
    width: SCREEN_WIDTH * 3,
    height: 65,
  },
  btnCircle: {
    position: 'absolute',
    bottom: 32,
    left: (SCREEN_WIDTH - 54) / 2,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  circleInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 27,
  },
  tabsContainer: {
    flexDirection: 'row',
    height: 65,
    alignItems: 'center',
  },
  tabItem: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RootNavigator;
