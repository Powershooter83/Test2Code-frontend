import {Component, inject, OnInit} from '@angular/core';
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
import {MatList, MatListItem, MatNavList} from '@angular/material/list';
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
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {HistoryEntry} from '../models/history.model';
import {ActivatedRoute} from '@angular/router';

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
    MatList,
    MatMenu,
    MatMenuItem,
    MatSlideToggle,
    MatMenuTrigger,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'frontend';

  private route = inject(ActivatedRoute);

  constructor(private historyService: HistoryService, route: ActivatedRoute) {
  }


  get history(): HistoryEntry[] {
    return this.historyService.getHistory();
  }

  deleteItem(id: string) {
    this.historyService.removeEntry(id);
  }

  onButtonClick(id: string) {

    console.log('yeh')
  }

  toggleDarkMode(checked: boolean) {

  }

  ngOnInit(): void {
  }

}
