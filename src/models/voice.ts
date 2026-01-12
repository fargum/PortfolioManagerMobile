// Types matching the backend VoiceResponse schema

export interface Source {
  title: string;
  publisher?: string;
  url: string;
  published_at?: string;
}

export interface Action {
  id: string;
  label: string;
  args?: Record<string, unknown>;
}

export interface Telemetry {
  latency_ms: number;
  tools?: string[];
  model?: string;
}

export interface VoiceResponse {
  speakText: string;
  answerText: string;
  sources: Source[];
  actions: Action[];
  telemetry: Telemetry | null;
}

export interface ChatRequest {
  query: string;
  account_id: number;
  mode: 'voice';
  max_speak_words: number;
  thread_id?: string;
}

// Action ID to follow-up query mapping
export const ACTION_QUERIES: Record<string, string> = {
  top_movers: 'Show my top movers today.',
  breakdown: "Give me a breakdown of today's performance.",
  headlines: 'Show me the latest headlines relevant to my holdings.',
  portfolio_impact: 'What is the impact on my portfolio?',
  risk_exposure: 'Summarise my currency and sector exposure.',
};
