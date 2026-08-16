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
import { useNavigation } from '@react-navigation/native';
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
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth);

  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>(
    () => user?.experienceLevel || 'Beginner'
  );
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    () => user?.interests || []
  );
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    () => user?.skills || []
  );

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
    )
      .unwrap()
      .then(() => {
        if (navigation.canGoBack()) {
          navigation.goBack();
        }
      })
      .catch((err: any) => {
        Alert.alert('Error', err.message || 'Failed to save personalization settings');
      });
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
                    isSelected && styles.selectedInterestChip,
                  ]}
                  onPress={() => toggleInterest(interest)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      isSelected && styles.selectedInterestChipText,
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
                    isSelected && styles.selectedSkillChip,
                  ]}
                  onPress={() => toggleSkill(skill)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      isSelected && styles.selectedSkillChipText,
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
    backgroundColor: '#f8fafc',
  },
  container: {
    padding: 24,
    paddingBottom: 40,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
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
    color: '#1e293b',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  selectedOptionButton: {
    backgroundColor: '#e0e7ff',
    borderColor: '#6366f1',
  },
  optionText: {
    color: '#475569',
    fontWeight: '600',
  },
  selectedOptionText: {
    color: '#4338ca',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    margin: 4,
  },
  selectedInterestChip: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
  },
  selectedInterestChipText: {
    color: '#1e40af',
    fontWeight: 'bold',
  },
  selectedSkillChip: {
    backgroundColor: '#faf5ff',
    borderColor: '#e9d5ff',
  },
  selectedSkillChipText: {
    color: '#6b21a8',
    fontWeight: 'bold',
  },
  chipText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '500',
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
