import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

interface SettingItemProps {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value?: string;
    type?: 'text' | 'toggle' | 'link';
    onPress?: () => void;
    isToggled?: boolean;
    onToggle?: (value: boolean) => void;
    color?: string;
}

export default function SettingItem({
    icon,
    label,
    value,
    type = 'text',
    onPress,
    isToggled,
    onToggle,
    color
}: SettingItemProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const textColor = color || (isDark ? '#fff' : '#333');
    const subTextColor = isDark ? '#999' : '#666';
    const bgColor = isDark ? '#1C1C1E' : '#fff';

    const Content = () => (
        <View style={[styles.container, { backgroundColor: bgColor }]}>
            <View style={styles.leftContent}>
                <Ionicons name={icon} size={22} color={color || '#007AFF'} style={styles.icon} />
                <Text style={[styles.label, { color: textColor }]}>{label}</Text>
            </View>

            <View style={styles.rightContent}>
                {type === 'text' && value && (
                    <Text style={[styles.value, { color: subTextColor }]}>{value}</Text>
                )}

                {type === 'link' && (
                    <>
                        {value && <Text style={[styles.value, { color: subTextColor }]}>{value}</Text>}
                        <Ionicons name="chevron-forward" size={20} color={subTextColor} />
                    </>
                )}

                {type === 'toggle' && (
                    <Switch
                        value={isToggled}
                        onValueChange={onToggle}
                        trackColor={{ false: '#767577', true: '#007AFF' }}
                        thumbColor={isToggled ? '#fff' : '#f4f3f4'}
                    />
                )}
            </View>
        </View>
    );

    if (type === 'toggle' || type === 'text') {
        return <Content />;
    }

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
            <Content />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 20,
        marginBottom: 1,
    },
    leftContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rightContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    icon: {
        marginRight: 15,
        width: 24,
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
    },
    value: {
        fontSize: 15,
    },
});
