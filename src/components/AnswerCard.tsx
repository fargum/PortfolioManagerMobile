import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface AnswerCardProps {
  lastQuery: string;
  answerText: string;
  latencyMs?: number;
}

export function AnswerCard({ lastQuery, answerText, latencyMs }: AnswerCardProps) {
  return (
    <View style={styles.card}>
      {lastQuery ? (
        <View style={styles.querySection}>
          <Text style={styles.label}>You asked:</Text>
          <Text style={styles.queryText}>{lastQuery}</Text>
        </View>
      ) : null}

      <View style={styles.answerSection}>
        <Text style={styles.label}>Answer:</Text>
        <Text style={styles.answerText}>{answerText}</Text>
      </View>

      {latencyMs !== undefined && (
        <Text style={styles.latency}>Response time: {latencyMs}ms</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  querySection: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  answerSection: {
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  queryText: {
    fontSize: 14,
    color: '#333',
    fontStyle: 'italic',
  },
  answerText: {
    fontSize: 16,
    color: '#1a1a1a',
    lineHeight: 24,
  },
  latency: {
    fontSize: 11,
    color: '#999',
    textAlign: 'right',
    marginTop: 8,
  },
});
