import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CommentService } from '../../services/comment-service';
import { CommentDtoResponse } from '../../models/comment.model';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-comment-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './comment-list-component.html',
  styleUrls: ['./comment-list-component.css']
})
export class CommentListComponent implements OnInit {
  comments: CommentDtoResponse[] = [];
  loading = true;
  errorMessage = '';
  canModify = false; // Permite acceso a ADMIN, RECEPCIONIST y GUEST

  constructor(
    private commentService: CommentService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.checkUserRole();
    this.loadComments();
  }

  checkUserRole(): void {
    const storedRoles = localStorage.getItem('role');
    if (storedRoles) {
      try {
        const roles = JSON.parse(storedRoles);
        if (Array.isArray(roles)) {
          this.canModify = roles.some((r: any) => {
            const val = typeof r === 'string' ? r : (r.authority || '');
            return val === 'ADMIN' || val === 'ROLE_ADMIN' || 
                   val === 'RECEPCIONIST' || val === 'ROLE_RECEPCIONIST' || 
                   val === 'GUEST' || val === 'ROLE_GUEST';
          });
        } else {
          const val = typeof roles === 'string' ? roles : '';
          this.canModify = val === 'ADMIN' || val === 'ROLE_ADMIN' || 
                           val === 'RECEPCIONIST' || val === 'ROLE_RECEPCIONIST' || 
                           val === 'GUEST' || val === 'ROLE_GUEST';
        }
      } catch (e) {
        this.canModify = storedRoles.includes('ADMIN') || 
                         storedRoles.includes('RECEPCIONIST') || 
                         storedRoles.includes('GUEST');
      }
    } else {
      this.canModify = false;
    }
  }

  loadComments(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.commentService.getAll().subscribe({
      next: (data) => {
        this.comments = Array.isArray(data) ? [...data] : [];
        this.loading = false;
        this.cdr.markForCheck(); // Fuerza la actualización de la vista
      },
      error: (err) => {
        this.errorMessage = 'No se pudieron cargar los comentarios o no cuentas con los permisos necesarios.';
        this.loading = false;
        this.cdr.markForCheck();
        console.error(err);
      }
    });
  }

  deleteComment(id: number): void {
    if (!this.canModify) {
      alert('No tienes los permisos necesarios para realizar esta acción.');
      return;
    }

    if (confirm('¿Estás seguro de que deseas eliminar este comentario?')) {
      this.commentService.deleteComment(id).subscribe({
        next: () => {
          this.comments = this.comments.filter(comment => comment.id !== id);
          this.cdr.markForCheck();
        },
        error: (err) => {
          alert('Error al eliminar el comentario.');
          console.error(err);
        }
      });
    }
  }
}