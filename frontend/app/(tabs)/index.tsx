import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, TextInput, RefreshControl, ScrollView } from 'react-native';
import { useTodos } from '@/hooks/useTodos';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'expo-router';

export default function DashboardScreen() {
  const { todos, loading, error, addTodo, toggleTodo, deleteTodo, fetchTodos } = useTodos();
  const { theme } = useTheme();
  const [newTodo, setNewTodo] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const isDark = theme === 'dark';
  const bgColor = isDark ? '#000' : '#fff';
  const textColor = isDark ? '#fff' : '#1C1C1E';
  const subTextColor = isDark ? '#999' : '#666';
  const cardBg = isDark ? '#1C1C1E' : '#F2F2F7';

  const handleAddTodo = async () => {
    if (newTodo.trim()) {
      await addTodo(newTodo);
      setNewTodo('');
      setIsAdding(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>Personal</Text>
        <TouchableOpacity>
          <Ionicons name="options-outline" size={24} color={textColor} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchTodos} tintColor={textColor} />}
      >
        <TouchableOpacity
          style={styles.newListButton}
          onPress={() => setIsAdding(!isAdding)}
        >
          <Ionicons name="add" size={24} color="#fff" />
          <Text style={styles.newListText}>{isAdding ? 'Cancel' : 'New Task'}</Text>
        </TouchableOpacity>

        {isAdding && (
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { color: textColor, backgroundColor: cardBg }]}
              placeholder="What needs to be done?"
              placeholderTextColor={subTextColor}
              value={newTodo}
              onChangeText={setNewTodo}
              onSubmitEditing={handleAddTodo}
              autoFocus
            />
            <TouchableOpacity onPress={handleAddTodo} style={styles.addButton}>
              <Ionicons name="arrow-up-circle" size={32} color="#007AFF" />
            </TouchableOpacity>
          </View>
        )}

        <Text style={[styles.sectionTitle, { color: subTextColor, marginTop: 20 }]}>TASKS</Text>



        <View style={styles.tasksList}>
          {todos.map((todo) => (
            <TouchableOpacity
              key={todo.id}
              style={[styles.taskCard, { backgroundColor: cardBg }]}
              onPress={() => toggleTodo(todo.id, todo.completed)}
            >
              <View style={styles.taskHeader}>

                {/* Left: Checkbox */}
                <Ionicons
                  name={todo.completed ? "checkbox" : "radio-button-off"}
                  size={20}
                  color={todo.completed ? "#4CAF50" : subTextColor}
                />

                {/* Middle: Centered Task Title */}
                <Text
                  style={[
                    styles.taskTitle,
                    {
                      color: textColor,
                      textDecorationLine: todo.completed ? "line-through" : "none",
                    },
                  ]}
                >
                  {todo.title}
                </Text>

                {/* Right: Trash Icon */}
                <TouchableOpacity onPress={() => deleteTodo(todo.id)}>
                  <Ionicons
                    name="trash-outline"
                    size={28}
                    color="#FF3B30"
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.taskFooter}></View>
            </TouchableOpacity>
          ))}

          {todos.length === 0 && !loading && (
            <Text
              style={{
                color: subTextColor,
                textAlign: "center",
                marginTop: 20,
              }}
            >
              No tasks yet
            </Text>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 20,
  },
  newListButton: {
    backgroundColor: '#3A82F6', // Blue from image
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  newListText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  categoriesList: {
    marginBottom: 10,
  },
  categoryCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 0,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    padding: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    textAlign: 'right',
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  filterChipActive: {
    backgroundColor: '#D1E3FA',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterTextActive: {
    color: '#1967D2',
    fontSize: 13,
    fontWeight: '500',
  },
  tasksList: {
    gap: 12,
  },
  taskCard: {
    padding: 16,
    borderRadius: 16,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between",
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    marginRight: 10,
    marginLeft: 10,
    marginTop: 2,
  },
  taskFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  taskTime: {
    fontSize: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    marginRight: 10,
  },
  addButton: {
    padding: 5,
  },
});
