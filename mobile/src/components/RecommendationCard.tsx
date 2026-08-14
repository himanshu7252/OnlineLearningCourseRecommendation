import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Recommendation } from '../types';
import RatingStars from './RatingStars';

interface RecommendationCardProps {
  recommendation: Recommendation;
  onPress: () => void;
}

export const RecommendationCard = ({ recommendation, onPress }: RecommendationCardProps) => {
  const { course, score, reason } = recommendation;
  const matchPercentage = Math.round(score * 100);

  // Score color scaling
  const scoreColor = matchPercentage >= 80 
    ? '#10b981' // Green
    : matchPercentage >= 60 
      ? '#6366f1' // Indigo
      : '#f59e0b'; // Amber

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      {course.thumbnail ? (
        <Image source={{ uri: course.thumbnail }} style={styles.thumbnail} />
      ) : (
        <View style={[styles.thumbnail, styles.placeholderThumbnail]}>
          <Text style={styles.placeholderIcon}>📚</Text>
        </View>
      )}

      {/* Match Score Ribbon */}
      <View style={[styles.matchRibbon, { backgroundColor: scoreColor }]}>
        <Text style={styles.matchText}>{matchPercentage}% Match</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {course.title}
        </Text>
        
        <View style={styles.metaRow}>
          <Text style={styles.category}>{course.category}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.level}>{course.level}</Text>
        </View>

        <RatingStars rating={course.rating} size={12} />

        {/* Dynamic justification bubble */}
        {reason ? (
          <View style={styles.reasonBox}>
            <Text style={styles.reasonText} numberOfLines={2}>
              💡 {reason}
            </Text>
          </View>
        ) : null}

        <View style={styles.footer}>
          <Text style={styles.duration}>⏱️ {course.duration}</Text>
          <Text style={styles.price}>
            {course.price === 0 ? 'Free' : `$${course.price.toFixed(2)}`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: 120,
  },
  placeholderThumbnail: {
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 40,
  },
  matchRibbon: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  matchText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
    paddingRight: 60, // Avoid overlapping ribbon area if text wraps high
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  category: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4f46e5',
  },
  dot: {
    marginHorizontal: 6,
    color: '#94a3b8',
  },
  level: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  reasonBox: {
    backgroundColor: '#f8fafc',
    borderLeftWidth: 3,
    borderLeftColor: '#6366f1',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 4,
    marginVertical: 10,
  },
  reasonText: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 16,
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 8,
    marginTop: 4,
  },
  duration: {
    fontSize: 12,
    color: '#64748b',
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#10b981',
  },
});

export default RecommendationCard;
