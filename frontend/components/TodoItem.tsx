import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Entypo, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Todo } from '../hooks/useTodos';
import { Collapsible } from '@/components/ui/collapsible';

interface TodoItemProps {
    todo: Todo;
    onToggle: (id: number, currentStatus: boolean) => void;
    onDelete: (id: number) => void;
    onAddSubtask: (todoId: number, title: string) => void;
    onToggleSubtask: (todoId: number, subtaskId: number, currentStatus: boolean) => void;
}

export default function TodoItem({ todo, onToggle, onDelete, onAddSubtask, onToggleSubtask }: TodoItemProps) {
    const [isAddingSubtask, setIsAddingSubtask] = useState(false);
    const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

    const handleAddSubtask = () => {
        if (newSubtaskTitle.trim()) {
            onAddSubtask(todo.id, newSubtaskTitle);
            setNewSubtaskTitle('');
            setIsAddingSubtask(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={{ flex: 1 }}>

                <TouchableOpacity
                    style={styles.contentContainer}
                    onPress={() => onToggle(todo.id, todo.completed)}
                >
                    <TouchableOpacity onPress={() => onToggle(todo.id, todo.completed)}>
                        <Ionicons
                            name={todo.completed ? 'checkmark-done-sharp' : 'square-outline'}
                            size={20}
                            color={todo.completed ? '#4CAF50' : '#666'}
                        />
                    </TouchableOpacity>
                    <Text style={[styles.title, todo.completed && styles.completedTitle, { marginLeft: 10 }]}>
                        {todo.title}
                    </Text>
                    <TouchableOpacity onPress={() => onDelete(todo.id)} style={styles.deleteButton}>
                        <MaterialCommunityIcons name="delete-outline" size={26} color="#999" />
                    </TouchableOpacity>
                </TouchableOpacity>

                <View style={styles.dateContainer}>
                    <Ionicons name="calendar-outline" size={14} color="#999" />
                    <Text style={styles.dateText}>Today</Text>
                </View>

                {isAddingSubtask && (
                    <View style={styles.subtaskInput}>
                        <TextInput
                            style={styles.input}
                            placeholder="Add subtask..."
                            value={newSubtaskTitle}
                            onChangeText={setNewSubtaskTitle}
                            onSubmitEditing={handleAddSubtask}
                            autoFocus
                        />
                        <TouchableOpacity onPress={handleAddSubtask}>
                            <Ionicons name="arrow-up-circle" size={24} color="#007AFF" />
                        </TouchableOpacity>
                    </View>
                )}

                <View style={styles.footer}>
                    {todo.subtasks && todo.subtasks.length > 0 ? (
                        <Collapsible
                            title={`${todo.subtasks.length} Subtasks`}
                            headerRight={
                                <TouchableOpacity onPress={() => setIsAddingSubtask(!isAddingSubtask)}>
                                    <Entypo name="add-to-list" size={18} color="#000" />
                                </TouchableOpacity>
                            }
                        >
                            <View style={styles.subtaskList}>
                                {todo.subtasks.map((sub, index) => (
                                    <View
                                        key={sub.id}
                                        style={[
                                            styles.subtaskItem,
                                            index === todo.subtasks!.length - 1 && { borderBottomWidth: 0 }
                                        ]}
                                    >
                                        <TouchableOpacity onPress={() => onToggleSubtask(todo.id, sub.id, sub.completed)}>
                                            <Ionicons
                                                name={sub.completed ? "checkbox-outline" : "square-outline"}
                                                size={18}
                                                color={sub.completed ? "#4CAF50" : "#666"}
                                                style={{ marginRight: 8 }}
                                            />
                                        </TouchableOpacity>
                                        <Text style={[styles.subtaskText, sub.completed && styles.completedTitle]}>
                                            {sub.title}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </Collapsible>
                    ) : (
                        <TouchableOpacity
                            style={styles.emptySubtaskButton}
                            onPress={() => setIsAddingSubtask(!isAddingSubtask)}
                        >
                            <Entypo name="add-to-list" size={16} color="#666" />
                            <Text style={styles.actionText}>Add Subtask</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 20,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        gap: 8,
    },
    tag: {
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 12,
    },
    tagText: {
        fontSize: 10,
        fontWeight: '600',
    },
    contentContainer: {
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1C1C1E',
        lineHeight: 22,
        flex: 1,
        marginRight: 10,
    },
    completedTitle: {
        textDecorationLine: 'line-through',
        color: '#999',
    },
    footer: {
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#F2F2F7',
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 10,
        marginLeft: 4,
    },
    dateText: {
        fontSize: 12,
        color: '#999',
        fontWeight: '500',
    },
    actionText: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },
    deleteButton: {
        padding: 4,
    },
    subtaskInput: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: '#F2F2F7',
        borderRadius: 12,
        padding: 5,
        paddingLeft: 12,
    },
    input: {
        flex: 1,
        fontSize: 14,
        paddingVertical: 8,
    },
    subtaskList: {
        backgroundColor: '#F9F9F9',
        borderRadius: 12,
        padding: 8,
        marginTop: 8,
    },
    subtaskItem: {
        paddingVertical: 10,
        paddingHorizontal: 4,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },
    subtaskText: {
        fontSize: 14,
        color: '#000',
    },
    emptySubtaskButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
});
