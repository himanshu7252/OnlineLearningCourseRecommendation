import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Course } from '../types';
import RatingStars from './RatingStars';

interface CourseCardProps {
  course: Course;
  onPress: () => void;
}

export const CourseCard = ({ course, onPress }: CourseCardProps) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      {course.thumbnail ? (
        <Image source={{ uri: course.thumbnail }} style={styles.thumbnail} />
      ) : (
        <View style={[styles.thumbnail, styles.placeholderThumbnail]}>
          <Text style={styles.placeholderIcon}>📚</Text>
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.badgeRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.badgeText}>{course.category}</Text>
          </View>
          <View style={[styles.levelBadge, styles[course.level]]}>
            <Text style={styles.levelText}>{course.level}</Text>
          </View>
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {course.title}
        </Text>
        <Text style={styles.instructor}>by {course.instructor}</Text>

        <View style={styles.ratingRow}>
          <RatingStars rating={course.rating} count={course.enrollmentCount} />
        </View>

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

const styles = StyleSheet.create<any>({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  thumbnail: {
    width: '100%',
    height: 140,
  },
  placeholderThumbnail: {
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 40,
  },
  content: {
    padding: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 6,
  },
  badgeText: {
    color: '#4338ca',
    fontSize: 10,
    fontWeight: 'bold',
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  Beginner: {
    backgroundColor: '#d1fae5',
  },
  Intermediate: {
    backgroundColor: '#fef3c7',
  },
  Advanced: {
    backgroundColor: '#fee2e2',
  },
  levelText: {
    color: '#1e293b',
    fontSize: 10,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    lineHeight: 22,
    marginBottom: 4,
  },
  instructor: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 8,
  },
  ratingRow: {
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 10,
  },
  duration: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  price: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#10b981',
  },
});

export default CourseCard;
