import {Injectable} from '@angular/core';
import {i18n} from '../models/i18n.model';
import de_json from '../assets/i18n/de.json';
import en_json from '../assets/i18n/en.json';
import fr_json from '../assets/i18n/fr.json';
import ch_json from '../assets/i18n/ch.json';


@Injectable({
  providedIn: 'root'
})
export class I18nService {

  private keyValuePairs: [i18n, string][] = [];
  private currentLanguage: string;

  constructor() {
    this.currentLanguage = this.getBrowserLanguage();
    this.loadTranslations();
  }

  getTranslation(key: i18n): string {
    const translation = this.keyValuePairs.find(pair => pair[0] === key);
    return translation ? translation[1] : "TRANSLATION_NOT_FOUND";
  }

  public getBrowserLanguage(): string {
    let lang = localStorage.getItem('selectedLanguage');

    if (!lang) {
      lang = navigator.language || (navigator as any).language;
      lang = lang!.split('-')[0];

      localStorage.setItem('selectedLanguage', lang);
    }
    return lang;
  }

  public overrideBrowserLanguage(lang: string): void {
    localStorage.setItem('selectedLanguage', lang);
    this.currentLanguage = this.getBrowserLanguage();
    this.loadTranslations();

  }

  private loadTranslations(): void {
    switch (this.currentLanguage) {
      case 'de':
        this.loadTranslationsFromFile(de_json);
        break;
      case 'fr':
        this.loadTranslationsFromFile(fr_json);
        break;
      case 'ch':
        this.loadTranslationsFromFile(ch_json);
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
