import {Injectable} from '@angular/core';
import {HistoryEntry} from '../models/history.model';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  constructor() {
  }

  createEntry(uuid: string, testCases: string) {
    const entry: HistoryEntry = {
      id: uuid,
      method: this.extractFunctionNames(testCases)[0],
      created_at: new Date().toISOString(),
      testCases: testCases
    };

    const entries = localStorage.getItem('history');
    const entriesArray = entries ? JSON.parse(entries) : [];
    entriesArray.push(entry);

    localStorage.setItem('history', JSON.stringify(entriesArray));
  }

  extractFunctionNames(testCaseString: string): string[] {
    const matches = testCaseString.match(/def (\w+)/g);
    if (matches) {
      return matches.map(match => match.split(' ')[1]);
    }

    return [];
  }

  getHistory(): HistoryEntry[] {
    const entries = localStorage.getItem('history');
    return entries ? JSON.parse(entries) : [];
  }

  removeEntry(id: string) {
    const entries = localStorage.getItem('history');
    if (entries) {
      const entriesArray: HistoryEntry[] = JSON.parse(entries);
      const updatedEntries = entriesArray.filter(entry => entry.id !== id);
      localStorage.setItem('history', JSON.stringify(updatedEntries));
    }
  }

  getEntry(id: string): HistoryEntry | undefined {
    const entries = localStorage.getItem('history');
    if (entries) {
      const entriesArray: HistoryEntry[] = JSON.parse(entries);
      return entriesArray.find(entry => entry.id === id);
    }
    return undefined;
  }
}
