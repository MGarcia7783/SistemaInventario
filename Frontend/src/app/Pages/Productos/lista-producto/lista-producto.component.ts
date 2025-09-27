import { Component, inject, OnInit } from '@angular/core';
import { WritableSignal, signal } from '@angular/core';
import { Producto } from '../../../Interface/producto';
import { ProductoService } from '../../../Services/producto.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormProductoComponent } from "../form-producto/form-producto.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lista-producto',
  standalone: true,
  imports: [
    MatIconModule,
    CommonModule,
    FormProductoComponent,
    FormsModule
],
  templateUrl: './lista-producto.component.html',
  styleUrl: './lista-producto.component.css'
})
export class ListaProductoComponent implements OnInit {
  modalAbierto: boolean = false;
  registros: WritableSignal<Producto[]> = signal<Producto[]>([]);  // Mostrar todos los registros
  editarRegistro: Producto = { idProducto: 0, codigoBarra: '', descripcion: '', idCatagoria: 0, categoriaDescripcion: '', precioVenta: 0, stock: 0, stockMinimo: 0, estado: 'Activo' };

  todosRegistros : Producto[] = []; // Guardar todos los registros para buscar
  valorBusqueda: string = '';

  private productoService = inject(ProductoService);

  ngOnInit(): void {
    this.cargarProductos();
  }

  //Cargar listado de productos
  cargarProductos() {
    this.productoService.getProductos().subscribe({
      next: (response) => {
        if(response && Array.isArray(response)) {
          this.todosRegistros = response;
          this.registros.set(response);
        }
      },
      error: (error) => {
        window.alert(error.message);
      }
    });
  }

  //Buscar registros
  buscarRegistros() {
    const valor = this.valorBusqueda.toLowerCase().trim();
    if(valor === '') {
      this.registros.set([...this.todosRegistros]);
    } else {
      const filtrados = this.todosRegistros.filter(registro =>
        registro.codigoBarra.toLowerCase().includes(valor) ||
        registro.descripcion.toLowerCase().includes(valor) ||
        registro.categoriaDescripcion.toLowerCase().includes(valor)
      );
      this.registros.set(filtrados);
    }
  }

  //Guardar registro
    guardarProducto(producto: Producto) {
      console.log(producto);

    // Crear un nuevo registro
    if(producto.idProducto === 0)
    {
      this.productoService.createProducto(producto).subscribe({
        next:(productoGuardado) => {
          this.registros.set([...this.registros(), productoGuardado]);
          this.cargarProductos();
          window.alert('Registro guardado satisfactoriamente.');
          this.cerrarModal();
        },
        error: (error) => {
          window.alert(error.message);
        }
      });
    } else {
    //Actualizar un registro existente
      this.productoService.updateProducto(producto.idProducto, producto).subscribe({
        next:(productoActualizado) => {
          const index = this.registros().findIndex(r => r.idProducto === productoActualizado.idProducto);
          if(index > -1) {
            const updateRegistro = [...this.registros()];
            updateRegistro[index] = productoActualizado;
            this.registros.set(updateRegistro);
          }
          this.cargarProductos();
          window.alert('Registro actualizado satisfactoriamente.');
          this.cerrarModal();
        },
        error:(error) => {
          window.alert(error.message);
        }
      });
    }
  }

  //Eliminar un registro
  eliminarRegistro(id: number) {
    const confirmarDelete = window.confirm('¿Estás seguro que deseas eliminar el registro?');
    if(confirmarDelete) {
      this.productoService.deteleProducto(id).subscribe({
        next:() => {
          this.cargarProductos();
        },
        error:(error) => {
          window.alert(error.message);
        }
      });
    }
  }

  //Abrir modal
  abrirModal(producto: Producto | null = null) {
    if(!this.modalAbierto) {
      this.editarRegistro = producto ? {...producto} : { idProducto: 0, codigoBarra: '', descripcion: '', idCatagoria: 0, categoriaDescripcion: '', precioVenta: 0, stock: 0, stockMinimo: 0, estado: 'Activo' };
      this.modalAbierto = true;
    }
  }

  //Cerrar modal
  cerrarModal() {
    if(this.modalAbierto) {
      this.modalAbierto = false;
    }
  }
}
