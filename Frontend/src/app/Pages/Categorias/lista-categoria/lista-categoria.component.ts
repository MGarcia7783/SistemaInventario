import { Component, signal, WritableSignal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { OnInit } from '@angular/core';
import { Categoria } from '../../../Interface/categoria';
import { CategoriaService } from '../../../Services/categoria.service';
import { inject } from '@angular/core';
import { NgFor } from '@angular/common';
import { FormCategoriaComponent } from '../form-categoria/form-categoria.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lista-categoria',
  standalone: true,
  imports: [
    MatIconModule,
    NgFor,
    FormsModule,
    FormCategoriaComponent,
    CommonModule
],
  templateUrl: './lista-categoria.component.html',
  styleUrl: './lista-categoria.component.css'
})
export class ListaCategoriaComponent implements OnInit {
  modalAbierto: boolean = false;
  registros: WritableSignal<Categoria[]> = signal<Categoria[]>([]);  // Mostrar todos los registros
  editarRegistro: Categoria = { idCategoria: 0, descripcion: '', estado: 'activo' };

  todosRegistros : Categoria[] = []; // Guardar todos los registros para buscar
  valorBusqueda: string = '';

  private categoriaService = inject(CategoriaService);

  ngOnInit(): void {
      this.cargarRegistros();
  }

  //Cargar listado de registros
  cargarRegistros() {
    this.categoriaService.getCategoria().subscribe({
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
      const filtrados = this.todosRegistros.filter(registro => registro.descripcion.toLowerCase().includes(valor) || registro.estado.toLowerCase().includes(valor)
      );
      this.registros.set(filtrados);
    }
  }

  //Guardar registro
    guardarRegistro(categoria: Categoria) {
      // Crear un nuevo registro
      if(categoria.idCategoria === 0)
      {
        this.categoriaService.createCategoria(categoria).subscribe({
          next:(categoriaGuardado) => {
            this.registros.set([...this.registros(), categoriaGuardado]);
            this.cargarRegistros();
            window.alert('Registro guardado satisfactoriamente.');
            this.cerrarModal();
          },
          error: (error) => {
            window.alert(error.message);
          }
        });
      } else {
        //Actualizar un registro existente
        this.categoriaService.updateCategoria(categoria.idCategoria, categoria).subscribe({
          next:(categoriaActualizado) => {
            const index = this.registros().findIndex(r => r.idCategoria === categoriaActualizado.idCategoria);
            if(index > -1) {
              const updateRegistro = [...this.registros()];
              updateRegistro[index] = categoriaActualizado;
              this.registros.set(updateRegistro);
            }
            this.cargarRegistros();
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
      this.categoriaService.deteleCategoria(id).subscribe({
        next:() => {
          this.cargarRegistros();
        },
        error:(error) => {
          window.alert(error.message);
        }
      });
    }
  }

  //Abrir modal
    abrirModal(categoria: Categoria | null = null) {
      if(!this.modalAbierto) {
        this.editarRegistro = categoria ? {...categoria} : { idCategoria: 0, descripcion: '', estado: 'Activo' };
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
