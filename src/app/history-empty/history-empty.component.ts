import {Component} from '@angular/core';
import {MatCard, MatCardActions, MatCardHeader, MatCardSubtitle, MatCardTitle} from '@angular/material/card';
import {MatButton} from '@angular/material/button';
import {HistoryService} from '../../service/history.service';
import {I18nService} from '../i18n.service';
import {i18n} from '../../models/i18n.model';

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
  ],
  templateUrl: './history-empty.component.html',
  styleUrl: './history-empty.component.scss'
})
export class HistoryEmptyComponent {

  constructor( protected i18nService: I18nService) {
  }


  generateTest() {
    location.reload()
  }

  protected readonly i18n = i18n;
}
