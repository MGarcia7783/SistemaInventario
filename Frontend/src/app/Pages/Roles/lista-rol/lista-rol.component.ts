import { Component, signal, WritableSignal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { OnInit } from '@angular/core';
import { Rol } from '../../../Interface/rol';
import { RolService } from '../../../Services/rol.service';
import { inject } from '@angular/core';
import { NgFor } from '@angular/common';
import { FormRolComponent } from "../form-rol/form-rol.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lista-rol',
  standalone: true,
  imports: [
    MatIconModule,
    NgFor,
    FormRolComponent,
    CommonModule,
    FormsModule
],
  templateUrl: './lista-rol.component.html',
  styleUrl: './lista-rol.component.css'
})
export class ListaRolComponent implements OnInit {
  modalAbierto: boolean = false;
  registros: WritableSignal<Rol[]> = signal<Rol[]>([]);  // Mostrar todos los registros
  editarRegistro: Rol = { idRol: 0, descripcion: '', estado: 'activo' };

  todosRoles : Rol[] = []; // Guardar todos los registros para buscar
  valorBusqueda: string = '';

  private rolService = inject(RolService);  //Iyección del servicio

  ngOnInit(): void {
    this.cargarRol();
  }

  //Cargar listado de roles
  cargarRol() {
    this.rolService.getRoles().subscribe({
      next: (response) => {
        if(response && Array.isArray(response)) {
          this.todosRoles = response;
          this.registros.set(response);
        }
      },
      error: (error) => {
        window.alert(error.message);
      }
    });
  }

  //Buscar registros
  buscarRoles() {
    const valor = this.valorBusqueda.toLowerCase().trim();
    if(valor === '') {
      this.registros.set([...this.todosRoles]);
    } else {
      const filtrados = this.todosRoles.filter(rol => rol.descripcion.toLowerCase().includes(valor) || rol.estado.toLowerCase().includes(valor)
      );
      this.registros.set(filtrados);
    }
  }

  //Guardar registro
  guardarRol(rol: Rol) {
    // Crear un nuevo registro
    if(rol.idRol === 0)
    {
      this.rolService.createRol(rol).subscribe({
        next:(rolGuardado) => {
          this.registros.set([...this.registros(), rolGuardado]);
          this.cargarRol();
          window.alert('Registro guardado satisfactoriamente.');
          this.cerrarModal();
        },
        error: (error) => {
          window.alert(error.message);
        }
      });
    } else {
      //Actualizar un registro existente
      this.rolService.updateRol(rol.idRol, rol).subscribe({
        next:(rolActualizado) => {
          const index = this.registros().findIndex(r => r.idRol === rolActualizado.idRol);
          if(index > -1) {
            const updateRoles = [...this.registros()];
            updateRoles[index] = rolActualizado;
            this.registros.set(updateRoles);
          }
          this.cargarRol();
          window.alert('Registro actualizado satisfactoriamente.');
          this.cerrarModal();
        },
        error:(error) => {
          window.alert(error.message);
        }
      });
    }
  }

  //Eliminar un rol
  eliminarRol(id: number) {
    const confirmarDelete = window.confirm('¿Estás seguro que deseas eliminar el registro?');
    if(confirmarDelete) {
      this.rolService.deteleRol(id).subscribe({
        next:() => {
          this.cargarRol();
        },
        error:(error) => {
          window.alert(error.message);
        }
      });
    }
  }

  //Abrir modal
  abrirModal(rol: Rol | null = null) {
    if(!this.modalAbierto) {
      this.editarRegistro = rol ? {...rol} : { idRol: 0, descripcion: '', estado: 'Activo' };
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
