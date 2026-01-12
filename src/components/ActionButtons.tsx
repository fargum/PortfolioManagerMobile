import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Action, ACTION_QUERIES } from '../models/voice';

interface ActionButtonsProps {
  actions: Action[];
  onActionPress: (query: string) => void;
  disabled?: boolean;
}

export function ActionButtons({
  actions,
  onActionPress,
  disabled,
}: ActionButtonsProps) {
  // Show up to 3 actions as per spec
  const displayActions = actions.slice(0, 3);

  if (displayActions.length === 0) {
    return null;
  }

  const handlePress = (action: Action) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Build the follow-up query
    let query = ACTION_QUERIES[action.id] || action.label;

    // Append args if present
    if (action.args && Object.keys(action.args).length > 0) {
      const argsString = Object.entries(action.args)
        .map(([key, value]) => `${key}=${value}`)
        .join(', ');
      query = `${query} (${argsString})`;
    }

    onActionPress(query);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Quick Actions</Text>
      <View style={styles.buttonRow}>
        {displayActions.map((action, index) => (
          <TouchableOpacity
            key={`${action.id}-${index}`}
            style={[styles.button, disabled && styles.buttonDisabled]}
            onPress={() => handlePress(action)}
            disabled={disabled}
            activeOpacity={0.7}
          >
            <Text
              style={[styles.buttonText, disabled && styles.buttonTextDisabled]}
              numberOfLines={1}
            >
              {action.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  heading: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    minWidth: 100,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonTextDisabled: {
    color: '#999',
  },
});
