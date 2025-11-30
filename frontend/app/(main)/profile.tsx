import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView, ScrollView, Image } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import apiClient from '@/services/apiClient';
import SettingItem from '@/components/SettingItem';
import { Ionicons } from '@expo/vector-icons';

interface UserProfile {
    id: number;
    email: string;
    full_name: string;
    is_active: boolean;
}

import { useRouter } from 'expo-router';

export default function ProfileScreen() {
    const { logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const isDark = theme === 'dark';
    const bgColor = isDark ? '#000' : '#F2F2F7';
    const headerColor = isDark ? '#fff' : '#000';
    const sectionHeaderColor = isDark ? '#666' : '#666';

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await apiClient.get('/auth/me');
            setProfile(response.data);
        } catch (error) {
            console.error('Failed to fetch profile', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.center, { backgroundColor: bgColor }]}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={headerColor} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: headerColor }]}>Settings</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                        {/* Placeholder for user image or initial */}
                        <Text style={styles.avatarText}>
                            {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
                        </Text>
                        <View style={styles.editIcon}>
                            <Ionicons name="pencil" size={12} color="#fff" />
                        </View>
                    </View>
                </View>

                <Text style={[styles.sectionHeader, { color: sectionHeaderColor }]}>PROFILE</Text>
                <View style={styles.section}>
                    <SettingItem
                        icon="person-outline"
                        label="Username"
                        value={profile?.full_name}
                        type="link"
                    />
                    <SettingItem
                        icon="mail-outline"
                        label="E-mail"
                        value={profile?.email}
                        type="link"
                    />
                    <SettingItem
                        icon="lock-closed-outline"
                        label="Password"
                        value="••••••••"
                        type="link"
                    />
                    <SettingItem
                        icon="moon-outline"
                        label="Dark Mode"
                        type="toggle"
                        isToggled={isDark}
                        onToggle={toggleTheme}
                    />
                </View>

                <Text style={[styles.sectionHeader, { color: sectionHeaderColor }]}>ACCOUNT</Text>
                <View style={styles.section}>
                    <SettingItem
                        icon="log-out-outline"
                        label="Log out"
                        type="link"
                        onPress={logout}
                        color="#007AFF"
                    />
                    <SettingItem
                        icon="trash-outline"
                        label="Delete My Account"
                        type="text"
                        color="#FF3B30"
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

import { TouchableOpacity } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    avatarContainer: {
        alignItems: 'center',
        marginVertical: 30,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#3A82F6', // Blue color from image
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    avatarText: {
        fontSize: 32,
        color: '#fff',
        fontWeight: 'bold',
    },
    editIcon: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#fff', // Or theme color
        borderRadius: 10,
        padding: 4,
        borderWidth: 1,
        borderColor: '#eee'
    },
    sectionHeader: {
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 10,
        marginLeft: 20,
        marginTop: 20,
        letterSpacing: 0.5,
    },
    section: {
        borderRadius: 12,
        overflow: 'hidden',
        marginHorizontal: 20,
    },
});
