import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ProgressBarProps {
  progress: number; // 0 to 100
  height?: number;
  showText?: boolean;
}

export const ProgressBar = ({ progress, height = 8, showText = false }: ProgressBarProps) => {
  const clampedProgress = Math.min(Math.max(0, progress), 100);

  return (
    <View style={styles.container}>
      <View style={[styles.track, { height, borderRadius: height / 2 }]}>
        <View 
          style={[
            styles.fill, 
            { 
              width: `${clampedProgress}%`, 
              height, 
              borderRadius: height / 2 
            }
          ]} 
        />
      </View>
      {showText && (
        <Text style={styles.text}>{clampedProgress}% Completed</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 4,
  },
  track: {
    width: '100%',
    backgroundColor: '#e2e8f0',
    overflow: 'hidden',
  },
  fill: {
    backgroundColor: '#4f46e5', // Indigo-600
  },
  text: {
    marginTop: 6,
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
    textAlign: 'right',
  },
});

export default ProgressBar;
