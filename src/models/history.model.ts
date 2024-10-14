export interface HistoryEntry {
  id: string;
  method: string;
  created_at: string;
  testCases: string;
  language: string;
  version: string;
  generatedCode: string;
  currentStep: number;
  isFinished: boolean;
}
