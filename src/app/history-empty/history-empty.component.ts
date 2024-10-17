import {Component} from '@angular/core';
import {MatCard, MatCardActions, MatCardHeader, MatCardSubtitle, MatCardTitle} from '@angular/material/card';
import {MatButton} from '@angular/material/button';
import {I18nService} from '../i18n.service';
import {i18n} from '../../models/i18n.model';
import {ThemingService} from '../theming.service';
import {NgClass, NgIf} from '@angular/common';

@Component({
  selector: 'app-history-empty',
  standalone: true,
  imports: [
    MatCardHeader,
    MatCard,
    MatCardActions,
    MatButton,
    MatCardTitle,
    MatCardSubtitle,
    NgClass,
    NgIf,
  ],
  templateUrl: './history-empty.component.html',
  styleUrl: './history-empty.component.scss'
})
export class HistoryEmptyComponent {

  protected readonly i18n = i18n;

  constructor(protected i18nService: I18nService, protected themingService: ThemingService) {
  }

  generateTest() {
    location.reload()
  }
}
