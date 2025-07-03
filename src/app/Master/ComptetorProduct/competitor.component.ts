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
  CompetitorForm!: FormGroup;
  isEdit = false;
  competitorId?: number;
  constructor(
    private fb: FormBuilder,
    private competitorService: CompetitorService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.CompetitorForm = this.fb.group({
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
      next: (data) => this.CompetitorForm.patchValue(data),
      error: (err) => this.showError('Error loading competitor')
    });
  }

  onSubmit(): void {
    if (this.CompetitorForm.invalid) {
      this.CompetitorForm.markAllAsTouched();
      return;
    }

    const data = {
      competitorName: this.CompetitorForm.get('competitorName')?.value.trim(),
      createdDate: new Date(),
      isDeleted: 0,
      isUpdated: new Date(),
      actionType: this.isEdit ? 'update' : 'create'
    };

    if (this.isEdit) {
      this.competitorService.update(this.competitorId!, data).subscribe({
        next: () => this.router.navigate(['/competitor-list']),
        error: () => this.showError('Update failed')
      });
    } else {
      this.competitorService.create(data).subscribe({
        next: () => this.router.navigate(['/competitor-list']),
        error: () => this.showError('Create failed')
      });
    }
  }

  showError(message: string) {
    alert(message);
  }

  clearForm() {
    this.CompetitorForm.reset();
  }

  closeForm() {
    this.router.navigate(['/competitor-list']);
  }

  goBack() {
    this.router.navigate(['/Mainlayout/competitor-list']);
  }
}
