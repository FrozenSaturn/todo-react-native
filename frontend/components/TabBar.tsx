import { View, Platform, StyleSheet, LayoutChangeEvent } from 'react-native';
import { useLinkBuilder, useTheme } from '@react-navigation/native';
import { Text, PlatformPressable } from '@react-navigation/elements';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useEffect, useState } from 'react';

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const { buildHref } = useLinkBuilder();
    const insets = useSafeAreaInsets();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const buttonWidth = dimensions.width / state.routes.length;

    const onTabbarLayout = (e: LayoutChangeEvent) => {
        setDimensions({
            width: e.nativeEvent.layout.width,
            height: e.nativeEvent.layout.height,
        });
    };

    const tabPositionX = useSharedValue(0);

    useEffect(() => {
        tabPositionX.value = withSpring(buttonWidth * state.index, {
            duration: 1500,
        });
    }, [state.index, buttonWidth]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: tabPositionX.value }],
        };
    });

    return (
        <View style={[styles.container, { bottom: insets.bottom + 20 }]}>
            <View
                onLayout={onTabbarLayout}
                style={[
                    styles.tabBar,
                    {
                        backgroundColor: theme.background,
                        shadowColor: theme.text,
                        shadowOpacity: 0.1,
                        shadowRadius: 10,
                        shadowOffset: { width: 0, height: 5 },
                        elevation: 5
                    }
                ]}
            >
                {dimensions.width > 0 && (
                    <Animated.View
                        style={[
                            animatedStyle,
                            {
                                position: 'absolute',
                                backgroundColor: theme.tint,
                                borderRadius: 30,
                                marginHorizontal: 10,
                                height: dimensions.height - 20,
                                width: buttonWidth - 20,
                                opacity: 0.20, // Subtle highlight
                            },
                        ]}
                    />
                )}

                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const label =
                        options.tabBarLabel !== undefined
                            ? options.tabBarLabel
                            : options.title !== undefined
                                ? options.title
                                : route.name;

                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name, route.params);
                        }
                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        });
                    };

                    return (
                        <TabBarItem
                            key={route.key}
                            route={route}
                            isFocused={isFocused}
                            options={options}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            buildHref={buildHref}
                            theme={theme}
                            label={label.toString()}
                        />
                    );
                })}
            </View>
        </View>
    );
}

function TabBarItem({
    route,
    isFocused,
    options,
    onPress,
    onLongPress,
    buildHref,
    theme,
    label
}: {
    route: any,
    isFocused: boolean,
    options: any,
    onPress: () => void,
    onLongPress: () => void,
    buildHref: any,
    theme: any,
    label: string
}) {
    const scale = useSharedValue(0);

    useEffect(() => {
        scale.value = withSpring(isFocused ? 1 : 0, { duration: 350 });
    }, [isFocused]);

    const animatedIconStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: withSpring(isFocused ? 1.5 : 1) }],
        };
    });

    return (
        <PlatformPressable
            href={buildHref(route.name, route.params)}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabItem}
        >
            <Animated.View style={animatedIconStyle}>
                {options.tabBarIcon?.({
                    focused: isFocused,
                    color: isFocused ? theme.tabIconSelected : theme.tabIconDefault,
                    size: 20,
                })}
            </Animated.View>
        </PlatformPressable>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    tabBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
        borderRadius: 35,
        width: '70%', // Slightly wider for better spacing
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
