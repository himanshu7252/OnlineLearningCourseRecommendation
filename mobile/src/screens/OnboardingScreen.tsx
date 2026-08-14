import React, { useState } from 'react';
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
import { useAppDispatch, useAppSelector } from '../hooks';
import { updateUserProfile } from '../store/authSlice';

const AVAILABLE_INTERESTS = [
  'Web Development',
  'Mobile Development',
  'AI & Machine Learning',
  'Data Science',
  'Cybersecurity',
  'Cloud Computing',
  'Computer Science',
];

const AVAILABLE_SKILLS = [
  'JavaScript',
  'React',
  'React Native',
  'TypeScript',
  'Redux',
  'HTML',
  'CSS',
  'Node',
  'MongoDB',
  'REST APIs',
  'Python',
  'NumPy',
  'Pandas',
  'Scikit-Learn',
  'Machine Learning',
  'Neural Networks',
  'Network Security',
  'Cryptography',
  'DSA',
  'Algorithms',
  'AWS',
];

const EXPERIENCES = ['Beginner', 'Intermediate', 'Advanced'] as const;

export const OnboardingScreen = () => {
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleSave = () => {
    if (selectedInterests.length === 0) {
      Alert.alert('Validation Error', 'Please select at least one interest topic');
      return;
    }
    if (selectedSkills.length === 0) {
      Alert.alert('Validation Error', 'Please select at least one skill you possess or want to possess');
      return;
    }

    dispatch(
      updateUserProfile({
        experienceLevel: level,
        interests: selectedInterests,
        skills: selectedSkills,
        learningGoals: selectedInterests.map(i => `Become an expert in ${i}`),
      })
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome! Let's Personalize</Text>
          <Text style={styles.subtitle}>Our recommendation engine uses these options to customize your course catalog.</Text>
        </View>

        {/* Section 1: Experience Level */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Experience Level</Text>
          <View style={styles.row}>
            {EXPERIENCES.map((lvl) => (
              <TouchableOpacity
                key={lvl}
                style={[
                  styles.optionButton,
                  level === lvl && styles.selectedOptionButton,
                ]}
                onPress={() => setLevel(lvl)}
              >
                <Text
                  style={[
                    styles.optionText,
                    level === lvl && styles.selectedOptionText,
                  ]}
                >
                  {lvl}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Section 2: Interests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Select Topics of Interest</Text>
          <View style={styles.chipContainer}>
            {AVAILABLE_INTERESTS.map((interest) => {
              const isSelected = selectedInterests.includes(interest);
              return (
                <TouchableOpacity
                  key={interest}
                  style={[
                    styles.chip,
                    isSelected && styles.selectedChip,
                  ]}
                  onPress={() => toggleInterest(interest)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      isSelected && styles.selectedChipText,
                    ]}
                  >
                    {isSelected ? '✓ ' : ''}{interest}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Section 3: Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Select Current/Target Skills</Text>
          <View style={styles.chipContainer}>
            {AVAILABLE_SKILLS.map((skill) => {
              const isSelected = selectedSkills.includes(skill);
              return (
                <TouchableOpacity
                  key={skill}
                  style={[
                    styles.chip,
                    isSelected && styles.selectedChip,
                  ]}
                  onPress={() => toggleSkill(skill)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      isSelected && styles.selectedChipText,
                    ]}
                  >
                    {isSelected ? '✓ ' : ''}{skill}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.saveButtonText}>Generate Learning Feed 🚀</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  container: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f8fafc',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#cbd5e1',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingBottom: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionButton: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#475569',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  selectedOptionButton: {
    backgroundColor: '#6366f1',
    borderColor: '#818cf8',
  },
  optionText: {
    color: '#94a3b8',
    fontWeight: '600',
  },
  selectedOptionText: {
    color: '#ffffff',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#475569',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    margin: 4,
  },
  selectedChip: {
    backgroundColor: '#4338ca',
    borderColor: '#6366f1',
  },
  chipText: {
    color: '#cbd5e1',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedChipText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#6366f1',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;
