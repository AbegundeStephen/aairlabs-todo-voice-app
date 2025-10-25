// src/components/FilterChips.tsx
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, TouchableWithoutFeedback, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../store/themeStore';
import { COLORS } from '../constants/theme';
import * as Haptics from 'expo-haptics';

export type FilterStatus = 'all' | 'active' | 'completed' | 'overdue' | 'upcoming';

interface Props {
    selectedFilter: FilterStatus;
    onFilterChange: (filter: FilterStatus) => void;
    taskCounts?: {
        all: number;
        active: number;
        completed: number;
        overdue: number;
        upcoming: number;
    };
}

export default function FilterChips({
    selectedFilter,
    onFilterChange,
    taskCounts = { all: 0, active: 0, completed: 0, overdue: 0, upcoming: 0 }
}: Props) {
    const isDark = useThemeStore((state) => state.isDark);
    const colors = isDark ? COLORS.dark : COLORS.light;
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const scaleAnim = useRef(new Animated.Value(0)).current;

    const filters: { value: FilterStatus; label: string; icon: string; color?: string }[] = [
        { value: 'all', label: 'All Tasks', icon: 'list' },
        { value: 'active', label: 'Active', icon: 'checkmark-circle-outline' },
        { value: 'completed', label: 'Completed', icon: 'checkmark-done-circle', color: colors.success },
        { value: 'overdue', label: 'Overdue', icon: 'alert-circle', color: colors.error },
        { value: 'upcoming', label: 'Upcoming', icon: 'time-outline', color: colors.warning },
    ];

    const currentFilter = filters.find(f => f.value === selectedFilter) || filters[0];

    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setIsDropdownVisible(true);
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            tension: 100,
            friction: 8,
        }).start();
    };

    const handleClose = () => {
        Animated.timing(scaleAnim, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
        }).start(() => setIsDropdownVisible(false));
    };

    const handleFilterSelect = (filter: FilterStatus) => {
        if (filter !== selectedFilter) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onFilterChange(filter);
        }
        handleClose();
    };

    return (
        <View style={styles.container}>
            <Pressable
                style={({ pressed }) => [
                    styles.button,
                    {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                        opacity: pressed ? 0.8 : 1,
                    }
                ]}
                onPress={handlePress}
            >
                <View style={styles.buttonContent}>
                    <Ionicons
                        name={currentFilter.icon as any}
                        size={20}
                        color={currentFilter.color || colors.primary}
                    />
                    <Text style={[styles.buttonText, { color: colors.text }]}>
                        {currentFilter.label}
                    </Text>
                    {taskCounts[selectedFilter] > 0 && (
                        <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                            <Text style={styles.badgeText}>{taskCounts[selectedFilter]}</Text>
                        </View>
                    )}
                </View>
                <Ionicons
                    name="chevron-down"
                    size={20}
                    color={colors.textSecondary}
                />
            </Pressable>

            <Modal
                visible={isDropdownVisible}
                transparent
                animationType="none"
                onRequestClose={handleClose}
            >
                <TouchableWithoutFeedback onPress={handleClose}>
                    <View style={styles.overlay}>
                        <TouchableWithoutFeedback>
                            <Animated.View
                                style={[
                                    styles.dropdown,
                                    {
                                        backgroundColor: colors.card,
                                        borderColor: colors.border,
                                        transform: [
                                            {
                                                scale: scaleAnim.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [0.9, 1],
                                                })
                                            }
                                        ],
                                        opacity: scaleAnim,
                                    }
                                ]}
                            >
                                {filters.map((filter, index) => {
                                    const isSelected = selectedFilter === filter.value;
                                    const count = taskCounts[filter.value];
                                    const isLast = index === filters.length - 1;

                                    return (
                                        <View key={filter.value}>
                                            <Pressable
                                                style={({ pressed }) => [
                                                    styles.dropdownItem,
                                                    {
                                                        backgroundColor: pressed
                                                            ? isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'
                                                            : 'transparent',
                                                    }
                                                ]}
                                                onPress={() => handleFilterSelect(filter.value)}
                                            >
                                                <View style={styles.dropdownItemContent}>
                                                    <View style={styles.dropdownItemLeft}>
                                                        <Ionicons
                                                            name={filter.icon as any}
                                                            size={22}
                                                            color={filter.color || colors.text}
                                                        />
                                                        <Text
                                                            style={[
                                                                styles.dropdownItemText,
                                                                {
                                                                    color: colors.text,
                                                                    fontWeight: isSelected ? '600' : '400',
                                                                }
                                                            ]}
                                                        >
                                                            {filter.label}
                                                        </Text>
                                                    </View>
                                                    <View style={styles.dropdownItemRight}>
                                                        {count > 0 && (
                                                            <View style={[
                                                                styles.dropdownBadge,
                                                                {
                                                                    backgroundColor: isDark
                                                                        ? 'rgba(255,255,255,0.1)'
                                                                        : 'rgba(0,0,0,0.05)'
                                                                }
                                                            ]}>
                                                                <Text style={[
                                                                    styles.dropdownBadgeText,
                                                                    { color: colors.textSecondary }
                                                                ]}>
                                                                    {count}
                                                                </Text>
                                                            </View>
                                                        )}
                                                        {isSelected && (
                                                            <Ionicons
                                                                name="checkmark"
                                                                size={20}
                                                                color={colors.primary}
                                                            />
                                                        )}
                                                    </View>
                                                </View>
                                            </Pressable>
                                            {!isLast && (
                                                <View style={[
                                                    styles.divider,
                                                    { backgroundColor: colors.border }
                                                ]} />
                                            )}
                                        </View>
                                    );
                                })}
                            </Animated.View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1.5,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flex: 1,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: -0.2,
    },
    badge: {
        minWidth: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    dropdown: {
        width: '90%',
        maxWidth: 400,
        borderRadius: 16,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 10,
        overflow: 'hidden',
    },
    dropdownItem: {
        paddingVertical: 16,
        paddingHorizontal: 16,
    },
    dropdownItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dropdownItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    dropdownItemRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    dropdownItemText: {
        fontSize: 16,
        letterSpacing: -0.2,
    },
    dropdownBadge: {
        minWidth: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
    },
    dropdownBadgeText: {
        fontSize: 13,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        marginHorizontal: 16,
    },
});