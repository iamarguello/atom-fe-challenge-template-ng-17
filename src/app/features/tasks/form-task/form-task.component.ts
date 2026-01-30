import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Task } from '../../../core/models/tasks';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatCard, MatCardContent, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-form-task',
  standalone: true,
  imports: [ReactiveFormsModule, MatLabel, MatCardTitle, MatCardSubtitle, MatCardContent, MatFormField, MatCard, MatDialogModule, MatInputModule, MatIconModule, MatButtonModule ],
  templateUrl: './form-task.component.html',
  styleUrl: './form-task.component.scss'
})
export class FormTaskComponent {

  taskForm!: FormGroup;
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<FormTaskComponent>);
  public data = inject<Task>(MAT_DIALOG_DATA);

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      title: [this.data?.title || '', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: [
        this.data?.description || '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(500)],
      ],
    });
  }

  onSaveTask(): void {
    if (this.taskForm.valid) {
      this.dialogRef.close(this.taskForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
