import {Component, inject, OnInit, Renderer2, ViewChild} from '@angular/core';
import {MatTab, MatTabGroup, MatTabLink, MatTabNav, MatTabNavPanel} from '@angular/material/tabs';
import {MatFormField} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {CommonModule, NgForOf} from '@angular/common';
import {MatStep, MatStepLabel, MatStepper, MatStepperNext, MatStepperPrevious} from '@angular/material/stepper';
import {RestService} from '../rest.service';

@Component({
  selector: 'app-page',
  standalone: true,
  imports: [
    MatTab,
    MatTabGroup,
    MatFormField,
    MatTabNav,
    MatTabLink,
    MatTabNavPanel,
    MatInput,
    ReactiveFormsModule,
    MatButton,
    MatOption,
    MatSelect,
    NgForOf,
    MatStep,
    MatStepLabel,
    MatStepper,
    MatStepperNext,
    MatStepperPrevious,
    CommonModule
  ],
  templateUrl: './page.component.html',
  styleUrl: './page.component.scss'
})
export class PageComponent implements OnInit {
  languages: string[] = []

  versions: string[] = []
  selectedLanguage = this.languages[0];

  hasGenerated = false;
  numberOfSteps = 5;
  @ViewChild('stepper') stepper: MatStepper | undefined;
  formGroups: FormGroup[] = [];
  stepColors: string[] = [];
  amountOfTest: number[] = [];
  private _formBuilder = inject(FormBuilder);
  myForm: FormGroup = this._formBuilder.group({
    ctrl1: ['', Validators.required],
    ctrl2: ['', Validators.required],
  });
  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });

  constructor(private renderer: Renderer2, private resteService: RestService) {
  }

  onTabClick(link: string) {
    this.selectedLanguage = link;
    this.getVersions(link);
  }


  ngOnInit() {
    this.resteService.getLanguages().subscribe(
      (data: string[]) => {
        this.languages = data;
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
    this.resteService.getVersions(language).subscribe(
      (data: string[]) => {
        this.versions = data;
      },
      (error) => {
        console.error('Fehler beim Abrufen der Versionen:', error);
      }
    );

  }

  startGeneration() {
    let amount = (this.myForm.get('ctrl1')?.value.match(/@Test/g) || []).length

    this.amountOfTest = Array.from({length: amount}, (_, i) => i);
    this.resteService.uploadText(this.myForm.get('ctrl1')?.value).subscribe(response => {
      this.hasGenerated = true;
    });
    this.resteService.listenToEvents().subscribe(event => {
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
    });

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
