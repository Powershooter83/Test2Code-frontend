import {Component} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {ICountry, NgxCountriesDropdownModule} from 'ngx-countries-dropdown';
import {HistoryService} from '../../service/history.service';
import {I18nService} from '../i18n.service';

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

  constructor(private historyService: HistoryService, private i18nService: I18nService) {
  }

  onCountryChange(country: ICountry) {
    let language = country.language?.code;

    if (language) {
      if (this.i18nService.getBrowserLanguage() == language) {
        return;
      }
      this.i18nService.overrideBrowserLanguage(language)
      localStorage.setItem('settingsOpen', 'true');
      location.reload()
    }

  }

  onDeleteHistory() {
    if (confirm("Are you sure to delete the History?")) {
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
