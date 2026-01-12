import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';

import { callRespond, checkHealth } from './src/api/client';
import { VoiceResponse } from './src/models/voice';
import { AnswerCard } from './src/components/AnswerCard';
import { SourceList } from './src/components/SourceList';
import { ActionButtons } from './src/components/ActionButtons';

type ConnectionStatus = 'connected' | 'offline' | 'checking';
type TtsStatus = 'idle' | 'speaking' | 'stopped';

export default function App() {
  const [queryText, setQueryText] = useState('');
  const [lastQuerySent, setLastQuerySent] = useState('');
  const [voiceResponse, setVoiceResponse] = useState<VoiceResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ttsStatus, setTtsStatus] = useState<TtsStatus>('idle');
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('checking');

  useEffect(() => {
    const checkConnection = async () => {
      setConnectionStatus('checking');
      const isHealthy = await checkHealth();
      setConnectionStatus(isHealthy ? 'connected' : 'offline');
    };
    checkConnection();
  }, []);

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  const handleAsk = useCallback(async (query: string) => {
    if (!query.trim()) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsLoading(true);
    setError(null);
    setLastQuerySent(query.trim());
    Speech.stop();
    setTtsStatus('idle');

    try {
      const response = await callRespond(query.trim());
      setVoiceResponse(response);
      setConnectionStatus('connected');
      setQueryText('');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      setConnectionStatus('offline');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSubmit = () => {
    handleAsk(queryText);
  };

  const handleActionPress = (query: string) => {
    handleAsk(query);
  };

  const handleSpeak = () => {
    if (!voiceResponse?.speakText) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Speech.stop();

    setTtsStatus('speaking');
    Speech.speak(voiceResponse.speakText, {
      language: 'en-GB',
      onDone: () => setTtsStatus('idle'),
      onStopped: () => setTtsStatus('stopped'),
      onError: () => setTtsStatus('idle'),
    });
  };

  const handleStopSpeech = () => {
    Speech.stop();
    setTtsStatus('stopped');
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return '#34C759';
      case 'offline':
        return '#FF3B30';
      default:
        return '#FF9500';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Connected';
      case 'offline':
        return 'Offline';
      default:
        return 'Checking...';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Portfolio Voice</Text>
          <View style={[styles.statusPill, { backgroundColor: getStatusColor() }]}>
            <Text style={styles.statusText}>{getStatusText()}</Text>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {error && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {voiceResponse && (
            <>
              <AnswerCard
                lastQuery={lastQuerySent}
                answerText={voiceResponse.answerText}
                latencyMs={voiceResponse.telemetry?.latency_ms}
              />

              <View style={styles.ttsControls}>
                <TouchableOpacity
                  style={[
                    styles.speakButton,
                    ttsStatus === 'speaking' && styles.speakButtonActive,
                  ]}
                  onPress={handleSpeak}
                  disabled={ttsStatus === 'speaking'}
                >
                  <Text style={styles.speakButtonText}>
                    {ttsStatus === 'speaking' ? 'Speaking...' : 'Speak'}
                  </Text>
                </TouchableOpacity>

                {ttsStatus === 'speaking' && (
                  <TouchableOpacity
                    style={styles.stopButton}
                    onPress={handleStopSpeech}
                  >
                    <Text style={styles.stopButtonText}>Stop</Text>
                  </TouchableOpacity>
                )}
              </View>

              <SourceList sources={voiceResponse.sources} />

              <ActionButtons
                actions={voiceResponse.actions}
                onActionPress={handleActionPress}
                disabled={isLoading}
              />
            </>
          )}

          {!voiceResponse && !isLoading && (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>
                Ask a question about your portfolio
              </Text>
            </View>
          )}

          {isLoading && (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Thinking...</Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputArea}>
          <TouchableOpacity style={styles.holdToTalkButton} activeOpacity={0.7}>
            <Text style={styles.holdToTalkText}>Hold to Talk</Text>
            <Text style={styles.holdToTalkSubtext}>(Coming soon)</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.textInput}
            placeholder="Type your question..."
            placeholderTextColor="#999"
            value={queryText}
            onChangeText={setQueryText}
            multiline
            maxLength={500}
            editable={!isLoading}
          />

          <TouchableOpacity
            style={[
              styles.askButton,
              (!queryText.trim() || isLoading) && styles.askButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!queryText.trim() || isLoading}
          >
            <Text style={styles.askButtonText}>
              {isLoading ? 'Asking...' : 'Ask'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  statusPill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  errorBanner: {
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
  },
  errorText: {
    color: '#C62828',
    fontSize: 14,
  },
  ttsControls: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 8,
  },
  speakButton: {
    backgroundColor: '#34C759',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  speakButtonActive: {
    backgroundColor: '#2DA94E',
  },
  speakButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  stopButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  stopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  inputArea: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  holdToTalkButton: {
    backgroundColor: '#E8E8E8',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 12,
  },
  holdToTalkText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
  },
  holdToTalkSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  textInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 48,
    maxHeight: 100,
    marginBottom: 12,
    color: '#1a1a1a',
  },
  askButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  askButtonDisabled: {
    backgroundColor: '#B0D4FF',
  },
  askButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
