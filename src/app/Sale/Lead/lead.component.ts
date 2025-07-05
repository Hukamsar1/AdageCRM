import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { finalize } from 'rxjs';
import { AreaService } from 'src/app/core/Service/areaService';
import { CompetitorService } from 'src/app/core/Service/CompetitorService';
import { EmployeeService } from 'src/app/core/Service/EmployeeService';
import { LeadService } from 'src/app/core/Service/LeadService';
import { ProductService } from 'src/app/core/Service/productService';

@Component({
    selector: 'app-lead',
    imports: [CommonModule, ReactiveFormsModule, FormsModule],
    standalone: true,
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
    purposeVisit = ['Demo', 'New', 'Demo', 'followup', 'Negotiation', 'Closure'];
    references = ['Reference A', 'Reference B'];
    quotations = ['Sent', 'Pending'];
    statuses = ['Attempted to Contact', 'Contact In Future', 'Contacted', 'Not Contacted', 'Not Interested', 'Interested', 'Lost Lead', 'Won Lead', 'Junk Lead', 'Not Contacted', 'Pre Qualified', 'Not Qualified'];
    priorities = ['High', 'Medium', 'Low'];
    visitTypes = ['Single', 'Joint'];
    VisitAction = ['Follow Up', 'Negotiation', 'Demo', 'Closure']
    visitWithList = ['Reporting Manager', 'Staff'];
    assignToList = ['Partner', 'Staff'];
    error: string | null = null;
    today = new Date().toISOString().split('T')[0];
    leadType: string = 'new';
    isFollowup: boolean = false;
    businessNameAsDropdown = false;    // controls input vs select
    existingBusinessList: any[] = [];  // for dropdown options



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
  this.loadCompanyName(); 

  this.leadForm.get('quotation')?.valueChanges.subscribe(value => {
    const dateControl = this.leadForm.get('quotationDate');
    if (value === 'Sent') {
      dateControl?.enable();
      dateControl?.setValidators(Validators.required);
    } else {
      dateControl?.disable();
      dateControl?.clearValidators();
      dateControl?.setValue('');
    }
    dateControl?.updateValueAndValidity();
  });

  // Watch leadType changes
  this.leadForm.get('leadType')?.valueChanges.subscribe(() => this.onLeadTypeChange());

  // Call once on load too
  this.onLeadTypeChange();
}


    private initForm(): void {
        this.leadForm = this.fb.group({
            leadType: ['', Validators.required],
            businessName: ['', Validators.required],
            firstName: ['', Validators.required],
            lastName: [''],
            titleDesignation: ['', Validators.required],
            email: ['', Validators.email],    // or Validators.required if you want
            phone: [''],
            mobile: ['', Validators.required],
            website: [''],
            address: [''],
            area: ['', Validators.required],
            countryId: ['', Validators.required],
            stateId: ['', Validators.required],
            cityId: ['', Validators.required],
            pinCode: [''],
            business: ['', Validators.required],
            product: ['', Validators.required],
            suggestedProduct: [''],
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
            annualRevenue: [''],    // use *all lowercase* to match formControlName
            estimateDeal: [''],    // likewise
            estimatedClosureDate: [''],
            visitType: ['', Validators.required],
            visitWith: ['', Validators.required],
            leadAssignTo: ['', Validators.required],
            nextVisitDate: ['', Validators.required],
            nextVisitAction: ['', Validators.required]
        });
    }

   onLeadTypeChange(): void {
  this.isFollowup = this.leadType === 'followup';
  this.businessNameAsDropdown = this.isFollowup;

  // Turant form enable/disable karo
  const fieldsToDisableInFollowup = [
    'businessName',
    'firstName',
    'lastName',
    'titleDesignation',
    'email',
    'phone',
    'mobile',
    'website',
    'enquiry',
    'noofemployee',
    'annualRevenue',
    'address',
    'business',
    'product'
  ];

  Object.keys(this.leadForm.controls).forEach(key => {
    const control = this.leadForm.get(key);
    if (control) {
      if (this.isFollowup && fieldsToDisableInFollowup.includes(key)) {
        control.disable();
      } else {
        control.enable();
      }
    }
  });

  if (!this.isFollowup) {
    this.leadForm.get('businessName')?.reset();
  }
}



onBusinessSelected(event: Event): void {
  const target = event.target as HTMLSelectElement;
  const selectedcompname = target?.value;

  if (!selectedcompname) return;

  this.leadService.getAllDataByCompanyName(selectedcompname).subscribe({
    next: (business) => {
      const compData = business[0];

      // Load dependent dropdowns first
      this.loadStates(compData.countryId);
      this.loadCities(compData.stateId);

      // Pehle patch karo
      this.leadForm.patchValue(this.mapBusinessResponse(business));

      // Disable specific fields *after* patching if followup hai
      if (this.isFollowup) {
        const fieldsToDisableInFollowup = [
          'businessName',
          'firstName',
          'lastName',
          'titleDesignation',
          'email',
          'phone',
          'mobile',
          'website',
          'enquiry',
          'noofemployee',
          'annualRevenue',
          'address',
          'business',
          'product'
        ];

        fieldsToDisableInFollowup.forEach(key => {
          this.leadForm.get(key)?.disable();
        });
      }

      // Suggested products update
      if (compData.product === 'Using Competitor') {
        this.suggestedProducts = this.competitors.map(c => ({ name: c.competitorName }));
      } else {
        this.suggestedProducts = this.products
          .filter(p => p.productName !== 'Using Competitor')
          .map(p => ({ name: p.productName }));
      }

      // Quotation date enable/disable
      if (compData.quotation === 'Sent') {
        this.leadForm.get('quotationDate')?.enable();
      } else {
        this.leadForm.get('quotationDate')?.disable();
      }
    },
    error: (err) => {
      console.error('Error fetching business details:', err);
      alert('Error fetching business details. Please try again.');
    }
  });
}


    private mapBusinessResponse(business: any) {
        const compData = business[0];
        return {
            businessName: compData.businessName,
            firstName: compData.firstName,
            lastName: compData.lastName,
            titleDesignation: compData.titleDesignation,
            address: compData.address,
            area: compData.area,
            countryId: compData.countryId,
            stateId: compData.stateId,
            cityId: compData.cityId,
            pinCode: compData.pinCode,
            phone: compData.phone,
            mobile: compData.mobile,
            email: compData.email,
            website: compData.website,
            annualRevenue: compData.annualRevenue,
            estimateDeal: compData.estimateDeal,
            estimatedClosureDate: this.formatDateForInput(compData.estimatedClosureDate),
            noofemployee: compData.noOfEmployee,
            product: compData.product,
            suggestedProduct: compData.suggestedProduct,
            discussion: compData.discussion,
            chancesOfClosure: compData.chancesOfClosure,
            enquiry: compData.enquiry,
            reference: compData.reference,
            purpose: compData.purpose,
            purposeofvisit: compData.purposeofVisit,
            quotation: compData.quotation,
            quotationDate: this.formatDateForInput(compData.quotationDate),
            leadStatus: compData.leadStatus,
            leadPriority: compData.leadPriority,
            visitType: compData.visitType,
            visitWith: compData.visitWith,
            leadAssignTo: compData.leadAssignTo,
            nextVisitDate: this.formatDateForInput(compData.nextVisitDate),
            business: compData.business,
        };
    }

    private formatDateForInput(dateString: string | null): string | null {
        if (!dateString) return null;
        return dateString.split('T')[0];
    }



    onSubmit(): void {

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
        const control = this.leadForm.get('suggestedProduct');

        if (selectedProduct === 'Using Competitor') {
            this.suggestedProducts = this.competitors.map(c => ({ name: c.competitorName }));
            control?.setValidators(Validators.required);
        } else {
            this.suggestedProducts = this.products
                .filter(p => p.productName !== 'Using Competitor')
                .map(p => ({ name: p.productName }));
            control?.clearValidators();
            control?.setValue('');
        }

        control?.updateValueAndValidity();
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

    loadCompanyName(): void {
        this.leadService.getAllCompanyName().subscribe({
            next: (data) => {
                this.existingBusinessList = data;

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
        this.leadForm.get('quotationDate')?.disable();
    }

}
