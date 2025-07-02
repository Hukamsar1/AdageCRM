// area.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { AreaService } from 'src/app/core/Service/areaService';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-location-form',
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './area.component.html',
    styleUrls: ['./area.component.scss']
})
export class AreaComponent implements OnInit {
  locationForm: FormGroup;
  countries: any[] = [];
  filteredStates: any[] = [];
  filteredCities: any[] = [];
  filteredAreas: any[] = [];
  
  // Loading states
  loading = false;
  loadingCountries = false;
  loadingStates = false;
  loadingCities = false;
  loadingAreas = false;

  constructor(
    private fb: FormBuilder, 
    private areaService: AreaService
  ) {
    this.locationForm = this.fb.group({
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      area: ['', [Validators.required, Validators.maxLength(100)]] // Example validators
    });
  }

  ngOnInit(): void {
    this.loadCountries();
  }

  // Form control getters
  get countryControl(): FormControl {
    return this.locationForm.get('country') as FormControl;
  }

  get stateControl(): FormControl {
    return this.locationForm.get('state') as FormControl;
  }

  get cityControl(): FormControl {
    return this.locationForm.get('city') as FormControl;
  }

  get areaControl(): FormControl {
    return this.locationForm.get('area') as FormControl;
  }

  loadCountries(): void {
    this.loadingCountries = true;
    this.areaService.getCountries()
      .pipe(finalize(() => this.loadingCountries = false))
      .subscribe({
        next: (data) => {
          this.countries = data;
          console.log('Countries loaded:', this.countries);
        },
        error: (err) => {
          console.error('Failed to load countries', err);
          // this.toastr.error('Failed to load countries');
        }
      });
  }

  onCountryChange(): void {
    const countryId = this.countryControl.value;
    this.resetDependentFields('state');
    
    if (countryId) {
      this.loadingStates = true;
      this.areaService.getStates(countryId)
        .pipe(finalize(() => this.loadingStates = false))
        .subscribe({
          next: (data) => {
            this.filteredStates = data;
            console.log('States loaded:', this.filteredStates);
          },
          error: (err) => {
            console.error('Failed to load states', err);
            // this.toastr.error('Failed to load states');
          }
        });
    } else {
      this.filteredStates = [];
      this.filteredCities = [];
      this.filteredAreas = [];
    }
  }

  onStateChange(): void {
    const stateId = this.stateControl.value;
    this.resetDependentFields('city');
    
    if (stateId) {
      this.loadingCities = true;
      this.areaService.getCities(stateId)
        .pipe(finalize(() => this.loadingCities = false))
        .subscribe({
          next: (data) => {
            this.filteredCities = data;
            console.log('Cities loaded:', this.filteredCities);
          },
          error: (err) => {
            console.error('Failed to load cities', err);
            // this.toastr.error('Failed to load cities');
          }
        });
    } else {
      this.filteredCities = [];
      this.filteredAreas = [];
    }
  }

  onCityChange(): void {
    const cityId = this.cityControl.value;
    this.resetDependentFields('area');
    
    if (cityId) {
      this.loadingAreas = true;
      this.areaService.getAreas(cityId)
        .pipe(finalize(() => this.loadingAreas = false))
        .subscribe({
          next: (data) => {
            this.filteredAreas = data;
            console.log('Areas loaded:', this.filteredAreas);
          },
          error: (err) => {
            console.error('Failed to load areas', err);
            // this.toastr.error('Failed to load areas');
          }
        });
    } else {
      this.filteredAreas = [];
    }
  }

  private resetDependentFields(fieldName: string): void {
    this.locationForm.get(fieldName)?.reset();
    if (fieldName === 'state') {
      this.locationForm.get('city')?.reset();
      this.locationForm.get('area')?.reset();
      this.filteredCities = [];
      this.filteredAreas = [];
    } else if (fieldName === 'city') {
      this.locationForm.get('area')?.reset();
      this.filteredAreas = [];
    }
  }
onSubmit(): void {
  if (this.locationForm.valid) {
    this.loading = true;
    this.areaService.saveLocation({
      countryId: this.countryControl.value,
      stateId: this.stateControl.value,
      cityId: this.cityControl.value,
      areaName: this.areaControl.value
    })
    .pipe(finalize(() => this.loading = false))
    .subscribe({
      next: () => {
        this.onReset();
      },
      error: (err) => {
        console.error('Failed to save location', err);
      }
    });
  } else {
    this.markFormAsTouched();
  }
}


  onReset(): void {
    this.locationForm.reset();
    this.filteredStates = [];
    this.filteredCities = [];
    this.filteredAreas = [];
  }

  private markFormAsTouched(): void {
    Object.values(this.locationForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  showError(controlName: string): boolean {
    const control = this.locationForm.get(controlName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }
}