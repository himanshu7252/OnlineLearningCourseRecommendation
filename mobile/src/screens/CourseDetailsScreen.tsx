import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchCourseDetail, clearCurrentCourse } from '../store/courseSlice';
import { enrollInCourse } from '../store/enrollmentSlice';
import { fetchCourseProgress } from '../store/progressSlice';
import RatingStars from '../components/RatingStars';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';

type CourseDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CourseDetails'>;
type CourseDetailsScreenRouteProp = RouteProp<RootStackParamList, 'CourseDetails'>;

interface Props {
  navigation: CourseDetailsScreenNavigationProp;
  route: CourseDetailsScreenRouteProp;
}

export const CourseDetailsScreen = ({ navigation, route }: Props) => {
  const { courseId } = route.params;
  const dispatch = useAppDispatch();
  const { currentCourse, loading: courseLoading, error } = useAppSelector((state) => state.courses);
  const { enrollments, loading: enrollLoading } = useAppSelector((state) => state.enrollments);
  const { currentCourseProgress } = useAppSelector((state) => state.progress);

  useEffect(() => {
    dispatch(fetchCourseDetail(courseId));
    dispatch(fetchCourseProgress(courseId));

    return () => {
      dispatch(clearCurrentCourse());
    };
  }, [courseId, dispatch]);

  const userEnrollment = enrollments.find(
    (e) => e.courseId && e.courseId._id.toString() === courseId.toString()
  );
  const isEnrolled = !!userEnrollment;

  const handleEnroll = async () => {
    if (enrollLoading) return;
    try {
      await dispatch(enrollInCourse(courseId)).unwrap();
      Alert.alert('Success', 'Congratulations! You have successfully enrolled.');
    } catch (e: any) {
      Alert.alert('Error', e || 'Failed to enroll');
    }
  };

  const handleStartLearning = () => {
    if (!currentCourse || !currentCourse.lessons || currentCourse.lessons.length === 0) return;
    
    // Resume at last accessed lesson, or default to first lesson
    const nextLessonId = userEnrollment?.lastAccessedLesson || currentCourse.lessons[0]._id;

    navigation.navigate('LessonPlayer', {
      courseId: currentCourse._id,
      lessonId: nextLessonId,
    });
  };

  if (courseLoading && !currentCourse) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Fetching Course Details...</Text>
      </View>
    );
  }

  if (error || !currentCourse) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>⚠️ {error || 'Course not found'}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Banner Image */}
        {currentCourse.thumbnail ? (
          <Image source={{ uri: currentCourse.thumbnail }} style={styles.thumbnail} />
        ) : (
          <View style={styles.placeholderThumbnail}>
            <Text style={styles.placeholderIcon}>📚</Text>
          </View>
        )}

        <View style={styles.infoBlock}>
          {/* Category Badges */}
          <View style={styles.badgeRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.badgeText}>{currentCourse.category}</Text>
            </View>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>{currentCourse.level}</Text>
            </View>
          </View>

          <Text style={styles.title}>{currentCourse.title}</Text>
          <Text style={styles.instructor}>Created by {currentCourse.instructor}</Text>

          <View style={styles.statsRow}>
            <RatingStars rating={currentCourse.rating} size={15} count={currentCourse.enrollmentCount} />
            <Text style={styles.dot}>•</Text>
            <Text style={styles.duration}>⏱️ {currentCourse.duration}</Text>
          </View>

          {/* Action Subscription Button */}
          {isEnrolled ? (
            <View style={styles.enrolledActionRow}>
              <View style={styles.enrolledBadge}>
                <Text style={styles.enrolledText}>✓ Enrolled ({userEnrollment.progressPercentage}% complete)</Text>
              </View>
              <TouchableOpacity style={styles.primaryBtn} onPress={handleStartLearning}>
                <Text style={styles.primaryBtnText}>Resume Course ▶️</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.enrollBtn} onPress={handleEnroll} disabled={enrollLoading}>
              {enrollLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.enrollBtnText}>
                  Enroll Now ({currentCourse.price === 0 ? 'Free' : `$${currentCourse.price.toFixed(2)}`})
                </Text>
              )}
            </TouchableOpacity>
          )}

          {/* Course description */}
          <Text style={styles.sectionTitle}>Course Description</Text>
          <Text style={styles.body}>{currentCourse.description}</Text>

          {/* Skills Covered */}
          <Text style={styles.sectionTitle}>Skills You Will Learn</Text>
          <View style={styles.chipRow}>
            {currentCourse.skills.map((skill) => (
              <View key={skill} style={styles.skillChip}>
                <Text style={styles.skillChipText}>⚡ {skill}</Text>
              </View>
            ))}
          </View>

          {/* Prerequisites */}
          {currentCourse.requirements && currentCourse.requirements.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Prerequisites</Text>
              {currentCourse.requirements.map((req, idx) => (
                <Text key={idx} style={styles.bulletItem}>
                  • {req}
                </Text>
              ))}
            </>
          )}

          {/* Course Content / Lessons List */}
          <Text style={styles.sectionTitle}>Course Content ({currentCourse.lessons?.length || 0} Lessons)</Text>
          {currentCourse.lessons && currentCourse.lessons.length > 0 ? (
            currentCourse.lessons.map((lesson) => {
              const isCompleted = currentCourseProgress.some(
                (p) => p.lessonId === lesson._id && p.completed
              );

              return (
                <TouchableOpacity
                  key={lesson._id}
                  style={[styles.lessonRow, !isEnrolled && styles.disabledLessonRow]}
                  disabled={!isEnrolled}
                  onPress={() =>
                    navigation.navigate('LessonPlayer', {
                      courseId: currentCourse._id,
                      lessonId: lesson._id,
                    })
                  }
                >
                  <View style={styles.lessonMeta}>
                    <Text style={styles.lessonOrder}>{lesson.order}</Text>
                    <View style={styles.lessonDetails}>
                      <Text style={styles.lessonTitle} numberOfLines={1}>
                        {lesson.title}
                      </Text>
                      <Text style={styles.lessonDuration}>⏱️ {lesson.duration}</Text>
                    </View>
                  </View>

                  <View style={styles.lessonStateIcon}>
                    {isCompleted ? (
                      <Text style={styles.statusText}>✅</Text>
                    ) : isEnrolled ? (
                      <Text style={styles.statusText}>▶️</Text>
                    ) : (
                      <Text style={styles.statusText}>🔒</Text>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })
          ) : (
            <Text style={styles.noLessons}>No lessons uploaded yet for this course.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flexGrow: 1,
  },
  thumbnail: {
    width: '100%',
    height: 200,
  },
  placeholderThumbnail: {
    width: '100%',
    height: 200,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 60,
  },
  infoBlock: {
    padding: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryBadge: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    marginRight: 8,
  },
  badgeText: {
    color: '#4338ca',
    fontSize: 11,
    fontWeight: 'bold',
  },
  levelBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  levelText: {
    color: '#334155',
    fontSize: 11,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 6,
  },
  instructor: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dot: {
    marginHorizontal: 8,
    color: '#94a3b8',
  },
  duration: {
    fontSize: 13,
    color: '#64748b',
  },
  enrollBtn: {
    backgroundColor: '#6366f1',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 24,
  },
  enrollBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  enrolledActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
  },
  enrolledBadge: {
    flex: 1,
    marginRight: 10,
  },
  enrolledText: {
    color: '#166534',
    fontWeight: 'bold',
    fontSize: 12,
  },
  primaryBtn: {
    backgroundColor: '#16a34a',
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  primaryBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 6,
  },
  body: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 4,
  },
  skillChip: {
    backgroundColor: '#faf5ff',
    borderWidth: 1,
    borderColor: '#e9d5ff',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    margin: 4,
  },
  skillChipText: {
    color: '#6b21a8',
    fontSize: 12,
    fontWeight: '600',
  },
  bulletItem: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
    marginLeft: 6,
  },
  lessonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  disabledLessonRow: {
    opacity: 0.6,
  },
  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  lessonOrder: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#94a3b8',
    width: 28,
  },
  lessonDetails: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  lessonDuration: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  lessonStateIcon: {
    marginLeft: 12,
  },
  statusText: {
    fontSize: 16,
  },
  noLessons: {
    fontSize: 13,
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#64748b',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default CourseDetailsScreen;
