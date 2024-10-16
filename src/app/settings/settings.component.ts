import {Component} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {ICountry, NgxCountriesDropdownModule} from 'ngx-countries-dropdown';
import {HistoryService} from '../../service/history.service';
import {I18nService} from '../i18n.service';
import {i18n} from "../../models/i18n.model";

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    MatButton,
    NgxCountriesDropdownModule
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {

  protected readonly i18n = i18n;

  constructor(private historyService: HistoryService, protected i18nService: I18nService) {
  }

  onCountryChange(country: ICountry) {
    let language = country.language?.code;

    if (language) {
      if (this.i18nService.getBrowserLanguage() == language && country.code != 'CH') {
        return;
      }
      if (this.i18nService.getBrowserLanguage() == country.code.toLowerCase()) {
        return;
      }

      if (country.code == 'CH') {
        this.i18nService.overrideBrowserLanguage('ch')
        localStorage.setItem('settingsOpen', 'true');
        location.reload()
        return;
      }
      this.i18nService.overrideBrowserLanguage(language)
      localStorage.setItem('settingsOpen', 'true');
      location.reload()
    }

  }

  onDeleteHistory() {
    if (confirm(this.i18nService.getTranslation(i18n.SETTINGS_DELETE_HISTORY_CONFIRMATION))) {
      this.historyService.deleteAll();
      localStorage.setItem('settingsOpen', 'true');
      location.reload();
    }
  }

  getLanguageCode(): string {
    let code = this.i18nService.getBrowserLanguage()
    if (code == 'en') {
      return 'us';
    }
    return code;
  }
}
