import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Linking from 'expo-linking';
import { Source } from '../models/voice';

interface SourceListProps {
  sources: Source[];
}

export function SourceList({ sources }: SourceListProps) {
  if (sources.length === 0) {
    return null;
  }

  const handlePress = (url: string) => {
    Linking.openURL(url);
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Sources</Text>
      {sources.map((source, index) => (
        <TouchableOpacity
          key={`${source.url}-${index}`}
          style={styles.sourceItem}
          onPress={() => handlePress(source.url)}
          activeOpacity={0.7}
        >
          <Text style={styles.title} numberOfLines={2}>
            {source.title}
          </Text>
          <View style={styles.meta}>
            {source.publisher && (
              <Text style={styles.publisher}>{source.publisher}</Text>
            )}
            {source.published_at && (
              <Text style={styles.date}>{formatDate(source.published_at)}</Text>
            )}
          </View>
        </TouchableOpacity>
      ))}
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
  sourceItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: '#007AFF',
    marginBottom: 4,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  publisher: {
    fontSize: 12,
    color: '#666',
  },
  date: {
    fontSize: 11,
    color: '#999',
  },
});
