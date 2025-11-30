import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, TextInput, RefreshControl, ScrollView } from 'react-native';
import { useTodos } from '@/hooks/useTodos';
import { MaterialCommunityIcons, Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'expo-router';
import TodoItem from '@/components/TodoItem';

export default function DashboardScreen() {
  const { todos, folders, loading, error, addTodo, createFolder, addSubtask, toggleTodo, deleteTodo, fetchTodos, toggleSubtask } = useTodos();
  const { theme } = useTheme();
  const [newTodo, setNewTodo] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<number | null>(null);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderTitle, setNewFolderTitle] = useState('');

  const isDark = theme === 'dark';
  const bgColor = isDark ? '#000' : '#fff';
  const textColor = isDark ? '#fff' : '#1C1C1E';
  const subTextColor = isDark ? '#999' : '#666';
  const cardBg = isDark ? '#1C1C1E' : '#F2F2F7';

  const filteredTodos = todos.filter(t =>
    selectedFolder === null ? true : t.folder_id === selectedFolder
  );

  const handleAddTodo = async () => {
    if (newTodo.trim()) {
      await addTodo(newTodo, selectedFolder);
      setNewTodo('');
      setIsAdding(false);
    }
  };

  const handleCreateFolder = async () => {
    if (newFolderTitle.trim()) {
      await createFolder(newFolderTitle);
      setNewFolderTitle('');
      setIsCreatingFolder(false);
    }
  };

  const router = useRouter();

  const FOLDER_COLORS = [
    { bg: '#E8EAFF', text: '#5B67CA' }, // Purple
    { bg: '#FFE9E9', text: '#FF6B6B' }, // Red/Pink
    { bg: '#FFF4E5', text: '#FF9F43' }, // Orange
    { bg: '#E6F9F0', text: '#20BF6B' }, // Green
  ];

  const getTaskCount = (folderId: number | null) => {
    if (folderId === null) return todos.length;
    return todos.filter(t => t.folder_id === folderId).length;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: textColor }]}>Dashboard</Text>
        <TouchableOpacity onPress={() => router.push('/profile')}>
          <Ionicons name="person-circle-outline" size={32} color={textColor} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchTodos} tintColor={textColor} />}
      >
        <Text style={[styles.sectionTitle, { color: subTextColor }]}>Folders</Text>

        <View style={styles.folderGrid}>
          {/* All Tasks Card */}
          <TouchableOpacity
            onPress={() => setSelectedFolder(null)}
            style={[styles.folderCard, { backgroundColor: selectedFolder === null ? '#5B67CA' : FOLDER_COLORS[0].bg }]}
          >
            <View style={styles.folderHeader}></View>
            <View>
              <Text style={[styles.countText, { color: selectedFolder === null ? '#fff' : FOLDER_COLORS[0].text }]}>
                {getTaskCount(null)}
              </Text>
              <Text style={[styles.folderTitle, { color: selectedFolder === null ? '#fff' : FOLDER_COLORS[0].text }]}>
                All Tasks
              </Text>
            </View>
          </TouchableOpacity>

          {/* Dynamic Folders */}
          {folders.map((folder, index) => {
            const colorTheme = FOLDER_COLORS[(index + 1) % FOLDER_COLORS.length];
            const isSelected = selectedFolder === folder.id;

            return (
              <TouchableOpacity
                key={folder.id}
                onPress={() => setSelectedFolder(folder.id)}
                style={[
                  styles.folderCard,
                  { backgroundColor: isSelected ? colorTheme.text : colorTheme.bg }
                ]}
              >
                <View style={styles.folderHeader}>
                  <View />
                  <TouchableOpacity>
                    <MaterialCommunityIcons
                      name="delete-outline"
                      size={25}
                      color={isSelected ? '#fff' : colorTheme.text}
                    />
                  </TouchableOpacity>
                </View>
                <View>
                  <Text style={[styles.countText, { color: isSelected ? '#fff' : colorTheme.text }]}>
                    {getTaskCount(folder.id)}
                  </Text>
                  <Text style={[styles.folderTitle, { color: isSelected ? '#fff' : colorTheme.text }]}>
                    {folder.title}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}

          {/* Create Folder Button */}
          <TouchableOpacity
            style={styles.createFolderButton}
            onPress={() => setIsCreatingFolder(!isCreatingFolder)}
          >
            <MaterialCommunityIcons name={isCreatingFolder ? "folder-cancel-outline" : "folder-plus-outline"} size={30} color={subTextColor} />
          </TouchableOpacity>
        </View>

        {isCreatingFolder && (
          <View style={[styles.inputContainer, { marginBottom: 20 }]}>
            <TextInput
              style={[styles.input, { color: textColor, backgroundColor: cardBg }]}
              placeholder="New Folder Name"
              placeholderTextColor={subTextColor}
              value={newFolderTitle}
              onChangeText={setNewFolderTitle}
              onSubmitEditing={handleCreateFolder}
              autoFocus
            />
            <TouchableOpacity onPress={handleCreateFolder} style={styles.addButton}>
              <MaterialIcons name="create-new-folder" size={32} color="#007AFF" />
            </TouchableOpacity>
          </View>
        )}

        <Text style={[styles.sectionTitle, { color: subTextColor }]}>
          {selectedFolder === null
            ? 'All Tasks'
            : folders.find(f => f.id === selectedFolder)?.title || 'Tasks'}
        </Text>

        <TouchableOpacity
          style={styles.newListButton}
          onPress={() => setIsAdding(!isAdding)}
        >
          <MaterialIcons name={isAdding ? "cancel" : "add-task"} size={24} color="white" />
          <Text style={styles.newListText}>{isAdding ? 'Cancel' : 'Add New Task'}</Text>
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
              <MaterialIcons name="add-task" size={32} color="#007AFF" />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.tasksList}>
          {filteredTodos.map((todo) => (
            <View
              key={todo.id}
              style={[styles.taskCard, { backgroundColor: 'transparent' }]}
            >
              <TodoItem
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onAddSubtask={addSubtask}
                onToggleSubtask={toggleSubtask}
              />
            </View>
          ))}

          {filteredTodos.length === 0 && !loading && (
            <Text
              style={{
                color: subTextColor,
                textAlign: "center",
                marginTop: 20,
              }}
            >
              No tasks found
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
    fontSize: 24,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
    marginTop: 10,
  },
  folderGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
    marginBottom: 25,
  },
  folderCard: {
    width: '47%',
    padding: 20,
    shadowColor: '#494949ff',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 10,
    borderRadius: 20,
    justifyContent: 'space-between',
    height: 140,
  },
  folderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  countText: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 5,
  },
  folderTitle: {
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.8,
  },
  statusText: {
    fontSize: 12,
    marginTop: 5,
    opacity: 0.6,
  },
  newListButton: {
    backgroundColor: '#0062ffff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    justifyContent: 'center',
  },
  newListText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
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
  tasksList: {
    gap: 12,
  },
  taskCard: {
    padding: 0,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 10,
  },
  createFolderButton: {
    width: '47%',
    height: 140,
    padding: 15,
    borderWidth: 2,
    borderColor: '#919191ff',
    borderStyle: 'dashed',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
