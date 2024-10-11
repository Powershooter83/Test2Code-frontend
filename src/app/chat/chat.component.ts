import {AfterViewChecked, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatButton, MatFabButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {ChatState} from '../../models/state.model';
import {MatInput} from '@angular/material/input';
import {I18nService} from '../i18n.service';
import {i18n} from '../../models/i18n.model';
import {HighlightLineNumbers} from 'ngx-highlightjs/line-numbers';
import {HighlightAuto} from 'ngx-highlightjs';
import {ThemingService} from '../theming.service';
import {ConnectorService} from '../connector.service';
import {HistoryEntry} from '../../models/history.model';
import {v4 as uuidv4} from 'uuid';
import {HistoryService} from '../../service/history.service';
import {SettingsComponent} from '../settings/settings.component';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    MatFormField,
    MatOption,
    MatSelect,
    NgForOf,
    FormsModule,
    MatFabButton,
    MatIcon,
    NgIf,
    MatInput,
    HighlightLineNumbers,
    HighlightAuto,
    NgClass,
    MatIconButton,
    SettingsComponent,
    MatLabel,
    MatMenu,
    MatMenuTrigger,
    MatMenuItem,
    MatButton,
    CdkTextareaAutosize
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit, AfterViewChecked {
  BOT_LOGO_URL = 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80'

  input_version_dropdown: any;
  input_language_dropdown: any;
  input_test_textarea: any;

  activeHistoryId!: string;

  versions: string[] = [];
  languages: string[] = [];

  currenStep: ChatState = ChatState.SELECT_LANGUAGE;
  currentStepIndex: number = 0;
  GENERATED_CODE: string = '';

  isDrawerExtended: boolean = false;
  historyEntries: HistoryEntry[] = [];
  settingsOpen: boolean = false;
  search: any;
  protected readonly i18n = i18n;
  @ViewChild('scrollBottom') private scrollBottom!: ElementRef;

  constructor(protected i18nService: I18nService,
              private themingService: ThemingService,
              private connectorService: ConnectorService,
              private cdrf: ChangeDetectorRef,
              private historyService: HistoryService) {
  }

  get darkMode(): boolean {
    return this.themingService.isDarkmode();
  }

  continue() {
    switch (this.currenStep) {
      case ChatState.SELECT_LANGUAGE:
        this.increaseCurrentStep();
        this.currenStep = ChatState.SELECT_VERSION;
        this.loadVersionsForLanguage();

        let updatedEntry = this.historyService.addLanguage(this.activeHistoryId, this.input_language_dropdown);
        this.updateEntry(updatedEntry!);

        setTimeout(() => {
          this.increaseCurrentStep();
        }, 1000);
        break;
      case ChatState.SELECT_VERSION:
        this.increaseCurrentStep();
        this.currenStep = ChatState.UPLOAD_TEST;
        let updatedEntry2 = this.historyService.addVersion(this.activeHistoryId, this.input_version_dropdown);
        this.updateEntry(updatedEntry2!);

        setTimeout(() => {
          this.increaseCurrentStep();
        }, 1000);
        break;
      case ChatState.UPLOAD_TEST:
        this.increaseCurrentStep();
        this.currenStep = ChatState.WAITING_FOR_RESULTS;
        let updatedEntry3 = this.historyService.addTests(this.activeHistoryId, this.input_test_textarea);
        this.updateEntry(updatedEntry3!);

        this.uploadTest();

        for (let i = 1; i <= 4; i++) {
          setTimeout(() => {
            this.increaseCurrentStep();
          }, i * 1000);
        }

    }
  }

  increaseCurrentStep() {
    this.currentStepIndex++;
    this.scrollToBottom();
    this.historyService.updateIndex(this.activeHistoryId, this.currentStepIndex);
  }

  isSendButtonDisabled(): boolean {
    switch (this.currenStep) {
      case ChatState.SELECT_VERSION:
        return !this.input_version_dropdown;
      case ChatState.SELECT_LANGUAGE:
        return !this.input_language_dropdown;
      case ChatState.UPLOAD_TEST:
        return !this.input_test_textarea;
    }
    return false;
  }

  scrollToBottom(): void {
    try {
      this.scrollBottom.nativeElement.scrollTop = this.scrollBottom.nativeElement.scrollHeight;
    } catch (err) {
    }
  }

  ngOnInit() {
    this.historyEntries = this.historyService.getHistory();
    if (this.historyEntries.length == 0) {
      this.newChat();
      this.historyEntries = this.historyService.getHistory();
    }
    this.changeHistoryElement(this.historyEntries[0]);
    this.scrollToBottom();
    this.connectorService.getLanguages().subscribe(
      (languages) => {
        this.languages = languages;
      }
    );

    setInterval(() => {
      this.cdrf.markForCheck();
    }, 1000);
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  formatTimeDifference(timestamp: string): string {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    Math.floor(diffDays / 30);
    if (diffSeconds < 60) {
      return `${diffSeconds} Sekunden`;
    } else if (diffMinutes < 60) {
      return `${diffMinutes} Minuten`;
    } else if (diffHours < 24) {
      return `${diffHours} Stunden`;
    } else if (diffDays < 7) {
      return `${diffDays} Tage`;
    } else if (diffWeeks < 4) {
      return `${diffWeeks} Wochen`;
    } else {
      return time.toLocaleDateString('de-DE', {day: '2-digit', month: '2-digit', year: 'numeric'});
    }
  }

  changeHistoryElement(entry: HistoryEntry) {
    this.activeHistoryId = entry.id;
    this.input_test_textarea = entry.testCases;
    this.input_version_dropdown = entry.version;
    this.input_language_dropdown = entry.language;
    this.GENERATED_CODE = entry.generatedCode;
    this.currenStep = ChatState.SELECT_LANGUAGE;
    this.currentStepIndex = entry.currentStep;
  }

  newChat() {
    this.GENERATED_CODE = '';
    this.currenStep = ChatState.SELECT_LANGUAGE;
    this.currentStepIndex = 0;
    this.input_version_dropdown = '';
    this.input_test_textarea = '';
    this.input_version_dropdown = '';

    let uuid = uuidv4();

    let historyEntry = {
      id: uuid,
      method: 'STEP: language selection',
      created_at: new Date().toISOString(),
      version: '',
      language: '',
      testCases: '',
      generatedCode: '',
      currentStep: 0,
    }

    this.historyEntries.unshift(historyEntry);
    this.historyService.createEntry(historyEntry);

    this.activeHistoryId = uuid;
  }

  deleteEntry(id: string) {
    this.historyService.removeEntry(id);
    this.historyEntries = this.historyService.getHistory();
    this.changeHistoryElement(this.historyEntries[0]);
  }

  filterHistory(filter: any) {
    let historyEntries = this.historyService.getHistory();
    if (!filter || filter.trim() === '') {
      this.historyEntries = historyEntries;
      return;
    }

    let filteredEntry: HistoryEntry[] = [];

    for (let entry of historyEntries) {
      if (entry.method.toLowerCase().startsWith(filter.toLowerCase())) {
        filteredEntry.push(entry);
      }
    }

    this.historyEntries = filteredEntry;
  }

  private updateEntry(entry: HistoryEntry) {
    let index = this.historyEntries.findIndex(entry => entry.id === this.activeHistoryId);
    if (index !== -1) {
      this.historyEntries[index] = entry!;
    }
  }

  private loadVersionsForLanguage() {
    this.connectorService.getVersions(this.input_language_dropdown).subscribe(
      (response) => {
        this.versions = response.versions;
      }
    );
  }

  private uploadTest() {
    this.connectorService.uploadTest(this.input_language_dropdown,
      this.input_version_dropdown,
      this.input_test_textarea).subscribe(
      (response) => {
        this.currentStepIndex++;
        let resultImplementation = "";
        response.test2code.forEach((item: any) => {
          const implementation = item.implementation;
          resultImplementation += implementation + "\n";
        });

        this.GENERATED_CODE = resultImplementation;
        let updatedEntry = this.historyService.addGeneratedCode(this.activeHistoryId, resultImplementation);
        this.updateEntry(updatedEntry!);

      }
    )
  }
}
