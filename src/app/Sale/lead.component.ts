import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { LeadService } from '../core/Service/LeadService';
import { finalize } from 'rxjs';
import { EmployeeService } from '../core/Service/EmployeeService';
import { ProductService } from '../core/Service/productService';
import { AreaService } from '../core/Service/areaService';

@Component({
    selector: 'app-lead',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './lead.component.html',
    styleUrls: ['./lead.component.scss']
})
export class LeadComponent implements OnInit {
    leadForm!: FormGroup;
    isSubmitting = false;
    businesses: any[] = [];
    products: any[] = [];
    enquiries: any[] = [];
    countries: any[] = [];
    states: any[] = [];
    cities: any[] = [];
    suggestedProducts: any[] = [];
    purposes = ['Purpose A', 'Purpose B'];
    references = ['Reference A', 'Reference B'];
    quotations = ['Quotation A', 'Quotation B'];
    statuses = ['New', 'Follow-up', 'Closed'];
    priorities = ['High', 'Medium', 'Low'];
    visitTypes = ['Online', 'In-person'];
    visitWithList = ['Manager', 'Executive'];
    assignToList = ['Salesperson 1', 'Salesperson 2'];
    error: string | null = null;

    constructor(private fb: FormBuilder,
        private router: Router,
        private enqueryService: EmployeeService,
        private leadService: LeadService,
        private productService: ProductService,
        private areaService: AreaService) { }

    ngOnInit(): void {
        this.initForm();
        this.loadEnquery();
        this.loadProduct();
        this.loadCountries();
        this.loadEnquery();
        this.loadProduct();
        this.loadBussiness();
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
            quotation: ['', Validators.required],
            quotationDate: ['', Validators.required],
            discussion: [''],
            leadStatus: ['', Validators.required],
            leadPriority: ['', Validators.required],
            chancesOfClosure: [''],
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

        // Example: Send data to API
        this.leadService.createLead(this.leadForm.value)
            .pipe(finalize(() => this.isSubmitting = false))
            .subscribe({
                next: () => {
                    alert('Lead saved successfully!');
                    this.clearForm();
                },
                error: () => {
                    alert('An error occurred while saving the lead.');
                }
            });
    }

    loadBussiness(): void {
        this.leadService.getAllBussiness().subscribe({
            next: (data) => {
                this.businesses = data;
              alert("Successfully Bussiness Load");
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
                this.products = data.map(item => ({
                    ...item,
                }));
            },
            error: (err) => {
                this.error = 'Error loading Enquery';
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
