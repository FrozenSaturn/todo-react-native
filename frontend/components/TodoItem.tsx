import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Todo } from '../hooks/useTodos';

interface TodoItemProps {
    todo: Todo;
    onToggle: (id: number, currentStatus: boolean) => void;
    onDelete: (id: number) => void;
}

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.contentContainer}
                onPress={() => onToggle(todo.id, todo.completed)}
            >
                <Ionicons
                    name={todo.completed ? 'checkbox' : 'square-outline'}
                    size={24}
                    color={todo.completed ? '#4CAF50' : '#666'}
                />
                <Text style={[styles.title, todo.completed && styles.completedTitle]}>
                    {todo.title}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => onDelete(todo.id)} style={styles.deleteButton}>
                <Ionicons name="trash-outline" size={20} color="#FF5252" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    contentContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    title: {
        fontSize: 16,
        color: '#333',
        flex: 1,
    },
    completedTitle: {
        textDecorationLine: 'line-through',
        color: '#999',
    },
    deleteButton: {
        padding: 5,
    },
});
