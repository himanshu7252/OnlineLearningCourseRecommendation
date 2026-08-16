import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useAppDispatch } from '../hooks';
import quizService from '../services/quizService';
import { Quiz, QuizSubmissionResult } from '../types';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { fetchCourseProgress } from '../store/progressSlice';

type QuizScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Quiz'>;
type QuizScreenRouteProp = RouteProp<RootStackParamList, 'Quiz'>;

interface Props {
  navigation: QuizScreenNavigationProp;
  route: QuizScreenRouteProp;
}

export const QuizScreen = ({ navigation, route }: Props) => {
  const { quizId, courseId, lessonId } = route.params;
  const dispatch = useAppDispatch();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<QuizSubmissionResult | null>(null);

  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        const response = await quizService.getQuizzesByCourse(courseId, lessonId);
        const activeQuiz = response.quizzes.find((q) => q._id === quizId);
        if (activeQuiz) {
          setQuiz(activeQuiz);
          // Initialize empty answers array
          setSelectedAnswers(new Array(activeQuiz.questions.length).fill(''));
        } else {
          setError('Quiz details not found');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizDetails();
  }, [quizId, courseId, lessonId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Fetching Assessment Questions...</Text>
      </View>
    );
  }

  if (error || !quiz) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error || 'Quiz not found'}</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const questions = quiz.questions;
  const currentQuestion = questions[currentIdx];
  const totalQuestions = questions.length;
  const selectedAnswer = selectedAnswers[currentIdx];

  const handleSelectOption = (option: string) => {
    if (result) return; // Prevent edits after submission
    const newAnswers = [...selectedAnswers];
    newAnswers[currentIdx] = option;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const handleSubmit = async () => {
    // Verify all questions are answered
    if (selectedAnswers.some((ans) => ans === '')) {
      Alert.alert('Validation Error', 'Please answer all questions before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await quizService.submitQuizResponse(quizId, selectedAnswers);
      setResult(res);
      // Trigger Redux course progress recalculation
      dispatch(fetchCourseProgress(courseId));
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to score quiz');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackToLesson = () => {
    navigation.goBack();
  };

  // Result UI View
  if (result) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.resultContainer}>
          <View style={[styles.scoreCard, result.passed ? styles.passedCard : styles.failedCard]}>
            <Text style={styles.scoreEmoji}>{result.passed ? '🎉' : '❌'}</Text>
            <Text style={styles.scoreHeadline}>{result.passed ? 'Passed!' : 'Failed'}</Text>
            <Text style={styles.scorePercentage}>{result.score}% Match</Text>
            <Text style={styles.scoreSub}>
              {result.correctAnswersCount} correct out of {result.totalQuestions} questions.
              (Passing limit: {result.passingScore}%)
            </Text>
          </View>

          <Text style={styles.feedbackHeader}>Review Your Answers:</Text>
          {result.feedback.map((f, idx) => (
            <View key={idx} style={[styles.feedbackItem, f.isCorrect ? styles.correctItem : styles.incorrectItem]}>
              <Text style={styles.feedbackQuestion}>Q{idx + 1}: {f.question}</Text>
              <Text style={styles.feedbackUserAns}>
                Your Choice: <Text style={styles.boldText}>{f.userAnswer}</Text>
              </Text>
              {!f.isCorrect && (
                <Text style={styles.feedbackCorrectAns}>
                  Correct Answer: <Text style={styles.boldText}>{f.correctAnswer}</Text>
                </Text>
              )}
              {f.explanation ? (
                <Text style={styles.explanationText}>💡 {f.explanation}</Text>
              ) : null}
            </View>
          ))}

          <TouchableOpacity style={styles.finishBtn} onPress={handleBackToLesson}>
            <Text style={styles.finishBtnText}>Finish Review</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Progress Tracker Header */}
        <View style={styles.quizHeader}>
          <Text style={styles.progressTracker}>
            Question {currentIdx + 1} of {totalQuestions}
          </Text>
          <View style={styles.trackBar}>
            <View
              style={[
                styles.fillBar,
                { width: `${((currentIdx + 1) / totalQuestions) * 100}%` },
              ]}
            />
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.questionScroll}>
          {/* Question Text */}
          <Text style={styles.questionText}>{currentQuestion.question}</Text>

          {/* Options list */}
          <View style={styles.optionsList}>
            {currentQuestion.options.map((opt) => {
              const isChosen = selectedAnswer === opt;
              return (
                <TouchableOpacity
                  key={opt}
                  style={[styles.optionCard, isChosen && styles.selectedOptionCard]}
                  onPress={() => handleSelectOption(opt)}
                >
                  <Text style={[styles.optionTextLabel, isChosen && styles.selectedOptionTextLabel]}>
                    {opt}
                  </Text>
                  {isChosen && <Text style={styles.checkMarker}>✓</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* Footer controls */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.navBtn, currentIdx === 0 && styles.disabledNavBtn]}
            disabled={currentIdx === 0}
            onPress={handlePrev}
          >
            <Text style={styles.navBtnText}>◀ Back</Text>
          </TouchableOpacity>

          {currentIdx < totalQuestions - 1 ? (
            <TouchableOpacity
              style={[styles.navBtn, !selectedAnswer && styles.disabledNavBtn]}
              disabled={!selectedAnswer}
              onPress={handleNext}
            >
              <Text style={styles.navBtnText}>Next ▶</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.submitBtn, submitting && styles.disabledNavBtn]}
              disabled={submitting}
              onPress={handleSubmit}
            >
              {submitting ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.submitBtnText}>Submit Answers</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  quizHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  progressTracker: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  trackBar: {
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    marginTop: 10,
    overflow: 'hidden',
  },
  fillBar: {
    height: 6,
    backgroundColor: '#6366f1',
    borderRadius: 3,
  },
  questionScroll: {
    padding: 20,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    lineHeight: 26,
    marginBottom: 20,
  },
  optionsList: {
    marginVertical: 10,
  },
  optionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  selectedOptionCard: {
    backgroundColor: '#eff6ff',
    borderColor: '#3b82f6',
  },
  optionTextLabel: {
    fontSize: 15,
    color: '#334155',
    fontWeight: '500',
    flex: 1,
  },
  selectedOptionTextLabel: {
    color: '#1d4ed8',
    fontWeight: 'bold',
  },
  checkMarker: {
    color: '#1d4ed8',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    backgroundColor: '#ffffff',
  },
  navBtn: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  disabledNavBtn: {
    opacity: 0.5,
  },
  navBtnText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: 'bold',
  },
  submitBtn: {
    backgroundColor: '#6366f1',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  resultContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  scoreCard: {
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  passedCard: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  failedCard: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fca5a5',
  },
  scoreEmoji: {
    fontSize: 50,
    marginBottom: 10,
  },
  scoreHeadline: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  scorePercentage: {
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  scoreSub: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  feedbackHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  feedbackItem: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  correctItem: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  incorrectItem: {
    backgroundColor: '#fff5f5',
    borderColor: '#feb2b2',
  },
  feedbackQuestion: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 6,
  },
  feedbackUserAns: {
    fontSize: 13,
    color: '#475569',
  },
  feedbackCorrectAns: {
    fontSize: 13,
    color: '#c53030',
    marginTop: 4,
  },
  boldText: {
    fontWeight: 'bold',
  },
  explanationText: {
    fontSize: 12,
    color: '#4a5568',
    marginTop: 8,
    fontStyle: 'italic',
    lineHeight: 16,
  },
  finishBtn: {
    backgroundColor: '#6366f1',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  finishBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#64748b',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  backBtn: {
    backgroundColor: '#6366f1',
    borderRadius: 6,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default QuizScreen;
