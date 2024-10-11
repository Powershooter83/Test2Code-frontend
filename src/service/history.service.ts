import {Injectable} from '@angular/core';
import {HistoryEntry} from '../models/history.model';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  constructor() {
  }

  createEntry(entry: HistoryEntry) {
    const entries = localStorage.getItem('history');
    const entriesArray = entries ? JSON.parse(entries) : [];
    entriesArray.unshift(entry);
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

  addLanguage(activeHistoryId: string, input_languag_dropdown: any) {
    let entry: HistoryEntry | undefined = this.getEntry(activeHistoryId);
    if (entry == undefined) {
      return;
    }
    entry!.language = input_languag_dropdown;
    entry!.method = 'STEP: Version selection';
    this.updateEntry(entry);
  }

  addVersion(activeHistoryId: string, input_version_dropdown: any) {
    let entry: HistoryEntry | undefined = this.getEntry(activeHistoryId);
    if (entry == undefined) {
      return;
    }
    entry!.version = input_version_dropdown;
    entry!.method = 'STEP: Test upload';
    this.updateEntry(entry);
  }

  addTests(activeHistoryId: string, input_tests_textarea: any) {
    let entry: HistoryEntry | undefined = this.getEntry(activeHistoryId);
    if (entry == undefined) {
      return;
    }
    entry!.testCases = input_tests_textarea;
    entry!.method = this.extractFunctionNames(input_tests_textarea)[0];
    this.updateEntry(entry);
  }

  updateIndex(activeHistoryId: string, currentStepIndex: number) {
    let entry: HistoryEntry | undefined = this.getEntry(activeHistoryId);
    if (entry == undefined) {
      return;
    }
    entry!.currentStep = currentStepIndex;
    this.updateEntry(entry);
  }

  addGeneratedCode(activeHistoryId: string, resultImplementation: string) {
    let entry: HistoryEntry | undefined = this.getEntry(activeHistoryId);
    if (entry == undefined) {
      return;
    }
    entry!.generatedCode = resultImplementation;
    this.updateEntry(entry);
  }

  private updateEntry(entry: HistoryEntry) {
    const entries = localStorage.getItem('history');


    if (entries) {
      const entriesArray: HistoryEntry[] = JSON.parse(entries);
      const updatedEntries = entriesArray.map(e =>
        e.id === entry.id ? {...e, ...entry} : e
      );
      localStorage.setItem('history', JSON.stringify(updatedEntries));
    }
  }

  private getEntry(id: string): HistoryEntry | undefined {
    const entries = localStorage.getItem('history');
    if (entries) {
      const entriesArray: HistoryEntry[] = JSON.parse(entries);
      return entriesArray.find(entry => entry.id === id);
    }
    return undefined;
  }
}
