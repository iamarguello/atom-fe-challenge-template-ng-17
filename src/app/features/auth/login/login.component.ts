import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../../core/services/login-service.service';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { HttpStatusCode } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule, MatCardModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(LoginService);
  private router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  async onSubmit() {
    if (this.loginForm.valid) {
      const { email } = this.loginForm.value;
        
        await this.authService.login({ email: email as string }).subscribe({ 
          next: (response ) => { 
            debugger;
            console.log('response logincomponent ', response)
            if (response && response.data && response.data.token) {
              localStorage.setItem('auth_token', response.data.token);
              
              localStorage.setItem('user_info', JSON.stringify(response.data.user));
            }
            this.router.navigate(['/task']);          
         }, 
         error: (err) => { 
            if(err.status==HttpStatusCode.NotFound){
              Swal.fire({
                    title: "Confirmación",
                    text: "La cuenta de correo electrónica no se encuentra registrada, desea registrarla?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Si",
                    cancelButtonText: "No"
                  }).then((result) => {
                    if (result.isConfirmed) {
                      this.authService.createUser({email: email as string}).subscribe({
                        next: () => {
                          this.onSubmit();
                          Swal.fire({
                            title: 'Notificación',
                            text: 'Usuario registrado satisfactoriamente.',
                            icon: 'success',
                            confirmButtonText: 'Ok'
                          })
                        }
                      });
                    }
                  });
            }
          }
      });

    }
  }
}
