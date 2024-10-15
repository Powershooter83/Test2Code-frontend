import {ChangeDetectorRef, Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {NgClass, NgForOf, NgIf, NgStyle} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatButton, MatFabButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {ChatState, getNextStep, isAfter, isBefore} from '../../models/state.model';
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
import {HistoryEmptyComponent} from '../history-empty/history-empty.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSlideToggle} from '@angular/material/slide-toggle';

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
    MatRadioGroup,
    HistoryEmptyComponent,
    NgStyle,
    FormsModule,
    MatTooltipModule,
    MatSlideToggle
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit {
  BOT_LOGO_URL = "assets/logos/profilepicture.png"
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
  hasErrors: boolean = false;

  input_show_comments: boolean = true;

  protected readonly i18n = i18n;
  protected readonly ChatState = ChatState;
  protected readonly isBefore = isBefore;
  protected readonly isAfter = isAfter;
  @ViewChild('scrollBottom') private scrollBottom!: ElementRef;
  private _snackBar = inject(MatSnackBar);

  constructor(protected i18nService: I18nService,
              private themingService: ThemingService,
              private connectorService: ConnectorService,
              private cdrf: ChangeDetectorRef,
              private historyService: HistoryService) {

    if (localStorage.getItem('settingsOpen')) {
      this.settingsOpen = true;
      localStorage.removeItem('settingsOpen');
    }
  }

  get darkMode(): boolean {
    return this.themingService.isDarkmode();
  }

  continue() {
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
        this.scrollToBottom()

        setTimeout(() => {
          this.increaseCurrentStep()
        }, 2000);
        break;
      case ChatState.USER_QUESTION_RETRY:
        this.increaseCurrentStep();

        if (!JSON.parse(this.input_new_generation)) {
          this.currentStep = ChatState.BOT_MSG_FINISHED;
          this.historyService.updateCurrentStep(this.activeHistoryId, this.currentStep)
          this.historyService.setFinished(this.activeHistoryId);
          this.scrollToBottom()
        } else {
          this.currentStep = ChatState.BOT_MSG_FINISHED;
          this.historyService.updateCurrentStep(this.activeHistoryId, this.currentStep)
          setTimeout(() => {
            this.scrollToBottom()
            this.newChat_withValues()
          }, 500);
        }


    }
  }

  increaseCurrentStep() {
    this.currentStep = getNextStep(this.currentStep);

    this.scrollToBottom();
    this.historyService.updateCurrentStep(this.activeHistoryId, this.currentStep);
  }

  isSendButtonDisabled(): boolean {
    switch (this.currentStep) {
      case ChatState.USER_SELECT_LANGUAGE:
        return !this.input_language_dropdown;
      case ChatState.USER_SELECT_VERSION:
        return !this.input_version_dropdown;
      case ChatState.USER_UPLOAD_TEST:
        return !this.input_test_textarea;
      case ChatState.USER_QUESTION_RETRY:
        return !this.input_new_generation;
    }
    return true;
  }

  scrollToBottom():
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
      return `${diffSeconds} ${this.i18nService.getTranslation(i18n.CHAT_TIME_DIFFERENCE_SECONDS)}`;
    } else if (diffMinutes < 60) {
      return `${diffMinutes} ${this.i18nService.getTranslation(i18n.CHAT_TIME_DIFFERENCE_MINUTES)}`;
    } else if (diffHours < 24) {
      return `${diffHours} ${this.i18nService.getTranslation(i18n.CHAT_TIME_DIFFERENCE_HOURS)}`;
    } else if (diffDays < 7) {
      return `${diffDays} ${this.i18nService.getTranslation(i18n.CHAT_TIME_DIFFERENCE_DAYS)}`;
    } else if (diffWeeks < 4) {
      return `${diffWeeks} ${this.i18nService.getTranslation(i18n.CHAT_TIME_DIFFERENCE_WEEKS)}`;
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
    this.input_new_generation = (!entry.isFinished).toString();
    this.hasErrors = entry.hasError;

    this.currentStep = entry.currentStep;
    switch (entry.currentStep) {
      case ChatState.BOT_MSG_ENTER_VERSION:
        this.currentStep = ChatState.USER_SELECT_VERSION;
        break;
      case ChatState.BOT_MSG_ENTER_TEST:
        this.currentStep = ChatState.USER_UPLOAD_TEST;
        break;
      case ChatState.BOT_MSG_UPLOAD_COMPLETED:
      case ChatState.BOT_MSG_CONTAINER_STARTED:
        if (this.GENERATED_CODE) {
          this.currentStep = ChatState.USER_QUESTION_RETRY
        } else {
          this.uploadTest();
          this.currentStep = ChatState.BOT_MSG_CONTAINER_STARTED;
        }

    }

  }

  newChat_withValues() {
    this.GENERATED_CODE = '';
    this.currentStep = ChatState.USER_UPLOAD_TEST;
    this.input_test_textarea = '';

    let uuid = uuidv4();

    let historyEntry = {
      id: uuid,
      method: 'STP1',
      created_at: new Date().toISOString(),
      version: this.input_version_dropdown,
      language: this.input_language_dropdown,
      testCases: '',
      generatedCode: '',
      currentStep: ChatState.USER_UPLOAD_TEST,
      isFinished: false,
      hasError: false
    }

    this.historyEntries.unshift(historyEntry);
    this.historyService.createEntry(historyEntry);

    this.activeHistoryId = uuid;
  }

  newChat() {
    this.settingsOpen = false;
    this.GENERATED_CODE = '';
    this.currentStep = ChatState.USER_SELECT_LANGUAGE;
    this.input_version_dropdown = '';
    this.input_test_textarea = '';
    this.input_version_dropdown = '';

    let uuid = uuidv4();

    let historyEntry: HistoryEntry = {
      id: uuid,
      method: 'STP1',
      created_at: new Date().toISOString(),
      version: '',
      language: '',
      testCases: '',
      generatedCode: '',
      currentStep: 0,
      isFinished: false,
      hasError: false
    }

    this.historyEntries.unshift(historyEntry);
    this.historyService.createEntry(historyEntry);

    this.activeHistoryId = uuid;
  }

  deleteEntry(id: string) {
    this.historyService.removeEntry(id);
    this.historyEntries = this.historyService.getHistory();
    if (this.historyEntries.length > 0) {
      this.changeHistoryElement(this.historyEntries[0]);
    }
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
    this._snackBar.open(this.i18nService.getTranslation(i18n.TEST_COPIED_MESSAGE), this.i18nService.getTranslation(i18n.TEST_COPIED_MESSAGE_CLOSE), {
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
    let uploadedHistoryId = this.activeHistoryId;

    this.connectorService.uploadTest(this.input_language_dropdown,
      this.input_version_dropdown,
      this.input_test_textarea).subscribe(
      (response) => {
        if (uploadedHistoryId != this.activeHistoryId) {
          return;
        }

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


  getCopyToClipboard(): string {
    return this.getProductiveCode().trimEnd();
  }

  getProductiveCode(): string {
    if (this.input_show_comments) {
      return this.GENERATED_CODE.concat('\n');
    }

    switch (this.input_language_dropdown) {
      case 'java':
        return this.stripJavaComments().concat('\n');
      default:
        return this.stripPythonComments().concat('\n');
    }
  }

  getTranslationOfMethodName(entry: HistoryEntry): String {
    if (entry.method == 'STP1' && isBefore(ChatState.BOT_MSG_UPLOAD_COMPLETED, this.currentStep)) {
      return this.i18nService.getTranslation(i18n.CHAT_STEP_LANGUAGE_SELECTION)
    }
    if (entry.method == 'STP2' && isBefore(ChatState.BOT_MSG_UPLOAD_COMPLETED, this.currentStep)) {
      return this.i18nService.getTranslation(i18n.CHAT_STEP_VERSION_SELECTION)
    }
    if (entry.method == 'STP3' && isBefore(ChatState.BOT_MSG_UPLOAD_COMPLETED, this.currentStep)) {
      return this.i18nService.getTranslation(i18n.CHAT_STEP_UPLOAD)
    }
    return entry.method;
  }

  getLengthOfTextField(): string {
    switch (this.i18nService.getBrowserLanguage()) {
      case 'en':
        return '230px'
      case 'fr':
        return '260px'
      default:
        return '210px'
    }
  }

  private stripJavaComments(): string {
    // Entferne nur die Kommentare und die dadurch entstandenen Leerzeilen
    return this.GENERATED_CODE
      .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '')  // Entferne Kommentare
      .replace(/^\s*[\r\n]/gm, '');             // Entferne leere Zeilen, die durch Kommentare entstanden
  }

  private stripPythonComments(): string {
    // Entferne nur die Python-Kommentare und die dadurch entstandenen Leerzeilen
    return this.GENERATED_CODE
      .replace(/#.*$/gm, '')                    // Entferne Kommentare
      .replace(/^\s*[\r\n]/gm, '');             // Entferne leere Zeilen, die durch Kommentare entstanden
  }
}
