// employee.component.ts
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Designation, DesignationForDropdown } from 'src/app/core/interface/Ideignation';
import { Employee, EmployeeDropdown } from 'src/app/core/interface/IEmployee';
import { AreaService } from 'src/app/core/Service/areaService';
import { DesignationService } from 'src/app/core/Service/degnationService';
import { Department, DepartmentService } from 'src/app/core/Service/DepartmentService ';

import { EmployeeService } from 'src/app/core/Service/EmployeeService';

@Component({
    selector: 'app-employee-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './employee.component.html',
    styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {
    employeeForm: FormGroup;
    departments: Department[] = [];
    designations: DesignationForDropdown[] = [];
    reportToList: EmployeeDropdown[] = [];

    existingAadharPath: string | null = null;
    existingResumePath: string | null = null;
    existingAppointmentPath: string | null = null;

    countries: any[] = [];
    states: any[] = [];
    cities: any[] = [];
    areas: any[] = [];

    isSubmitting = false;
    aadharFile: File | null = null;
    resumeFile: File | null = null;
    appointmentFile: File | null = null;

    isLoading = false;
    isEditMode = false;
    employeeid!: number;

    constructor(
        private fb: FormBuilder,
        private employeeService: EmployeeService,
        private departmentService: DepartmentService,
        private designationService: DesignationService,
        private router: Router,
        private route: ActivatedRoute,
        private areaService: AreaService
    ) {
        this.employeeForm = this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            phone: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
            email: ['', [Validators.required, Validators.email]],
            dob: ['', Validators.required],
            countryId: ['', Validators.required],
            stateId: ['', Validators.required],
            cityId: ['', Validators.required],
            areaId: ['', Validators.required],
            address: ['', Validators.required],
            departmentId: ['', Validators.required],
            designationId: ['', Validators.required],
            reportToId: [''],
            accountHolder: ['', Validators.required],
            accountNumber: ['', Validators.required],
            IFSC: ['', Validators.required],
            bankAddress: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.loadDropdownData();
        this.loadCountries();
        this.checkEditMode();
        this.setupFormListeners();
    }

    private setupFormListeners(): void {
        this.employeeForm.get('countryId')?.valueChanges.subscribe(countryId => {
            if (countryId) {
                this.loadStates(countryId);
                this.resetDependentControls(['stateId', 'cityId', 'areaId']);
            }
        });

        this.employeeForm.get('stateId')?.valueChanges.subscribe(stateId => {
            if (stateId) {
                this.loadCities(stateId);
                this.resetDependentControls(['cityId', 'areaId']);
            }
        });

        this.employeeForm.get('cityId')?.valueChanges.subscribe(cityId => {
            if (cityId) {
                this.loadAreas(cityId);
                this.employeeForm.get('areaId')?.reset();
            }
        });
    }

    private resetDependentControls(controlNames: string[]): void {
        controlNames.forEach(controlName => this.employeeForm.get(controlName)?.reset());
    }

    private mapDesignationForDropdown(designation: Designation): DesignationForDropdown {
        return {
            id: designation.designationId,
            name: designation.designationName,
            designationName: designation.designationName,
            departmentId: designation.departmentId
        };
    }

    loadDropdownData(): void {
        this.loadDepartments();
        this.loadDesignations();
        // this.loadReportToList();
    }

    loadDepartments(): void {
        this.departmentService.getDepartments().subscribe({
            next: (departments: Department[]) => {
                this.departments = departments;
            },
            error: (error) => {
                console.error('Error loading departments:', error);
            }
        });
    }


    loadDesignations(): void {
        this.designationService.getDesignations().subscribe({
            next: (designations: Designation[]) => {
                this.designations = designations
                    .filter(desg => !desg.isDeleted || desg.isDeleted === 0)
                    .map(desg => this.mapDesignationForDropdown(desg));
            },
            error: (error) => {
                console.error('Error loading designations:', error);
            }
        });
    }

    // loadReportToList(): void {
    //     this.employeeService.getAllEmployees().subscribe({
    //         next: (employees: Employee[]) => {
    //             this.reportToList = employees
    //                 .filter(emp => !emp.isDeleted || emp.isDeleted === 0)
    //                 .map(emp => ({
    //                     id: emp.id || 0,
    //                     firstName: emp.firstName,
    //                     lastName: emp.lastName,
    //                     reportToId: emp.reportToId
    //                 }));
    //         },
    //         error: (error) => {
    //             console.error('Error loading report-to list:', error);
    //         }
    //     });
    // }

    loadCountries(): void {
        this.areaService.getCountries().subscribe({
            next: (countries) => {
                this.countries = countries.map(country => ({
                    id: country.countryId,
                    name: country.countryName
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

    // employee.component.ts
    private loadEmployeeData(id: number): void {
        this.isLoading = true;
        this.employeeService.getEmployeeById(id).subscribe({
            next: (employee) => {
                // Format the date properly for the date input    
                this.employeeForm.patchValue({
                    firstName: employee.firstName,
                    lastName: employee.lastName,
                    phone: employee.phone,
                    email: employee.email,
                    dob: employee.dob ? new Date(employee.dob).toISOString().substring(0, 10) : '',
                    countryId: employee.countryId,
                    stateId: employee.stateId,
                    cityId: employee.cityId,
                    areaId: employee.areaId,
                    address: employee.address,
                    departmentId: employee.departmentId,
                    designationId: employee.designationId,
                    reportToId: employee.reportToId,
                    accountHolder: employee.accountHolder,
                    accountNumber: employee.accountNumber,
                    IFSC: employee.ifsc,
                    bankAddress: employee.bankAddress,
                    aadharFile: employee.aadharFilePath,
                    resumeFile: employee.resumeFilePath,
                    appointmentFile: employee.appointmentLetterFilePath
                });

                // Store existing file paths with null fallback for undefined cases
                this.existingAadharPath = employee.aadharFilePath ?? null;
                this.existingResumePath = employee.resumeFilePath ?? null;
                this.existingAppointmentPath = employee.appointmentLetterFilePath ?? null;
                // Load dependent dropdowns
                if (employee.countryId) {
                    this.loadStates(employee.countryId);
                }
                if (employee.stateId) {
                    this.loadCities(employee.stateId);
                }
                if (employee.cityId) {
                    this.loadAreas(employee.cityId);
                }

                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error loading employee:', error);
                this.isLoading = false;
                this.showError('Failed to load employee data');
            }
        });
    }

    private checkEditMode(): void {
        this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if (id) {
                this.isEditMode = true;
                this.employeeid = +id;
                this.loadEmployeeData(this.employeeid);
            }
        });
    }

    
    loadAreas(cityId: number): void {
        this.areaService.getAreas(cityId).subscribe({
            next: (areas) => {
                this.areas = areas.map(area => ({
                    id: area.areaId,
                    name: area.areaName
                }));
            },
            error: (error) => {
                console.error('Error loading areas:', error);
            }
        });
    }

    // employee.component.ts
    onSubmit(): void {
    if (this.employeeForm.invalid) {
        this.employeeForm.markAllAsTouched();
        return;
    }

    this.isSubmitting = true;

    // ✅ Create ke time documents mandatory check
    if (!this.isEditMode) {
        if (!this.aadharFile || !this.resumeFile || !this.appointmentFile) {
            this.isSubmitting = false;
            this.showError('Please upload all required documents (Aadhar, Resume, Appointment Letter)');
            return;
        }
    }

    // ✅ Prepare employee data
    const employeeData = {
        EmployeeId: this.isEditMode ? this.employeeid : 0,
        FirstName: this.employeeForm.get('firstName')?.value,
        LastName: this.employeeForm.get('lastName')?.value,
        Phone: this.employeeForm.get('phone')?.value,
        Email: this.employeeForm.get('email')?.value,
        dob: new Date(this.employeeForm.get('dob')?.value).toISOString(),
        CountryId: Number(this.employeeForm.get('countryId')?.value),
        StateId: Number(this.employeeForm.get('stateId')?.value),
        CityId: Number(this.employeeForm.get('cityId')?.value),
        AreaId: this.employeeForm.get('areaId')?.value,
        Address: this.employeeForm.get('address')?.value,
        DepartmentId: Number(this.employeeForm.get('departmentId')?.value),
        DesignationId: Number(this.employeeForm.get('designationId')?.value),
        ReportToId: this.employeeForm.get('reportToId')?.value ? Number(this.employeeForm.get('reportToId')?.value) : null,
        AccountHolder: this.employeeForm.get('accountHolder')?.value,
        AccountNumber: this.employeeForm.get('accountNumber')?.value,
        IFSC: this.employeeForm.get('IFSC')?.value,
        BankAddress: this.employeeForm.get('bankAddress')?.value,
        AadharFilePath: this.aadharFile ? null : this.existingAadharPath,
        ResumeFilePath: this.resumeFile ? null : this.existingResumePath,
        AppointmentLetterFilePath: this.appointmentFile ? null : this.existingAppointmentPath,
        IsDeleted: 0,
        ActionType: this.isEditMode ? 'Update' : 'Insert'
    };

    const formData = new FormData();
    formData.append('employeeJson', JSON.stringify(employeeData));
    if (this.aadharFile) formData.append('AadharFile', this.aadharFile, this.aadharFile.name);
    if (this.resumeFile) formData.append('ResumeFile', this.resumeFile, this.resumeFile.name);
    if (this.appointmentFile) formData.append('AppointmentLetterFile', this.appointmentFile, this.appointmentFile.name);

    if (this.isEditMode) {
        this.updateEmployee(formData);
    } else {
        this.createEmployee(formData);
    }

    this.logFormDataContents(formData);
}



    private createEmployee(formData: FormData): void {
        this.employeeService.createEmployee(formData).subscribe({
            next: (response) => {
                this.isSubmitting = false;
                this.showSuccess('Employee created successfully!');
                this.employeeForm.reset();
                this.resetFileInputs();
            },
            error: (error) => {
                this.isSubmitting = false;
                console.error('Error details:', error);
                this.showError(error.error?.message || 'Error creating employee');
            }
        });
    }

    private updateEmployee(formData: FormData): void {
        this.employeeService.updateEmployee(this.employeeid, formData).subscribe({
            next: (response) => {
                this.isSubmitting = false;
                this.showSuccess('Employee updated successfully!');
                this.router.navigate(['/Mainlayout/employee/list']);
            },
            error: (error) => {
                this.handleError(error, 'updating');
            }
        });
    }

    private handleError(error: HttpErrorResponse, action: string): void {
        this.isSubmitting = false;
        console.error(`Error ${action} employee:`, error);
        this.showError(error.error?.message || `Error ${action} employee`);
    }
    // Helper method to debug FormData contents
    private logFormDataContents(formData: FormData) {
        console.log('--- FormData Contents ---');
        formData.forEach((value, key) => {
            if (value instanceof File) {
                console.log(`${key}: File - ${value.name} (${value.size} bytes)`);
            } else {
                console.log(`${key}:`, value);
            }
        });
    }
    onFileChange(event: Event, field: string): void {
        const input = event.target as HTMLInputElement;
        if (!input.files || input.files.length === 0) return;

        const file = input.files[0];
        switch (field) {
            case 'aadhar':
                this.aadharFile = file;
                break;
            case 'resume':
                this.resumeFile = file;
                break;
            case 'appointment':
                this.appointmentFile = file;
                break;
        }
    }

    private resetFileInputs(): void {
        this.aadharFile = null;
        this.resumeFile = null;
        this.appointmentFile = null;
        this.existingAadharPath = null;
        this.existingResumePath = null;
        this.existingAppointmentPath = null;

        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => (input as HTMLInputElement).value = '');
    }

    private showSuccess(message: string): void {
        // Replace with your preferred notification method
        alert(message);
    }

    private showError(message: string): void {
        // Replace with your preferred notification method
        alert(message);
    }

    onClear(): void {
        this.employeeForm.reset();
    }
}