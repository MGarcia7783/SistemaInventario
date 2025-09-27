import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Rol } from '../../../Interface/rol';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-rol',
  standalone: true,
  imports: [
    MatIconModule,
    FormsModule
  ],
  templateUrl: './form-rol.component.html',
  styleUrl: './form-rol.component.css'
})
export class FormRolComponent {
  @Output() cerrar = new EventEmitter<void>();

  @Input() rol: Rol = { idRol: 0, descripcion: '', estado: 'Activo' };
  @Output() guardar = new EventEmitter<Rol>();

  cerrarModal() {
    this.cerrar.emit();
  }

  guardarRegistro(rolForm: NgForm) {
    rolForm.form.markAllAsTouched();   // Marcar los campos como tocados
    if(rolForm.invalid) {
      window.alert('Debe especificar todos los campos obligatorios antes de continuar.');
      return;
    }
    this.guardar.emit(this.rol);
  }
}
