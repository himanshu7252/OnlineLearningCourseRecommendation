import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchRecommendations, fetchRelatedRecommendations, fetchSkillGapRecommendations } from '../store/recommendationSlice';
import RecommendationCard from '../components/RecommendationCard';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';

type RecommendationsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface Props {
  navigation: RecommendationsScreenNavigationProp;
}

type SubTab = 'personalized' | 'because-you-watched' | 'skill-gap';

export const RecommendationsScreen = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();
  const { recommendations, relatedRecommendations, skillGap, loading } = useAppSelector(
    (state) => state.recommendations
  );
  const { enrollments } = useAppSelector((state) => state.enrollments);

  const [activeTab, setActiveTab] = useState<SubTab>('personalized');

  const activeEnrollments = enrollments.filter(e => e.status === 'ACTIVE');
  const watchedReferenceCourse = activeEnrollments.length > 0 ? activeEnrollments[0].courseId : null;

  useEffect(() => {
    dispatch(fetchRecommendations());

    if (watchedReferenceCourse) {
      dispatch(fetchRelatedRecommendations(watchedReferenceCourse._id));
    }

    dispatch(fetchSkillGapRecommendations('React Native Developer')); // Default role
  }, [dispatch, watchedReferenceCourse?._id]);

  const handleTabChange = (tab: SubTab) => {
    setActiveTab(tab);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      );
    }

    if (activeTab === 'personalized') {
      return recommendations.length > 0 ? (
        <FlatList
          data={recommendations}
          keyExtractor={(item) => item.course._id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <RecommendationCard
              recommendation={item}
              onPress={() => navigation.navigate('CourseDetails', { courseId: item.course._id })}
            />
          )}
        />
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>⭐</Text>
          <Text style={styles.emptyTitle}>No Recommendations Yet</Text>
          <Text style={styles.emptyDesc}>
            Complete your onboarding or enroll in courses to help our hybrid engine generate scores.
          </Text>
        </View>
      );
    }

    if (activeTab === 'because-you-watched') {
      if (!watchedReferenceCourse) {
        return (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🎬</Text>
            <Text style={styles.emptyTitle}>Enroll in a Course First</Text>
            <Text style={styles.emptyDesc}>
              We recommend similar content based on courses you are actively watching.
            </Text>
          </View>
        );
      }

      return relatedRecommendations.length > 0 ? (
        <View style={styles.fullWidth}>
          <View style={styles.referenceBanner}>
            <Text style={styles.referenceLabel}>Showing similar courses to:</Text>
            <Text style={styles.referenceTitle}>"{watchedReferenceCourse.title}"</Text>
          </View>
          <FlatList
            data={relatedRecommendations}
            keyExtractor={(item) => item.course._id}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => (
              <RecommendationCard
                recommendation={item}
                onPress={() => navigation.navigate('CourseDetails', { courseId: item.course._id })}
              />
            )}
          />
        </View>
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🎬</Text>
          <Text style={styles.emptyTitle}>No Related Topics Found</Text>
          <Text style={styles.emptyDesc}>
            All matching courses are already in your active enrollments pool.
          </Text>
        </View>
      );
    }

    if (activeTab === 'skill-gap') {
      if (!skillGap) return null;

      return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.gapCard}>
            <Text style={styles.roleTitle}>Target Role: {skillGap.role}</Text>

            <Text style={styles.gapLabel}>Current Gap Breakdown:</Text>
            <View style={styles.skillComparison}>
              {skillGap.skillsRequired.map((skill) => {
                const hasSkill = skillGap.userSkills.some(
                  (us) => us.toLowerCase() === skill.toLowerCase()
                );
                return (
                  <View key={skill} style={[styles.skillTag, hasSkill ? styles.hasSkill : styles.lacksSkill]}>
                    <Text style={styles.skillEmoji}>{hasSkill ? '✅' : '⚠️'}</Text>
                    <Text style={[styles.skillTagText, hasSkill ? styles.hasSkillText : styles.lacksSkillText]}>
                      {skill}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          <Text style={styles.sectionHeadline}>Targeted Skill-Gap Recommendations:</Text>
          {skillGap.recommendations.length > 0 ? (
            skillGap.recommendations.map((item) => (
              <RecommendationCard
                key={item.course._id}
                recommendation={{
                  course: item.course,
                  score: item.score,
                  reason: item.reason,
                  algorithm: 'skill-gap',
                }}
                onPress={() => navigation.navigate('CourseDetails', { courseId: item.course._id })}
              />
            ))
          ) : (
            <View style={styles.perfectMatchCard}>
              <Text style={styles.perfectText}>🎉 All skills possessed! You are qualified for this role.</Text>
            </View>
          )}
        </ScrollView>
      );
    }

    return null;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Toggle Nav Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'personalized' && styles.activeTab]}
            onPress={() => handleTabChange('personalized')}
          >
            <Text style={[styles.tabText, activeTab === 'personalized' && styles.activeTabText]}>
              Personalized Feed
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'because-you-watched' && styles.activeTab]}
            onPress={() => handleTabChange('because-you-watched')}
          >
            <Text style={[styles.tabText, activeTab === 'because-you-watched' && styles.activeTabText]}>
              Related Topics
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'skill-gap' && styles.activeTab]}
            onPress={() => handleTabChange('skill-gap')}
          >
            <Text style={[styles.tabText, activeTab === 'skill-gap' && styles.activeTabText]}>
              Skill Gap
            </Text>
          </TouchableOpacity>
        </View>

        {renderContent()}
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingHorizontal: 8,

  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#6366f1',
  },
  tabText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#6366f1',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 84
  },
  scrollContainer: {
    padding: 16,
  },
  fullWidth: {
    flex: 1,
    width: '100%',
  },
  referenceBanner: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 12,
  },
  referenceLabel: {
    fontSize: 11,
    color: '#3b82f6',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  referenceTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginTop: 2,
  },
  gapCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
    marginBottom: 20,
  },
  roleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  gapLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#475569',
    marginBottom: 8,
  },
  skillComparison: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillTag: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    margin: 4,
    borderWidth: 1,
  },
  hasSkill: {
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
  },
  lacksSkill: {
    backgroundColor: '#fffbeb',
    borderColor: '#fde68a',
  },
  skillEmoji: {
    fontSize: 11,
    marginRight: 4,
  },
  skillTagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  hasSkillText: {
    color: '#065f46',
  },
  lacksSkillText: {
    color: '#92400e',
  },
  sectionHeadline: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  perfectMatchCard: {
    backgroundColor: '#ecfdf5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#a7f3d0',
    padding: 16,
    alignItems: 'center',
  },
  perfectText: {
    color: '#065f46',
    fontWeight: 'bold',
    fontSize: 13,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default RecommendationsScreen;
