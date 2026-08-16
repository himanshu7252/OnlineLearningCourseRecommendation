import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../hooks';
import { logoutUser, updateUserProfile } from '../store/authSlice';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface Props {
  navigation: ProfileScreenNavigationProp;
}

export const ProfileScreen = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { enrollments } = useAppSelector((state) => state.enrollments);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const handleResetOnboarding = () => {
    // Navigate to Onboarding screen without clearing current selections
    navigation.navigate('Onboarding' as any);
  };

  const enrolledCount = enrollments.length;
  const completedCount = enrollments.filter((e) => e.status === 'COMPLETED').length;

  // Simulated metrics
  const learningHours = enrolledCount * 4 + completedCount * 12;
  const currentStreak = 4; // Simulated 4 days

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* User Badge Info */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarIcon}>👤</Text>
          </View>
          <Text style={styles.name}>{user?.name || 'Learner'}</Text>
          <Text style={styles.email}>{user?.email || 'name@domain.com'}</Text>
        </View>

        {/* Analytics Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCell}>
            <Text style={styles.statEmoji}>📚</Text>
            <Text style={styles.statVal}>{enrolledCount}</Text>
            <Text style={styles.statLabel}>Enrolled</Text>
          </View>

          <View style={styles.statCell}>
            <Text style={styles.statEmoji}>🏆</Text>
            <Text style={styles.statVal}>{completedCount}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>

          <View style={styles.statCell}>
            <Text style={styles.statEmoji}>⏱️</Text>
            <Text style={styles.statVal}>{learningHours}h</Text>
            <Text style={styles.statLabel}>Studied</Text>
          </View>

          <View style={styles.statCell}>
            <Text style={styles.statEmoji}>🔥</Text>
            <Text style={styles.statVal}>{currentStreak}d</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
        </View>

        {/* Selected Interests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interests Selected</Text>
          <View style={styles.chipRow}>
            {user?.interests && user.interests.length > 0 ? (
              user.interests.map((interest) => (
                <View key={interest} style={styles.interestChip}>
                  <Text style={styles.chipText}>{interest}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noneText}>No interests defined.</Text>
            )}
          </View>
        </View>

        {/* Selected Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills Selected</Text>
          <View style={styles.chipRow}>
            {user?.skills && user.skills.length > 0 ? (
              user.skills.map((skill) => (
                <View key={skill} style={styles.skillChip}>
                  <Text style={styles.chipText}>{skill}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noneText}>No skills defined.</Text>
            )}
          </View>
        </View>

        {/* Preference Settings Reset */}
        <View style={styles.actionSection}>
          <TouchableOpacity style={styles.resetBtn} onPress={handleResetOnboarding}>
            <Text style={styles.resetBtnText}>Edit Skills & Interests Onboarding</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutBtnText}>Sign Out</Text>
          </TouchableOpacity>
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
    padding: 20,
    paddingBottom: 100,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 28,
    marginTop: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#cbd5e1',
    marginBottom: 12,
  },
  avatarIcon: {
    fontSize: 40,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  email: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 28,
  },
  statCell: {
    width: '23%',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  statEmoji: {
    fontSize: 16,
    marginBottom: 4,
  },
  statVal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  statLabel: {
    fontSize: 9,
    color: '#64748b',
    fontWeight: '600',
    marginTop: 2,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 6,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestChip: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },
  skillChip: {
    backgroundColor: '#faf5ff',
    borderWidth: 1,
    borderColor: '#e9d5ff',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  noneText: {
    fontSize: 13,
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  actionSection: {
    marginTop: 10,
  },
  resetBtn: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  resetBtnText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '600',
  },
  logoutBtn: {
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#fca5a5',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  logoutBtnText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
