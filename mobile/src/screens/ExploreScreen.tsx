import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchCourses } from '../store/courseSlice';
import CourseCard from '../components/CourseCard';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';

type ExploreScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface Props {
  navigation: ExploreScreenNavigationProp;
}

const CATEGORIES = [
  'All',
  'Web Development',
  'Mobile Development',
  'AI & Machine Learning',
  'Data Science',
  'Cybersecurity',
  'Cloud Computing',
  'Computer Science',
];

const LEVELS = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];

export const ExploreScreen = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();
  const { courses, loading } = useAppSelector((state) => state.courses);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All Levels');

  // Trigger query dispatch
  const loadFilteredCourses = () => {
    const filters: any = {};
    if (search.trim()) filters.search = search.trim();
    if (selectedCategory !== 'All') filters.category = selectedCategory;
    if (selectedLevel !== 'All Levels') filters.level = selectedLevel;

    dispatch(fetchCourses(filters));
  };

  useEffect(() => {
    loadFilteredCourses();
  }, [selectedCategory, selectedLevel, dispatch]);

  const handleSearchSubmit = () => {
    loadFilteredCourses();
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSelectedLevel('All Levels');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Search Header */}
        <View style={styles.searchHeader}>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search courses, tags, instructors..."
              placeholderTextColor="#94a3b8"
              value={search}
              onChangeText={setSearch}
              onSubmitEditing={handleSearchSubmit}
              returnKeyType="search"
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => { setSearch(''); dispatch(fetchCourses({})); }}>
                <Text style={styles.clearIcon}>✖️</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Scrollable Filters */}
        <View style={styles.filterSection}>
          {/* Categories */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryChip,
                  selectedCategory === cat && styles.selectedCategoryChip,
                ]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === cat && styles.selectedCategoryText,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Difficulty Levels */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.levelScroll}>
            {LEVELS.map((lvl) => (
              <TouchableOpacity
                key={lvl}
                style={[
                  styles.levelChip,
                  selectedLevel === lvl && styles.selectedLevelChip,
                ]}
                onPress={() => setSelectedLevel(lvl)}
              >
                <Text
                  style={[
                    styles.levelText,
                    selectedLevel === lvl && styles.selectedLevelText,
                  ]}
                >
                  {lvl}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Course Grid/List */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6366f1" />
          </View>
        ) : courses.length > 0 ? (
          <FlatList
            data={courses}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => (
              <CourseCard
                course={item}
                onPress={() => navigation.navigate('CourseDetails', { courseId: item._id })}
              />
            )}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>No courses match your active search filters.</Text>
            <TouchableOpacity style={styles.clearBtn} onPress={clearFilters}>
              <Text style={styles.clearBtnText}>Reset All Filters</Text>
            </TouchableOpacity>
          </View>
        )}
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
  searchHeader: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
    backgroundColor: '#ffffff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingHorizontal: 12,
    height: 46,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#1e293b',
    fontSize: 15,
  },
  clearIcon: {
    fontSize: 12,
    marginLeft: 8,
    color: '#64748b',
  },
  filterSection: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 10,
  },
  categoryScroll: {
    paddingHorizontal: 12,
    marginVertical: 6,
  },
  categoryChip: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 6,
  },
  selectedCategoryChip: {
    backgroundColor: '#e0e7ff',
    borderColor: '#6366f1',
  },
  categoryText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  selectedCategoryText: {
    color: '#4338ca',
  },
  levelScroll: {
    paddingHorizontal: 12,
  },
  levelChip: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
  },
  selectedLevelChip: {
    backgroundColor: '#cbd5e1',
    borderColor: '#94a3b8',
  },
  levelText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
  },
  selectedLevelText: {
    color: '#0f172a',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 84
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyIcon: {
    fontSize: 50,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16,
  },
  clearBtn: {
    backgroundColor: '#6366f1',
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  clearBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 13,
  },
});

export default ExploreScreen;
