import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchRecommendations, fetchSkillGapRecommendations } from '../store/recommendationSlice';
import { fetchEnrollments } from '../store/enrollmentSlice';
import { fetchCourses } from '../store/courseSlice';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import ProgressBar from '../components/ProgressBar';
import CourseCard from '../components/CourseCard';
import RecommendationCard from '../components/RecommendationCard';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const CAREER_ROLES = [
  'React Native Developer',
  'Data Scientist',
  'Full Stack Developer',
  'AI Engineer',
];

export const HomeScreen = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { recommendations, skillGap, loading: recLoading } = useAppSelector(state => state.recommendations);
  const { enrollments, loading: enrollLoading } = useAppSelector(state => state.enrollments);
  const { courses } = useAppSelector(state => state.courses);

  const [selectedRole, setSelectedRole] = useState(CAREER_ROLES[0]);

  useEffect(() => {
    dispatch(fetchRecommendations());
    dispatch(fetchEnrollments());
    dispatch(fetchCourses());
  }, [dispatch]);

  useEffect(() => {
    if (selectedRole) {
      dispatch(fetchSkillGapRecommendations(selectedRole));
    }
  }, [selectedRole, dispatch]);

  const activeEnrollments = enrollments.filter(e => e.status === 'ACTIVE');
  const continueCourse = activeEnrollments.length > 0 ? activeEnrollments[0] : null;

  // Filter popular courses: sort by enrollmentCount and rating desc
  const popularCourses = [...courses]
    .sort((a, b) => (b.enrollmentCount || 0) - (a.enrollmentCount || 0) || b.rating - a.rating)
    .slice(0, 4);

  const handleRefresh = () => {
    dispatch(fetchRecommendations());
    dispatch(fetchEnrollments());
    dispatch(fetchCourses());
    if (selectedRole) {
      dispatch(fetchSkillGapRecommendations(selectedRole));
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Morning, {user?.name || 'Learner'} 👋</Text>
            <Text style={styles.welcomeSubtitle}>Ready to acquire new skills today?</Text>
          </View>
          <TouchableOpacity onPress={handleRefresh} style={styles.refreshBtn}>
            <Text style={styles.refreshText}>🔄</Text>
          </TouchableOpacity>
        </View>

        {/* Continue Learning Widget */}
        {continueCourse && continueCourse.courseId ? (
          <View style={styles.continueCard}>
            <Text style={styles.sectionHeader}>Continue Learning 📖</Text>
            <View style={styles.continueContent}>
              <Text style={styles.continueTitle}>{continueCourse.courseId.title}</Text>
              <Text style={styles.continueInstructor}>by {continueCourse.courseId.instructor}</Text>
              <View style={styles.progressRow}>
                <ProgressBar progress={continueCourse.progressPercentage} height={8} />
                <Text style={styles.progressText}>{continueCourse.progressPercentage}% completed</Text>
              </View>
              <TouchableOpacity
                style={styles.resumeBtn}
                onPress={() =>
                  navigation.navigate('LessonPlayer', {
                    courseId: continueCourse.courseId._id,
                    lessonId: continueCourse.lastAccessedLesson || '',
                  })
                }
              >
                <Text style={styles.resumeText}>Resume Course ▶️</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        {/* Recommended For You Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeader}>Recommended For You ⭐</Text>
            <TouchableOpacity onPress={() => navigation.navigate('MainApp', { screen: 'RecommendationsTab' })}>
              <Text style={styles.seeAll}>See Details</Text>
            </TouchableOpacity>
          </View>

          {recLoading ? (
            <ActivityIndicator size="small" color="#6366f1" />
          ) : recommendations.length > 0 ? (
            <FlatList
              horizontal
              data={recommendations.slice(0, 4)}
              keyExtractor={item => item.course._id}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.horizontalCardContainer}>
                  <RecommendationCard
                    recommendation={item}
                    onPress={() => navigation.navigate('CourseDetails', { courseId: item.course._id })}
                  />
                </View>
              )}
            />
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>Updating recommendations based on your activity...</Text>
            </View>
          )}
        </View>

        {/* Skill-Gap Analysis Module */}
        <View style={styles.skillGapCard}>
          <Text style={styles.skillGapHeader}>Skill Gap Analyzer 🎯</Text>
          <Text style={styles.skillGapSubtitle}>
            Select a career role to measure your skills and view targeted recommendations:
          </Text>

          {/* Role selector dropdown emulator */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.roleTabs}>
            {CAREER_ROLES.map(role => (
              <TouchableOpacity
                key={role}
                style={[styles.roleTab, selectedRole === role && styles.selectedRoleTab]}
                onPress={() => setSelectedRole(role)}
              >
                <Text style={[styles.roleTabText, selectedRole === role && styles.selectedRoleTabText]}>
                  {role}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {skillGap && (
            <View style={styles.skillGapReport}>
              <View style={styles.skillStats}>
                <Text style={styles.reportLabel}>Required Skills Status:</Text>
                <View style={styles.skillsList}>
                  {skillGap.skillsRequired.map(skill => {
                    const hasSkill = skillGap.userSkills.some(
                      us => us.toLowerCase() === skill.toLowerCase()
                    );
                    return (
                      <View key={skill} style={styles.skillCheckItem}>
                        <Text style={styles.checkIcon}>{hasSkill ? '✅' : '❌'}</Text>
                        <Text style={[styles.skillCheckText, !hasSkill && styles.missingSkillText]}>
                          {skill}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>

              {skillGap.missingSkills.length > 0 ? (
                <View style={styles.gapResolution}>
                  <Text style={styles.recommendationHeadline}>
                    Bridge your gap with these courses:
                  </Text>
                  {skillGap.recommendations.map(rec => (
                    <TouchableOpacity
                      key={rec.course._id}
                      style={styles.gapCourseItem}
                      onPress={() => navigation.navigate('CourseDetails', { courseId: rec.course._id })}
                    >
                      <View style={styles.gapCourseHeader}>
                        <Text style={styles.gapCourseTitle}>{rec.course.title}</Text>
                        <Text style={styles.gapCourseBadge}>Teaches: {rec.matchedSkills.join(', ')}</Text>
                      </View>
                      <Text style={styles.gapCourseAction}>Enroll Now ➡️</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <Text style={styles.allSetMessage}>
                  🎉 You have all skills matching this profile!
                </Text>
              )}
            </View>
          )}
        </View>

        {/* Popular Courses Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Popular Courses 🔥</Text>
          {popularCourses.map(course => (
            <CourseCard
              key={course._id}
              course={course}
              onPress={() => navigation.navigate('CourseDetails', { courseId: course._id })}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 8,
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  welcomeSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
  },
  refreshBtn: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshText: {
    fontSize: 16,
  },
  continueCard: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  continueContent: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 14,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  continueTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  continueInstructor: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
    marginBottom: 10,
  },
  progressRow: {
    marginBottom: 12,
  },
  progressText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
    textAlign: 'right',
    marginTop: 4,
  },
  resumeBtn: {
    backgroundColor: '#3b82f6',
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center',
  },
  resumeText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  seeAll: {
    fontSize: 13,
    color: '#6366f1',
    fontWeight: '600',
  },
  horizontalCardContainer: {
    width: 280,
    marginRight: 16,
  },
  emptyCard: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#64748b',
    fontSize: 13,
    textAlign: 'center',
  },
  skillGapCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
    marginBottom: 24,
  },
  skillGapHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  skillGapSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 14,
    lineHeight: 18,
  },
  roleTabs: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  roleTab: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  selectedRoleTab: {
    backgroundColor: '#e0e7ff',
    borderColor: '#6366f1',
  },
  roleTabText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  selectedRoleTabText: {
    color: '#4338ca',
  },
  skillGapReport: {
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12,
  },
  skillStats: {
    marginBottom: 8,
  },
  reportLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#475569',
    marginBottom: 8,
  },
  skillsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  skillCheckItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    margin: 4,
  },
  checkIcon: {
    fontSize: 11,
    marginRight: 4,
  },
  skillCheckText: {
    fontSize: 12,
    color: '#1e293b',
    fontWeight: '500',
  },
  missingSkillText: {
    color: '#64748b',
  },
  gapResolution: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  recommendationHeadline: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#475569',
    marginBottom: 8,
  },
  gapCourseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 6,
    padding: 10,
    marginBottom: 6,
  },
  gapCourseHeader: {
    flex: 1,
    marginRight: 10,
  },
  gapCourseTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  gapCourseBadge: {
    fontSize: 10,
    color: '#6366f1',
    fontWeight: '600',
    marginTop: 2,
  },
  gapCourseAction: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#10b981',
  },
  allSetMessage: {
    color: '#10b981',
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default HomeScreen;
