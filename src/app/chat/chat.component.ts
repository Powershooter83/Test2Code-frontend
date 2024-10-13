import {AfterViewChecked, ChangeDetectorRef, Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatButton, MatFabButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {ChatState, getNextStep, isBefore} from '../../models/state.model';
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
import {CdkCopyToClipboard} from '@angular/cdk/clipboard';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';

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
    CdkTextareaAutosize,
    CdkCopyToClipboard,
    MatRadioButton,
    MatRadioGroup
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

  currentStep: ChatState = ChatState.USER_SELECT_LANGUAGE;
  GENERATED_CODE: string = '';

  isDrawerExtended: boolean = false;
  historyEntries: HistoryEntry[] = [];
  settingsOpen: boolean = false;
  search: any;
  input_new_generation: string = '';
  protected readonly i18n = i18n;
  protected readonly ChatState = ChatState;
  protected readonly isBefore = isBefore;
  @ViewChild('scrollBottom') private scrollBottom!: ElementRef;
  private _snackBar = inject(MatSnackBar);

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
    console.log(this.currentStep)
    switch (this.currentStep) {
      case ChatState.USER_SELECT_LANGUAGE:
        this.increaseCurrentStep();
        this.loadVersionsForLanguage();

        let updatedEntry = this.historyService.addLanguage(this.activeHistoryId, this.input_language_dropdown);
        this.updateEntry(updatedEntry!);

        setTimeout(() => {
          this.increaseCurrentStep();
        }, 1000);
        break;
      case ChatState.USER_SELECT_VERSION:
        this.increaseCurrentStep();
        let updatedEntry2 = this.historyService.addVersion(this.activeHistoryId, this.input_version_dropdown);
        this.updateEntry(updatedEntry2!);

        setTimeout(() => {
          this.increaseCurrentStep();
        }, 1000);
        break;
      case ChatState.USER_UPLOAD_TEST:
        this.increaseCurrentStep();
        let updatedEntry3 = this.historyService.addTests(this.activeHistoryId, this.input_test_textarea);
        this.updateEntry(updatedEntry3!);

        this.uploadTest();

        setTimeout(() => {
          this.increaseCurrentStep()
        }, 2000);

        break;
      case ChatState.USER_QUESTION_RETRY:
        this.increaseCurrentStep();

        if (!JSON.parse(this.input_new_generation)) {
          this.currentStep = ChatState.BOT_MSG_FINISHED;
        }


    }
  }

  increaseCurrentStep() {
    this.currentStep = getNextStep(this.currentStep);

    this.scrollToBottom();
    this.historyService.updateCurrentStep(this.activeHistoryId, this.currentStep);
  }

  isSendButtonDisabled():
    boolean {
    switch (this.currentStep) {
      case ChatState.USER_SELECT_LANGUAGE:
        return !this.input_language_dropdown;
      case ChatState.USER_SELECT_VERSION:
        return !this.input_version_dropdown;
      case ChatState.USER_UPLOAD_TEST:
        return !this.input_test_textarea;
      case ChatState.BOT_MSG_QUESTION_RETRY:
        return !this.input_new_generation;
    }
    return false;
  }

  scrollToBottom()
    :
    void {
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

  formatTimeDifference(timestamp
                         :
                         string
  ):
    string {
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

  changeHistoryElement(entry
                         :
                         HistoryEntry
  ) {
    this.activeHistoryId = entry.id;
    this.input_test_textarea = entry.testCases;
    this.input_version_dropdown = entry.version;
    this.input_language_dropdown = entry.language;
    this.GENERATED_CODE = entry.generatedCode;
    this.currentStep = ChatState.USER_SELECT_LANGUAGE;
  }

  newChat() {
    this.GENERATED_CODE = '';
    this.currentStep = ChatState.USER_SELECT_LANGUAGE;
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
      isFinished: false
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

  sendCopySnackbar() {
    this._snackBar.open('Tests in die Zwischenablage kopiert!', 'Schliessen', {
      duration: 2500
    });
  }

  updateEntry(entry: HistoryEntry) {
    let index = this.historyEntries.findIndex(entry => entry.id === this.activeHistoryId);
    if (index !== -1) {
      this.historyEntries[index] = entry!;
    }
  }

  loadVersionsForLanguage() {
    this.connectorService.getVersions(this.input_language_dropdown).subscribe(
      (response) => {
        this.versions = response.versions;
      }
    );
  }

  uploadTest() {
    this.connectorService.uploadTest(this.input_language_dropdown,
      this.input_version_dropdown,
      this.input_test_textarea).subscribe(
      (response) => {
        let resultImplementation = "";
        response.test2code.forEach((item: any) => {
          const implementation = item.implementation;
          resultImplementation += implementation + "\n";
        });

        this.GENERATED_CODE = resultImplementation;
        let updatedEntry = this.historyService.addGeneratedCode(this.activeHistoryId, resultImplementation);
        this.updateEntry(updatedEntry!);
        this.increaseCurrentStep()
        this.increaseCurrentStep()

        setTimeout(() => {
          this.increaseCurrentStep();
        }, 1000);
      }
    )
  }
}
