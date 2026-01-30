import { CommonModule } from '@angular/common';
import { Component, DebugNode, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../../core/services/task-service.service';
import { Task } from '../../../core/models/tasks';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { DateFormat } from '../../../core/pipes/dateFormatPipe';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { FormTaskComponent } from '../form-task/form-task.component';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import { ToolbarComponent } from '../../../shared/toolbar/toolbar.component';

@Component({
  selector: 'app-card-tasks',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardTitle, MatCardSubtitle, MatCardContent, MatCardActions, MatCard, MatInput, MatButton, MatCheckboxModule, MatCardHeader, MatLabel, MatFormField, DateFormat, MatButtonModule, MatIconModule, MatTooltipModule, ToolbarComponent],
  templateUrl: './card-tasks.component.html',
  styleUrl: './card-tasks.component.scss'
})

export class CardTasksComponent implements OnInit {

  private taskService = inject(TaskService);
  private router = inject(Router);
  private matDialog = inject(MatDialog)
  user!: string;
  private userId!: string;

  tasks = signal<Task[]>([]); 
  isEditing = signal<boolean>(false); 
  editing = this.isEditing.asReadonly();
  constructor() {
    this.isEditing.set(false);
    
    const userInfo = localStorage.getItem('user_info');
    if (userInfo) {
      const parsedUser = JSON.parse(userInfo);
      this.user = parsedUser.email;
      this.userId = parsedUser.id;
    }
  }

  ngOnInit() {
    this.loadTasks(this.userId);
  }

  loadTasks(userId: string) {
    this.taskService.getTasks(userId).subscribe({
      next: (data: Task[]) => {
        const sortedTasks = data.map(task => {
          return {
            ...task
          };
        }); 

        this.tasks.set(sortedTasks);
      },
      error: (err) => console.error('Error conectando con el endpoint:', err)
    });
  }

  showModal(currentTask?: Task) {
    const dialog = this.matDialog.open(FormTaskComponent, {
      width: '400px',
      disableClose: true,
      data: this.editing() ? currentTask : null
    });

    dialog.afterClosed().subscribe((result) => {
      if (result) {
        let dto = result;
        if (this.editing()) {
          dto = { ...dto, id: currentTask?.id }
        }
        this.saveTask(dto);
      }
    });
  }

  saveTask(task: Task) {
    const taskData = {
      ...task
    };

    if (this.editing()) {
      this.taskService.updateTask(task.id, taskData).subscribe({
        next: () => {
          this.loadTasks(this.userId); 
          this.isEditing.set(false);

          Swal.fire({
            title: 'Notificación',
            text: 'Tarea actualizada con éxito',
            icon: 'success',
            confirmButtonText: 'Ok'
          })
        },
        error: (err) => console.error('Error al actualizar:', err)
      });
    } else {
      this.taskService.createTask(taskData).subscribe({
        next: () => {
          this.loadTasks(this.userId); 

          Swal.fire({
            title: 'Notificación',
            text: 'Tarea registrada con éxito',
            icon: 'success',
            confirmButtonText: 'Ok'
          })
        },
        error: (err) => console.error('Error al crear:', err)
      });
    }
  }

  toggleStatus(task: Task) {
    const updatedTask: Task = {
      ...task,
      completed: !task.completed
    };

    this.taskService.updateTask(task.id!, updatedTask).subscribe({
      next: () => {
        this.tasks.update(currentTasks =>
          currentTasks.map(t => t.id === task.id ? updatedTask : t)
        );
      }
    });
  }

  prepareEdit(task: Task) {
    this.isEditing.set(true); 
    this.showModal(task);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteTask(id: string) {
    Swal.fire({
      title: "Confirmación",
      text: "¿Estás seguro de que deseas eliminar esta tarea?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.taskService.deleteTask(id).subscribe({
          next: () => {
            this.tasks.update(prevTasks => prevTasks.filter(t => t.id !== id));
            Swal.fire({
              title: 'Notificación',
              text: 'Tarea eliminada',
              icon: 'success',
              confirmButtonText: 'Ok'
            })
          }
        });
      }
    });
  }

  endSession() {
    Swal.fire({
      title: "Confirmación",
      text: "¿Estás seguro de que deseas cerrar sesión?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        this.router.navigate(['/login']);
      }
    });
    
  }
}
