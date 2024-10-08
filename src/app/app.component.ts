import {Component} from '@angular/core';
import {MatStepperModule} from '@angular/material/stepper';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatOption, MatSelect} from '@angular/material/select';
import {NgForOf, NgIf} from '@angular/common';
import {PageComponent} from './page/page.component';
import {MatToolbar} from '@angular/material/toolbar';
import {MatIcon} from '@angular/material/icon';
import {MatListItem, MatNavList} from '@angular/material/list';
import {
  MatDrawer,
  MatDrawerContainer,
  MatDrawerContent,
  MatSidenav,
  MatSidenavContainer
} from '@angular/material/sidenav';
import {HistoryService} from '../history.service';
import {MatTooltip} from '@angular/material/tooltip';
import {MatDivider} from '@angular/material/divider';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelect,
    MatOption,
    NgForOf,
    PageComponent,
    MatToolbar,
    MatIcon,
    MatNavList,
    MatListItem,
    MatSidenav,
    MatSidenavContainer,
    MatDrawerContent,
    MatDrawer,
    MatDrawerContainer,
    MatTooltip,
    NgIf,
    MatDivider,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';

  constructor(private historyService: HistoryService) {
  }

  get history() {
    return this.historyService.getHistory();
  }

  deleteItem(id: string) {

  }

  onButtonClick(id: string) {

  }
}
