export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: number;
}

export interface PlantUmlState {
  code: string;
  encodedUrl: string;
  isLoading: boolean;
}
