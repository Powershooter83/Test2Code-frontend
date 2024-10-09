import {Component, inject, Renderer2, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatStep, MatStepLabel, MatStepper} from '@angular/material/stepper';
import {ActivatedRoute, Router} from '@angular/router';
import {HistoryService} from '../../service/history.service';
import {RestService} from '../../service/rest.service';
import {ValidatorService} from '../../service/validator.service';
import {HighlightAuto} from 'ngx-highlightjs';
import {HighlightLineNumbers} from 'ngx-highlightjs/line-numbers';
import {NgForOf, NgIf} from '@angular/common';
import {MatTabLink, MatTabNav, MatTabNavPanel} from '@angular/material/tabs';
import {MatError, MatFormField} from '@angular/material/form-field';
import {MatSelect} from '@angular/material/select';
import {MatOption} from '@angular/material/core';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {v4 as uuidv4} from 'uuid';

@Component({
  selector: 'app-page',
  standalone: true,
  imports: [
    MatStepper,
    MatStep,
    MatStepLabel,
    HighlightAuto,
    FormsModule,
    HighlightLineNumbers,
    NgIf,
    MatTabNavPanel,
    ReactiveFormsModule,
    MatFormField,
    MatSelect,
    MatOption,
    MatError,
    NgForOf,
    MatInput,
    MatTabLink,
    MatTabNav,
    MatButton,
    FormsModule
  ],
  templateUrl: './page.component.html',
  styleUrl: './page.component.scss'
})
export class PageComponent {
  languages: string[] = []
  versions: string[] = []

  selectedLanguage: string = "";

  //CODE GENERATION
  showGeneratedCode: boolean = false;
  generatedCode: string = "";


  hasGenerated = false;
  numberOfSteps = 5;
  @ViewChild('stepper') stepper: MatStepper | undefined;
  formGroups: FormGroup[] = [];
  stepColors: string[] = [];
  amountOfTest: number[] = [];
  currentQuery = 'haalo';
  selectedVersion = 'Python 3.6';
  protected readonly name = name;
  private _formBuilder = inject(FormBuilder);
  myForm: FormGroup = this._formBuilder.group({
    ctrl1: [''],
    ctrl2: ['', Validators.required],
  });
  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });

  constructor(private renderer: Renderer2,
              private restService: RestService,
              private validator: ValidatorService,
              private history: HistoryService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  onTabClick(language: string) {
    this.selectedLanguage = language;
    this.getVersions(language);
  }


  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      console.log(params)
    });

    /*  this.act.paramMap.subscribe(params => {
        console.log(params)
        let uuid = params['uuid'];

        let entry: HistoryEntry | undefined = this.history.getEntry(uuid);
        if (entry == undefined) {
          console.log(uuid)
          this.router.navigate(['/']);
        } else {
          this.myForm.get('ctrl1')?.setValue(entry.testCases);
        }

      });

     */


    this.myForm.get('ctrl1')?.setValidators([Validators.required, this.validator.getValidator('Python')]);
    this.myForm.get('ctrl1')?.updateValueAndValidity();
    this.restService.getLanguages().subscribe(
      (data: string[]) => {
        this.languages = data;
        this.onTabClick(this.languages[0])
      },
      (error) => {
        console.error('Fehler beim Abrufen der Sprachen:', error);
      }
    );
    for (let i = 1; i <= this.numberOfSteps; i++) {
      const group = this._formBuilder.group({
        testCtrl: ['', Validators.required],
      });
      this.formGroups.push(group);
    }
  }

  getVersions(language: string) {
    this.restService.getVersions(language).subscribe(
      (data: string[]) => {
        this.versions = data;
      },
      (error) => {
        console.error('Fehler beim Abrufen der Versionen:', error);
      }
    );

  }

  generateUuid64(): string {
    // Generiere eine UUID (36 Zeichen) und füge zufällige Zeichen hinzu, um 64 Zeichen zu erreichen
    let uuid = uuidv4(); // 36 Zeichen
    let extraRandom = uuidv4().replace(/-/g, ''); // Zusätzliche 32 zufällige Zeichen
    return uuid + extraRandom;
  }

  startGeneration() {
    const uuid = this.generateUuid64();
    this.router.navigate([`/${uuid}`]);
    this.history.createEntry(uuid, this.myForm.get('ctrl1')?.value)

    let amount = (this.myForm.get('ctrl1')?.value.match(/@Test/g) || []).length

    this.amountOfTest = Array.from({length: amount}, (_, i) => i);
    this.restService.uploadText(this.myForm.get('ctrl1')?.value).subscribe(() => {
      this.hasGenerated = true;
    });
    this.restService.listenToEvents().subscribe(event => {
      if (event.successful) {
        this.stepColors.push('green');
      } else {
        this.stepColors.push('red');
      }
      this.firstFormGroup.get('firstCtrl')?.setErrors(null);
      this.firstFormGroup.updateValueAndValidity();
      this.stepper!.next();
      this.firstFormGroup.get('firstCtrl')?.setErrors({required: true});
      this.firstFormGroup.updateValueAndValidity();
      this.setStepColors();

      if (event.isLast) {
        this.showGeneratedCode = true;
        this.generatedCode = event.code;
      }
    })

  }

  setStepColors() {
    const stepIcons = document.querySelectorAll('.mat-step-header .mat-step-icon');
    stepIcons.forEach((icon, index) => {
      if (index <= this.stepper!.selectedIndex) {
        const color = this.stepColors[index % this.stepColors.length];
        this.renderer.setStyle(icon, 'background-color', color);
      }
    });
  }
}
