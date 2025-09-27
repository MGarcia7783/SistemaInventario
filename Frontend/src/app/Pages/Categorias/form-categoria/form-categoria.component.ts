import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Categoria } from '../../../Interface/categoria';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-categoria',
  standalone: true,
  imports: [
    MatIconModule,
    FormsModule
  ],
  templateUrl: './form-categoria.component.html',
  styleUrl: './form-categoria.component.css'
})
export class FormCategoriaComponent {
  @Output() cerrar = new EventEmitter<void>();

  @Input() categoria: Categoria = { idCategoria: 0, descripcion: '', estado: 'Activo' };
  @Output() guardar = new EventEmitter<Categoria>();

  cerrarModal() {
    this.cerrar.emit();
  }

  guardarRegistro(rolForm: NgForm) {
    rolForm.form.markAllAsTouched();   // Marcar los campos como tocados
    if(rolForm.invalid) {
      window.alert('Debe especificar todos los campos obligatorios antes de continuar.');
      return;
    }
    this.guardar.emit(this.categoria);
  }
}
