import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Rol } from '../../../Interface/rol';
import { RolService } from '../../../Services/rol.service';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../../Interface/usuario';
import { NgForm, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-usuario',
  standalone: true,
  imports: [
    MatIconModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './form-usuario.component.html',
  styleUrl: './form-usuario.component.css'
})
export class FormUsuarioComponent implements OnInit {
  @Input() usuario: Usuario = { idUsuario: 0, nombres: '', apellidos: '', idRol: 0, rolDescripcion: '', telefono: '', email: '', clave: '', estado: 'Activo' };
  @Output() guardar = new EventEmitter<Usuario>();
  @Output() cerrar = new EventEmitter<void>();

  roles: Rol[] = [];

  constructor(private rolService: RolService) {}

  ngOnInit(): void {
    this.cargarRoles();
  }

  cargarRoles(): void {
    this.rolService.getRoles().subscribe({
      next: (response) => {
        this.roles = response;
      },
      error: (error) => {
        window.alert("Error al cargar los roles." + error);
      }
    })
  }

  guardarRegistro(rolForm: NgForm) {
    rolForm.form.markAllAsTouched();   // Marcar los campos como tocados
    if(rolForm.invalid) {
      window.alert('Debe especificar todos los campos obligatorios antes de continuar.');
      return;
    }
    this.guardar.emit(this.usuario);
  }

  cerrarModal() {
    this.cerrar.emit();
  }

}
