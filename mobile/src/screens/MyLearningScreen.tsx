import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Image,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchEnrollments } from '../store/enrollmentSlice';
import ProgressBar from '../components/ProgressBar';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';

type MyLearningScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface Props {
  navigation: MyLearningScreenNavigationProp;
}

export const MyLearningScreen = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();
  const { enrollments, loading } = useAppSelector((state) => state.enrollments);

  useEffect(() => {
    dispatch(fetchEnrollments());
  }, [dispatch]);

  const handleResume = (courseId: string, lastAccessedLesson?: string) => {
    navigation.navigate('LessonPlayer', {
      courseId,
      lessonId: lastAccessedLesson || '',
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {loading && enrollments.length === 0 ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#6366f1" />
          </View>
        ) : enrollments.length > 0 ? (
          <FlatList
            data={enrollments}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => {
              const course = item.courseId;
              if (!course) return null;

              return (
                <View style={styles.enrollmentCard}>
                  {course.thumbnail ? (
                    <Image source={{ uri: course.thumbnail }} style={styles.thumbnail} />
                  ) : (
                    <View style={styles.placeholderThumbnail}>
                      <Text style={styles.placeholderIcon}>📚</Text>
                    </View>
                  )}

                  <View style={styles.content}>
                    <Text style={styles.category}>{course.category}</Text>
                    <Text style={styles.title} numberOfLines={1}>
                      {course.title}
                    </Text>
                    <Text style={styles.instructor}>by {course.instructor}</Text>

                    <View style={styles.progressSection}>
                      <ProgressBar progress={item.progressPercentage} height={6} />
                      <View style={styles.progressMeta}>
                        <Text style={styles.progressPercent}>{item.progressPercentage}% Complete</Text>
                        <Text style={styles.statusText}>{item.status}</Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      style={[styles.actionBtn, item.status === 'COMPLETED' && styles.completedBtn]}
                      onPress={() => handleResume(course._id, item.lastAccessedLesson)}
                    >
                      <Text style={styles.actionBtnText}>
                        {item.status === 'COMPLETED' ? 'Review Lessons 🔄' : 'Continue Learning ▶️'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📖</Text>
            <Text style={styles.emptyTitle}>No Enrollments Yet</Text>
            <Text style={styles.emptyDesc}>
              Browse through our catalogs and subscribe to courses to kick off your profile analytics.
            </Text>
            <TouchableOpacity
              style={styles.exploreBtn}
              onPress={() => navigation.navigate('MainApp', { screen: 'ExploreTab' })}
            >
              <Text style={styles.exploreBtnText}>Explore Course Catalog</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 84
  },
  enrollmentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    marginBottom: 16,
    flexDirection: 'row',
    height: 160,
  },
  thumbnail: {
    width: 100,
    height: '100%',
  },
  placeholderThumbnail: {
    width: 100,
    height: '100%',
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 32,
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  category: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#6366f1',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  instructor: {
    fontSize: 11,
    color: '#64748b',
  },
  progressSection: {
    marginVertical: 4,
  },
  progressMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  progressPercent: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
  },
  statusText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#10b981',
    textTransform: 'uppercase',
  },
  actionBtn: {
    backgroundColor: '#6366f1',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
  },
  completedBtn: {
    backgroundColor: '#10b981',
  },
  actionBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyIcon: {
    fontSize: 50,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  exploreBtn: {
    backgroundColor: '#6366f1',
    borderRadius: 6,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  exploreBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default MyLearningScreen;
