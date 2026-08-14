import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface RatingStarsProps {
  rating: number;
  count?: number; // Optional number of reviews
  size?: number;
}

export const RatingStars = ({ rating, count, size = 14 }: RatingStarsProps) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  
  let starsString = '';
  for (let i = 0; i < fullStars; i++) {
    starsString += '⭐';
  }
  if (hasHalf) {
    starsString += '⭐'; // Simple fallback or half representation
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.stars, { fontSize: size }]}>{starsString}</Text>
      <Text style={[styles.number, { fontSize: size }]}> {rating.toFixed(1)}</Text>
      {count !== undefined && (
        <Text style={[styles.count, { fontSize: size - 2 }]}> ({count})</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stars: {
    letterSpacing: 2,
  },
  number: {
    fontWeight: 'bold',
    color: '#b45309', // Amber-700
  },
  count: {
    color: '#64748b',
  },
});

export default RatingStars;
