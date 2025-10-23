// src/components/FilterChips.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../store/themeStore';
import { COLORS } from '../constants/theme';
import * as Haptics from 'expo-haptics';

type FilterStatus = 'all' | 'active' | 'completed';

interface Props {
    selectedFilter: FilterStatus;
    onFilterChange: (filter: FilterStatus) => void;
    taskCounts?: {
        all: number;
        active: number;
        completed: number;
    };
}

export default function FilterChips({
    selectedFilter,
    onFilterChange,
    taskCounts = { all: 0, active: 0, completed: 0 }
}: Props) {
    const isDark = useThemeStore((state) => state.isDark);
    const colors = isDark ? COLORS.dark : COLORS.light;

    const filters: { value: FilterStatus; label: string; icon: string }[] = [
        { value: 'all', label: 'All', icon: 'list' },
        { value: 'active', label: 'Active', icon: 'checkmark-circle-outline' },
        { value: 'completed', label: 'Done', icon: 'checkmark-done-circle' },
    ];

    const handlePress = (filter: FilterStatus) => {
        if (filter !== selectedFilter) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onFilterChange(filter);
        }
    };

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            {filters.map((filter) => {
                const isSelected = selectedFilter === filter.value;
                const count = taskCounts[filter.value];

                return (
                    <Pressable
                        key={filter.value}
                        style={[
                            styles.chip,
                            {
                                backgroundColor: isSelected
                                    ? colors.primary
                                    : colors.card,
                                borderColor: isSelected
                                    ? colors.primary
                                    : colors.border,
                            }
                        ]}
                        onPress={() => handlePress(filter.value)}
                    >
                        <Ionicons
                            name={filter.icon as any}
                            size={18}
                            color={isSelected ? '#FFFFFF' : colors.textSecondary}
                        />
                        <Text
                            style={[
                                styles.chipText,
                                {
                                    color: isSelected ? '#FFFFFF' : colors.text,
                                    fontWeight: isSelected ? '600' : '500',
                                }
                            ]}
                        >
                            {filter.label}
                        </Text>
                        {count > 0 && (
                            <View style={[
                                styles.badge,
                                {
                                    backgroundColor: isSelected
                                        ? 'rgba(255, 255, 255, 0.25)'
                                        : colors.border,
                                }
                            ]}>
                                <Text style={[
                                    styles.badgeText,
                                    { color: isSelected ? '#FFFFFF' : colors.textSecondary }
                                ]}>
                                    {count}
                                </Text>
                            </View>
                        )}
                    </Pressable>
                );
            })}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
      
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
        paddingHorizontal: 18,
        paddingBottom: 6,
        gap: 6,
   
        
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1.5,
        gap: 8,
    },
    chipText: {
        fontSize: 15,
        letterSpacing: -0.2,
    },
    badge: {
        minWidth: 22,
        height: 22,
        borderRadius: 11,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 6,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '600',
    },
});