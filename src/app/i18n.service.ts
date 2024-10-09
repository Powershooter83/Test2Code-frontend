import {Injectable} from '@angular/core';
import {i18n} from '../models/i18n.model';
import de_json from '../assets/i18n/de.json';
import en_json from '../assets/i18n/en.json';

@Injectable({
  providedIn: 'root'
})
export class I18nService {

  private keyValuePairs: [i18n, string][] = [];
  private readonly currentLanguage: string;

  constructor() {
    this.currentLanguage = this.getBrowserLanguage();
    this.loadTranslations();
  }

  getTranslation(key: i18n): string {
    const translation = this.keyValuePairs.find(pair => pair[0] === key);
    return translation ? translation[1] : "TRANSLATION_NOT_FOUND";
  }

  private getBrowserLanguage(): string {
    const lang = navigator.language || (navigator as any).language;
    return lang.split('-')[0];
  }

  private loadTranslations(): void {
    switch (this.currentLanguage) {
      case 'de':
        this.loadTranslationsFromFile(de_json);
        break;
      default:
        this.loadTranslationsFromFile(en_json);
    }
  }

  private loadTranslationsFromFile(file: any) {
    for (const key in file) {
      if (file.hasOwnProperty(key)) {
        this.keyValuePairs.push([i18n[key as keyof typeof i18n], file[key]]);
      }
    }
  }
}
