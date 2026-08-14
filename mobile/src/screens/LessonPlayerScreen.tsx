import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  Linking,
  Alert,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../hooks';
import { updateLessonProgressState, fetchCourseProgress } from '../store/progressSlice';
import quizService from '../services/quizService';
import { Quiz } from '../types';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';

type LessonPlayerScreenNavigationProp = StackNavigationProp<RootStackParamList, 'LessonPlayer'>;
type LessonPlayerScreenRouteProp = RouteProp<RootStackParamList, 'LessonPlayer'>;

interface Props {
  navigation: LessonPlayerScreenNavigationProp;
  route: RouteProp<RootStackParamList, 'LessonPlayer'>;
}

export const LessonPlayerScreen = ({ navigation, route }: Props) => {
  const { courseId, lessonId } = route.params;
  const dispatch = useAppDispatch();

  const { currentCourse } = useAppSelector((state) => state.courses);
  const { currentCourseProgress } = useAppSelector((state) => state.progress);

  const [activeLessonId, setActiveLessonId] = useState(lessonId);
  const [associatedQuiz, setAssociatedQuiz] = useState<Quiz | null>(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Sync route param into local state
  useEffect(() => {
    setActiveLessonId(lessonId);
  }, [lessonId]);

  // Fetch current lesson's quiz details
  useEffect(() => {
    if (!courseId || !activeLessonId) return;

    const fetchQuiz = async () => {
      setQuizLoading(true);
      try {
        const response = await quizService.getQuizzesByCourse(courseId, activeLessonId);
        if (response.quizzes && response.quizzes.length > 0) {
          setAssociatedQuiz(response.quizzes[0]);
        } else {
          setAssociatedQuiz(null);
        }
      } catch (err) {
        console.error('Error fetching quiz for lesson:', err);
      } finally {
        setQuizLoading(false);
      }
    };

    fetchQuiz();
    dispatch(fetchCourseProgress(courseId));
  }, [courseId, activeLessonId, dispatch]);

  if (!currentCourse || !currentCourse.lessons) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>No course loaded</Text>
      </View>
    );
  }

  const lessons = currentCourse.lessons;
  const activeLesson = lessons.find((l) => l._id === activeLessonId) || lessons[0];
  const activeLessonProgress = currentCourseProgress.find((p) => p.lessonId === activeLesson._id);
  const isCompleted = !!activeLessonProgress?.completed;

  // Find next lesson
  const activeIndex = lessons.findIndex((l) => l._id === activeLesson._id);
  const nextLesson = activeIndex !== -1 && activeIndex < lessons.length - 1 
    ? lessons[activeIndex + 1] 
    : null;

  const handleMarkCompleted = async () => {
    try {
      await dispatch(
        updateLessonProgressState({
          courseId,
          lessonId: activeLesson._id,
          completed: true,
          watchedDuration: 120, // Simulated watch length
        })
      ).unwrap();
      dispatch(fetchCourseProgress(courseId));
    } catch (e: any) {
      Alert.alert('Error', e || 'Failed to update progress');
    }
  };

  const handleNextLesson = () => {
    if (nextLesson) {
      setActiveLessonId(nextLesson._id);
      setIsPlaying(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Video Box Wrapper */}
      <View style={styles.videoPlayerContainer}>
        {isPlaying ? (
          <View style={styles.videoCanvas}>
            <ActivityIndicator size="small" color="#ffffff" style={styles.videoSpinner} />
            <Text style={styles.videoCanvasText}>📺 Streaming video source...</Text>
            <TouchableOpacity onPress={() => setIsPlaying(false)} style={styles.videoBtn}>
              <Text style={styles.videoBtnText}>Pause ⏸️</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[styles.videoCanvas, styles.videoPoster]}>
            <Text style={styles.playIcon}>▶️</Text>
            <Text style={styles.videoCanvasText}>Simulated Lesson Video</Text>
            <TouchableOpacity onPress={() => setIsPlaying(true)} style={styles.videoPlayBtn}>
              <Text style={styles.videoBtnText}>Start Watching</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.meta}>
          <Text style={styles.lessonOrder}>Lesson {activeLesson.order} of {lessons.length}</Text>
          <Text style={styles.lessonTitle}>{activeLesson.title}</Text>
          <Text style={styles.lessonDuration}>⏱️ {activeLesson.duration}</Text>
        </View>

        {/* Completion check info */}
        <View style={styles.progressBanner}>
          <Text style={styles.statusLabel}>Status:</Text>
          <Text style={[styles.statusValue, isCompleted ? styles.completedText : styles.pendingText]}>
            {isCompleted ? '✅ Completed' : '⏳ In Progress'}
          </Text>
        </View>

        {/* Action Panel */}
        <View style={styles.actionPanel}>
          {!isCompleted && (
            <TouchableOpacity style={styles.completeBtn} onPress={handleMarkCompleted}>
              <Text style={styles.completeBtnText}>Mark as Completed ✓</Text>
            </TouchableOpacity>
          )}

          {/* Quiz Prompt */}
          {quizLoading ? (
            <ActivityIndicator size="small" color="#6366f1" style={{ marginVertical: 10 }} />
          ) : associatedQuiz ? (
            <View style={styles.quizBox}>
              <Text style={styles.quizHeadline}>📝 Lesson Assessment Required</Text>
              <Text style={styles.quizSub}>
                {activeLessonProgress?.quizScore !== undefined && activeLessonProgress.quizScore !== null
                  ? `Best Score: ${activeLessonProgress.quizScore}% (${isCompleted ? 'Passed' : 'Failed'})`
                  : 'Test your understanding before advancing.'}
              </Text>
              <TouchableOpacity
                style={styles.quizBtn}
                onPress={() =>
                  navigation.navigate('Quiz', {
                    quizId: associatedQuiz._id,
                    courseId,
                    lessonId: activeLesson._id,
                  })
                }
              >
                <Text style={styles.quizBtnText}>
                  {activeLessonProgress?.quizScore !== undefined && activeLessonProgress.quizScore !== null 
                    ? 'Retake Quiz ✍️' 
                    : 'Start Lesson Quiz ✍️'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>

        {/* Lesson Description */}
        <Text style={styles.descTitle}>Lesson Overview</Text>
        <Text style={styles.descBody}>
          {activeLesson.description || 'No description provided for this lesson.'}
        </Text>

        {/* Supplementary Resources */}
        {activeLesson.resources && activeLesson.resources.length > 0 && (
          <View style={styles.resourcesSection}>
            <Text style={styles.descTitle}>Resources</Text>
            {activeLesson.resources.map((url, idx) => (
              <TouchableOpacity key={idx} onPress={() => Linking.openURL(url)} style={styles.resourceLink}>
                <Text style={styles.resourceLinkText}>🔗 Link: {url}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Next Lesson footer control */}
        {nextLesson ? (
          <TouchableOpacity style={styles.nextLessonBtn} onPress={handleNextLesson}>
            <View style={styles.nextLessonCol}>
              <Text style={styles.nextLabel}>Next Up:</Text>
              <Text style={styles.nextTitle} numberOfLines={1}>{nextLesson.title}</Text>
            </View>
            <Text style={styles.nextArrow}>➡️</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.congratsCard}>
            <Text style={styles.congratsTitle}>🎉 You reached the end!</Text>
            <Text style={styles.congratsSub}>If all lessons are marked checked, you have completed the course!</Text>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.backBtnText}>Back to Course Syllabus</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  videoPlayerContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#000000',
  },
  videoCanvas: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  videoPoster: {
    backgroundColor: '#1e293b',
  },
  playIcon: {
    fontSize: 44,
    marginBottom: 6,
  },
  videoCanvasText: {
    color: '#cbd5e1',
    fontSize: 13,
    marginBottom: 10,
  },
  videoPlayBtn: {
    backgroundColor: '#6366f1',
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  videoBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  videoBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  videoSpinner: {
    marginBottom: 8,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  meta: {
    marginBottom: 16,
  },
  lessonOrder: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  lessonTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 4,
    marginBottom: 6,
  },
  lessonDuration: {
    fontSize: 13,
    color: '#64748b',
  },
  progressBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  statusLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#475569',
    marginRight: 6,
  },
  statusValue: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  completedText: {
    color: '#10b981',
  },
  pendingText: {
    color: '#f59e0b',
  },
  actionPanel: {
    marginBottom: 20,
  },
  completeBtn: {
    backgroundColor: '#4f46e5',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  completeBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  quizBox: {
    backgroundColor: '#faf5ff',
    borderWidth: 1,
    borderColor: '#e9d5ff',
    borderRadius: 8,
    padding: 14,
  },
  quizHeadline: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6b21a8',
    marginBottom: 2,
  },
  quizSub: {
    fontSize: 12,
    color: '#7e22ce',
    marginBottom: 10,
  },
  quizBtn: {
    backgroundColor: '#7e22ce',
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center',
  },
  quizBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  descTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 10,
    marginBottom: 8,
  },
  descBody: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 20,
  },
  resourcesSection: {
    marginBottom: 20,
  },
  resourceLink: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
  },
  resourceLinkText: {
    color: '#2563eb',
    fontSize: 12,
    fontWeight: '600',
  },
  nextLessonBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 14,
    marginTop: 20,
  },
  nextLessonCol: {
    flex: 1,
    marginRight: 10,
  },
  nextLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#64748b',
    textTransform: 'uppercase',
  },
  nextTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 2,
  },
  nextArrow: {
    fontSize: 18,
  },
  congratsCard: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  congratsTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#166534',
  },
  congratsSub: {
    fontSize: 12,
    color: '#15803d',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 12,
  },
  backBtn: {
    backgroundColor: '#16a34a',
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#ef4444',
    fontWeight: 'bold',
  },
});

export default LessonPlayerScreen;
