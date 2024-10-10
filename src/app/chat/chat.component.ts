import {AfterViewChecked, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatFormField} from '@angular/material/form-field';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {ChatState} from '../../models/state.model';
import {MatInput} from '@angular/material/input';
import {I18nService} from '../i18n.service';
import {i18n} from '../../models/i18n.model';
import {HighlightLineNumbers} from 'ngx-highlightjs/line-numbers';
import {HighlightAuto} from 'ngx-highlightjs';
import {ThemingService} from '../theming.service';
import {ConnectorService} from '../connector.service';

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
        NgClass
    ],
    templateUrl: './chat.component.html',
    styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit, AfterViewChecked {
    BOT_LOGO_URL = 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80'

    input_version_dropdown: any;
    input_language_dropdown: any;
    input_test_textarea: any;

    versions: string[] = [];
    languages: string[] = [];

    currenStep: ChatState = ChatState.SELECT_LANGUAGE;
    currentStepIndex: number = 0;
    GENERATED_CODE: string =
        `def add_numbers(a, b):
        return a + b`;
    protected readonly i18n = i18n;
    @ViewChild('scrollBottom') private scrollBottom!: ElementRef;

    constructor(protected i18nService: I18nService,
                private themingService: ThemingService,
                private connectorService: ConnectorService) {
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

                setTimeout(() => {
                    this.increaseCurrentStep();
                }, 1000);
                break;
            case ChatState.SELECT_VERSION:
                this.increaseCurrentStep();
                this.currenStep = ChatState.UPLOAD_TEST;

                setTimeout(() => {
                    this.increaseCurrentStep();
                }, 1000);
                break;
            case ChatState.UPLOAD_TEST:
                this.increaseCurrentStep();
                this.currenStep = ChatState.WAITING_FOR_RESULTS;
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
        this.scrollToBottom();
        this.connectorService.getLanguages().subscribe(
            (languages) => {
                this.languages = languages;
            }
        );
    }

    ngAfterViewChecked() {
        this.scrollToBottom();
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
                console.log(response);
            }
        )

    }
}
