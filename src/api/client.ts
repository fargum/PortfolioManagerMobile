import { API_BASE_URL, DEFAULT_ACCOUNT_ID, REQUEST_TIMEOUT_MS } from '../config';
import { ChatRequest, VoiceResponse } from '../models/voice';

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Fetch with timeout using AbortController
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number = REQUEST_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('Request timed out. Please try again.');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function callRespond(
  query: string,
  accountId: number = DEFAULT_ACCOUNT_ID,
  maxSpeakWords: number = 100
): Promise<VoiceResponse> {
  const url = `${API_BASE_URL}/api/ai/chat/respond`;

  const requestBody: ChatRequest = {
    query,
    account_id: accountId,
    mode: 'voice',
    max_speak_words: maxSpeakWords,
  };

  try {
    const response = await fetchWithTimeout(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new ApiError(
        `API error: ${response.status} - ${errorText}`,
        response.status
      );
    }

    const data: VoiceResponse = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (error instanceof TypeError) {
      throw new ApiError('Network error. Please check your connection.');
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'An unexpected error occurred'
    );
  }
}

// Health check - simple ping to verify connectivity
export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/health`,
      { method: 'GET' },
      5000
    );
    return response.ok;
  } catch {
    return false;
  }
}
