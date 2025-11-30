import { useState, useEffect, useCallback } from 'react';
import apiClient from '../services/apiClient';
import { Alert } from 'react-native';

export interface SubTask {
    id: number;
    title: string;
    completed: boolean;
}

export interface Todo {
    id: number;
    title: string;
    completed: boolean;
    user_id: number;
    folder_id?: number | null;
    subtasks?: SubTask[];
}

export interface Folder {
    id: number;
    title: string;
}

export const useTodos = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [folders, setFolders] = useState<Folder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchFolders = useCallback(async () => {
        try {
            const response = await apiClient.get('/folders/');
            setFolders(response.data);
        } catch (err) {
            console.error('Fetch folders error:', err);
        }
    }, []);

    const createFolder = async (title: string) => {
        try {
            await apiClient.post('/folders/', { title });
            fetchFolders();
            return true;
        } catch (err) {
            console.error('Create folder error:', err);
            return false;
        }
    };

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

    const addTodo = async (title: string, folderId?: number | null) => {
        try {
            const response = await apiClient.post('/todos/', {
                title,
                completed: false,
                folder_id: folderId,
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
                title: todos.find((t) => t.id === id)?.title || '',
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
            setTodos((prev) => prev.filter((todo) => todo.id !== id));

            await apiClient.delete(`/todos/${id}`);
        } catch (err: any) {
            Alert.alert('Error', 'Failed to delete todo');
            console.error('Delete todo error:', err);
            fetchTodos(); // Re-fetch to sync state
        }
    };

    const addSubtask = async (todoId: number, title: string) => {
        try {
            await apiClient.post(`/todos/${todoId}/subtasks`, {
                title,
                completed: false,
            });
            fetchTodos(); // Re-fetch to show new subtask
            return true;
        } catch (err: any) {
            console.error('Add subtask error:', err);
            return false;
        }
    };

    const toggleSubtask = async (todoId: number, subtaskId: number, currentStatus: boolean) => {
        try {
            // Optimistic update
            setTodos((prev) =>
                prev.map((todo) => {
                    if (todo.id === todoId) {
                        const newSubtasks = todo.subtasks?.map((sub) =>
                            sub.id === subtaskId ? { ...sub, completed: !currentStatus } : sub
                        );

                        const allSubtasksCompleted = newSubtasks?.every((sub) => sub.completed) ?? false;

                        return {
                            ...todo,
                            completed: allSubtasksCompleted,
                            subtasks: newSubtasks,
                        };
                    }
                    return todo;
                })
            );

            await apiClient.put(`/todos/${todoId}/subtasks/${subtaskId}`, {
                completed: !currentStatus,
            });
        } catch (err: any) {
            console.error('Toggle subtask error:', err);
            fetchTodos(); // Revert/Sync on error
        }
    };

    useEffect(() => {
        fetchTodos();
        fetchFolders();
    }, [fetchTodos, fetchFolders]);

    return {
        todos,
        folders,
        loading,
        error,
        fetchTodos,
        fetchFolders,
        addTodo,
        createFolder,
        addSubtask,
        toggleTodo,
        deleteTodo,
        toggleSubtask,
    };
};
