import {Component} from '@angular/core';
import {MatStepperModule} from '@angular/material/stepper';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatOption, MatSelect} from '@angular/material/select';
import {NgClass, NgForOf, NgIf} from '@angular/common';
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
import {HistoryService} from '../service/history.service';
import {MatTooltip} from '@angular/material/tooltip';
import {MatDivider} from '@angular/material/divider';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {HistoryEntry} from '../models/history.model';
import {ChatComponent} from './chat/chat.component';
import {ThemingService} from './theming.service';
import {SettingsComponent} from './settings/settings.component';

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
    FormsModule,
    MatList,
    MatMenu,
    MatMenuItem,
    MatSlideToggle,
    MatMenuTrigger,
    ChatComponent,
    NgClass,
    SettingsComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(private historyService: HistoryService,
              private themingService: ThemingService) {
  }

  get darkMode(): boolean {
    return this.themingService.isDarkmode();
  }

  get history(): HistoryEntry[] {
    return this.historyService.getHistory();
  }


  deleteItem(id: string) {
    this.historyService.removeEntry(id);
  }

  toggleDarkMode(checked: boolean) {

  }

}
