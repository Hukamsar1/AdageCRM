import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { finalize } from 'rxjs';
import { AreaService } from 'src/app/core/Service/areaService';
import { CompetitorService } from 'src/app/core/Service/CompetitorService';
import { EmployeeService } from 'src/app/core/Service/EmployeeService';
import { LeadService } from 'src/app/core/Service/LeadService';
import { ProductService } from 'src/app/core/Service/productService';

@Component({
    selector: 'app-lead',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './lead.component.html',
    styleUrls: ['./lead.component.scss']
})
export class LeadComponent implements OnInit {
    leadForm!: FormGroup;
    isSubmitting = false;
    competitors: any[] = [];
    businesses: any[] = [];
    products: any[] = [];
    enquiries: any[] = [];
    countries: any[] = [];
    states: any[] = [];
    cities: any[] = [];
    suggestedProducts: any[] = [];
    purposes = ['Sent', 'Pending'];
    purposeVisit = ['Demo','New','Demo','followup','Negotiation','Closure' ];
    references = ['Reference A', 'Reference B'];
    quotations = ['Sent', 'Pending'];
    statuses = ['Attempted to Contact', 'Contact In Future', 'Contacted', 'Not Contacted', 'Not Interested', 'Interested', 'Lost Lead', 'Won Lead', 'Junk Lead', 'Not Contacted','Pre Qualified','Not Qualified'];
    priorities = ['High', 'Medium', 'Low'];
    visitTypes = ['Single', 'Joint'];
    VisitAction = ['Follow Up','Negotiation','Demo','Closure' ]
    visitWithList = ['Reporting Manager', 'Staff'];
    assignToList = ['Partner', 'Staff'];
    error: string | null = null;

    constructor(private fb: FormBuilder,
        private router: Router,
        private enqueryService: EmployeeService,
        private leadService: LeadService,
        private productService: ProductService,
        private areaService: AreaService,
        private comptitorservice: CompetitorService) { }

    ngOnInit(): void {
        this.initForm();
        this.loadEnquery();
        this.loadCountries();
        this.loadProduct();
        this.loadBussiness();
        this.loadCompetitors();


        this.leadForm.get('quotation')?.valueChanges.subscribe(value => {
    const dateControl = this.leadForm.get('quotationDate');

    if (value === 'Sent') {
      dateControl?.enable();
      dateControl?.setValidators(Validators.required);
    } else if (value === 'Pending') {
      dateControl?.disable();
      dateControl?.clearValidators();
      dateControl?.setValue('');
    }

    dateControl?.updateValueAndValidity();
  });
    }

    private initForm(): void {
        this.leadForm = this.fb.group({
            businessName: ['', Validators.required],
            firstName: ['', Validators.required],
            lastName: [''],
            titledesignation: ['', Validators.required],
            email: ['', Validators.required],
            phone: ['', Validators.required],
            mobile : ['', Validators.required],
            website : ['', Validators.required],
            address: [''],
            area: ['', Validators.required],
            countryId: ['', Validators.required],
            stateId: ['', Validators.required],
            cityId: ['', Validators.required],
            pinCode: [''],
            business: ['', Validators.required],
            product: ['', Validators.required],
            suggestedProduct: ['', Validators.required],
            enquiry: ['', Validators.required],
            reference: ['', Validators.required],
            purpose: ['', Validators.required],
            purposeofvisit: ['', Validators.required],
            noofemployee: [''],
            quotation: ['', Validators.required],
            quotationDate: [{ value: '', disabled: true }, Validators.required],
            discussion: [''],
            leadStatus: ['', Validators.required],
            leadPriority: ['', Validators.required],
            chancesOfClosure: [''],
            EstimatedClosureDate:[''],
            EstimateDeal:[''],
            visitType: ['', Validators.required],
            visitWith: ['', Validators.required],
            leadAssignTo: ['', Validators.required],
            nextVisitDate: ['', Validators.required],
            nextVisitAction: ['', Validators.required]
        });
    }

    onSubmit(): void {
        if (this.leadForm.invalid) {
            this.leadForm.markAllAsTouched();
            return;
        }

        this.isSubmitting = true;
        this.leadService.createLead(this.leadForm.value)
            .pipe(finalize(() => this.isSubmitting = false))
            .subscribe({
                next: () => {
                    alert('Lead saved successfully!');
                   // this.clearForm();
                },
                error: () => {
                    alert('An error occurred while saving the lead.');
                }
            });
    }

onProductChange(event: Event): void {
  const selectedProduct = (event.target as HTMLSelectElement).value;

  if (selectedProduct === 'Using Competitor') {
    this.suggestedProducts = this.competitors.map(c => ({
      name: c.competitorName
    }));
  } else {
    this.suggestedProducts = this.products
      .filter(p => p.productName !== 'Using Competitor')
      .map(p => ({
        name: p.productName
      }));
  }

  // suggestedProduct field reset kar do
  this.leadForm.patchValue({ suggestedProduct: '' });
}

  loadCompetitors(): void {
        this.comptitorservice.getAllCompetitors().subscribe({
            next: (data) => {
                this.competitors = data;
            },
            error: (err) => {
                this.error = 'Error loading competitors';
                console.error(err);
            }
        });
    }

    loadBussiness(): void {
        this.leadService.getAllBussiness().subscribe({
            next: (data) => {
                this.businesses = data;
              
            },
            error: (err) => {
                this.error = 'Error loading Bussiness';
                console.error(err);

            }
        });
    }


    loadEnquery(): void {
        this.enqueryService.getAllEnquery().subscribe({
            next: (data) => {
                this.enquiries = data.map(item => ({
                    ...item,

                }));
            },
            error: (err) => {
                this.error = 'Error loading Enquery';
                console.error(err);

            }
        });
    }

    // loadProduct(): void {
    //     this.productService.getAllProducts().subscribe({
    //         next: (data) => {
    //             this.products = data.map(item => ({
    //                 ...item,
    //             }));
    //         },
    //         error: (err) => {
    //             this.error = 'Error loading Enquery';
    //             console.error(err);
    //         }
    //     });
    // }

loadProduct(): void {
  this.productService.getAllProducts().subscribe({
    next: (data) => {
      this.products = data;
    },
    error: (err) => {
      this.error = 'Error loading products';
      console.error(err);
    }
  });
}


    loadCountries(): void {
        this.areaService.getCountries().subscribe({
            next: (countries) => {
                this.countries = countries.map(c => ({
                    id: c.countryId,
                    name: c.countryName
                }));
            },
            error: (error) => {
                console.error('Error loading countries:', error);
            }
        });
    }



    loadStates(countryId: number): void {
        this.areaService.getStates(countryId).subscribe({
            next: (states) => {
                this.states = states.map(state => ({
                    id: state.stateId,
                    name: state.stateName
                }));
            },
            error: (error) => {
                console.error('Error loading states:', error);
            }
        });
    }



    loadCities(stateId: number): void {
        this.areaService.getCities(stateId).subscribe({
            next: (cities) => {
                this.cities = cities.map(city => ({
                    id: city.cityId,
                    name: city.cityName
                }));
            },
            error: (error) => {
                console.error('Error loading cities:', error);
            }
        });
    }


    onCountryChange(): void {
        const countryId = this.leadForm.get('countryId')?.value;
        if (countryId) {
            this.loadStates(countryId);
            this.leadForm.patchValue({ stateId: '', cityId: '' });
            this.states = [];
            this.cities = [];
        }
    }

    onStateChange(): void {
        const stateId = this.leadForm.get('stateId')?.value;
        if (stateId) {
            this.loadCities(stateId);
            this.leadForm.patchValue({ cityId: '' });
            this.cities = [];
        }
    }

    clearForm(): void {
        this.leadForm.reset();
        this.leadForm.markAsPristine();
        this.leadForm.markAsUntouched();
    }
}
