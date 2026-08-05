import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './dashboard-component.html',
  styleUrls: ['./dashboard-component.css']
})
export class DashboardComponent implements OnInit {
  username: string = 'Usuario';
  userRoles: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        // Decodifica la segunda parte del JWT (payload) para extraer los datos del usuario
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.username = payload.sub || payload.username || 'Usuario';
        
        const roles = payload.roles || payload.authorities || [];
        this.userRoles = Array.isArray(roles) ? roles.join(', ') : roles;
      } catch (e) {
        console.error('Error al decodificar el token:', e);
      }
    }
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }
}