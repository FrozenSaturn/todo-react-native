import { useState, useEffect, useCallback } from 'react';
import apiClient from '../services/apiClient';
import { Alert } from 'react-native';

export interface Todo {
    id: number;
    title: string;
    completed: boolean;
    user_id: number;
}

export const useTodos = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTodos = useCallback(async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/todos/');
            setTodos(response.data);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch todos');
            console.error('Fetch todos error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const addTodo = async (title: string) => {
        try {
            const response = await apiClient.post('/todos/', {
                title,
                completed: false,
            });
            setTodos((prev) => [...prev, response.data]);
            return true;
        } catch (err: any) {
            Alert.alert('Error', 'Failed to add todo');
            console.error('Add todo error:', err);
            return false;
        }
    };

    const toggleTodo = async (id: number, currentStatus: boolean) => {
        try {
            // Optimistic update
            setTodos((prev) =>
                prev.map((todo) =>
                    todo.id === id ? { ...todo, completed: !currentStatus } : todo
                )
            );

            await apiClient.put(`/todos/${id}`, {
                title: todos.find((t) => t.id === id)?.title || '', // We need to send the title too as per PUT semantics usually, or PATCH if backend supports it. Assuming PUT needs full object or at least title.
                // Actually, let's check verify_todos.py. It sends title and completed.
                // We'll just send the current title.
                completed: !currentStatus,
            });
        } catch (err: any) {
            // Revert on failure
            setTodos((prev) =>
                prev.map((todo) =>
                    todo.id === id ? { ...todo, completed: currentStatus } : todo
                )
            );
            Alert.alert('Error', 'Failed to update todo');
            console.error('Update todo error:', err);
        }
    };

    const deleteTodo = async (id: number) => {
        try {
            // Optimistic update
            const previousTodos = [...todos];
            setTodos((prev) => prev.filter((todo) => todo.id !== id));

            await apiClient.delete(`/todos/${id}`);
        } catch (err: any) {
            // Revert could be complex here, usually we just re-fetch or alert.
            Alert.alert('Error', 'Failed to delete todo');
            console.error('Delete todo error:', err);
            fetchTodos(); // Re-fetch to sync state
        }
    };

    useEffect(() => {
        fetchTodos();
    }, [fetchTodos]);

    return {
        todos,
        loading,
        error,
        fetchTodos,
        addTodo,
        toggleTodo,
        deleteTodo,
    };
};
