import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompetitorService } from 'src/app/core/Service/CompetitorService';


@Component({
  selector: 'app-competitor-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './competitor.component.html',
  styleUrls: ['./competitor.component.html']
})
export class CompetitorFormComponent implements OnInit {
  competitorForm!: FormGroup;
  isEdit = false;
  competitorId?: number;
  duplicateError = false;
  errorMessage = '';

loading : boolean = false;


  constructor(
    private fb: FormBuilder,
    private competitorService: CompetitorService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.competitorForm = this.fb.group({
      competitorName: ['', Validators.required]
    });

    this.competitorId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.competitorId) {
      this.isEdit = true;
      this.loadCompetitorData(this.competitorId);
    }
  }

  private loadCompetitorData(id: number): void {
    this.competitorService.getById(id).subscribe({
      next: (data) => this.competitorForm.patchValue(data),
      error: (err) => this.showError('Error loading competitor')
    });
  }

  onSubmit(): void {
  if (this.competitorForm.invalid) {
    this.competitorForm.markAllAsTouched();
    return;
  }

  const name = this.competitorForm.get('competitorName')?.value.trim();

  // 🔍 Duplicate check before submit
  this.competitorService.isDuplicate(name, this.isEdit ? this.competitorId : undefined).subscribe({
    next: (isDuplicate) => {
      if (isDuplicate) {
        this.showError('Competitor already exists!');
        this.competitorForm.reset();
        return;
      }

      const data = {
        competitorName: name,
        createdDate: new Date(),
        isDeleted: 0,
        isUpdated: new Date(),
        actionType: this.isEdit ? 'update' : 'create'
      };

      if (this.isEdit) {
        this.competitorService.update(this.competitorId!, data).subscribe({
          next: () => this.showSuccess('Competitor updated successfully'),
          error: () => this.showError('Update failed')
        });
      } else {
        this.competitorService.create(data).subscribe({
          next: () => this.showSuccess('Competitor created successfully'),
          error: () => this.showError('Create failed')
        });
      }
    },
    error: () => this.showError('Error checking duplicate')
  });
}


showError(message: string) {
  alert(message); // or use toast
}

showSuccess(message: string) {
  alert(message); // or use toast
  this.router.navigate(['/competetor-list']);
}


  clearForm() {
    this.competitorForm.reset();
  }

  closeForm() {
    this.router.navigate(['/competetor-list']);
  }

  goBack() {
    this.router.navigate(['/Mainlayout/competetor-list']);
  }
}
