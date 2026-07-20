import { Component,ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup;
  errorMessage: string | null = null; // Decalaramos la propiedad para el manejo de errores

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef // 2. Inyectar en el constructor
  ) { // Abrimos el cuerpo del constructor correctamente
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  } // Cerramos el constructor antes de declarar los métodos

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.errorMessage = null;

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        this.router.navigate(['/welcome']);
      },
      error: (err) => {
        console.log('Error completo recibido:', err);
        
        if (err.error && typeof err.error === 'object' && 'mensaje' in err.error) {
          this.errorMessage = err.error.mensaje;
        } else {
          this.errorMessage = err.error || 'Error al conectar con el servidor.';
        }

        this.cdr.detectChanges(); // 3. Forzar a Angular a pintar el error YA

      }
    });
  }
}