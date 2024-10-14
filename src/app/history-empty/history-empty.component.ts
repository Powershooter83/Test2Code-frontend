import {Component} from '@angular/core';
import {MatCard, MatCardActions, MatCardHeader, MatCardSubtitle, MatCardTitle} from '@angular/material/card';
import {MatButton} from '@angular/material/button';

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

  generateTest() {
    location.reload()
  }
}
