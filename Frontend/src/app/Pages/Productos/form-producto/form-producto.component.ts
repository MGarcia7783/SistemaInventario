import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Producto } from '../../../Interface/producto';
import { Categoria } from '../../../Interface/categoria';
import { CategoriaService } from '../../../Services/categoria.service';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-producto',
  standalone: true,
  imports: [
    MatIconModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './form-producto.component.html',
  styleUrl: './form-producto.component.css'
})
export class FormProductoComponent implements OnInit {

  @Input() producto: Producto = { idProducto: 0, codigoBarra: '', descripcion: '', idCatagoria: 0, categoriaDescripcion: '', precioVenta: 0, stock: 0, stockMinimo: 0, estado: 'Activo' };
  @Output() guardar = new EventEmitter<Producto>();
  @Output() cerrar = new EventEmitter<void>();

  categorias: Categoria[] = [];

  constructor(private categoriaService: CategoriaService) {}

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.categoriaService.getCategoria().subscribe({
      next: (response) => {
        this.categorias = response;
      },
      error: (error) => {
        window.alert("Error al cargar las categorías." + error);
      }
    })
  }

  guardarRegistro(productoForm: NgForm) {
    productoForm.form.markAllAsTouched();   // Marcar los campos como tocados
    if(productoForm.invalid) {
      window.alert('Debe especificar todos los campos obligatorios antes de continuar.');
      return;
    }
    this.guardar.emit(this.producto);
  }

  cerrarModal() {
    this.cerrar.emit();
  }
}
