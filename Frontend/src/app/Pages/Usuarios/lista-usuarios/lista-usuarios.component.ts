import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../Interface/usuario';
import { WritableSignal } from '@angular/core';
import { signal } from '@angular/core';
import { UsuarioService } from '../../../Services/usuario.service';
import { inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormUsuarioComponent } from '../form-usuario/form-usuario.component';

@Component({
  selector: 'app-lista-usuarios',
  standalone: true,
  imports: [
    MatIconModule,
    FormsModule,
    CommonModule,
    FormUsuarioComponent
  ],
  templateUrl: './lista-usuarios.component.html',
  styleUrl: './lista-usuarios.component.css'
})
export class ListaUsuariosComponent implements OnInit {
  modalAbierto: boolean = false;
  registros: WritableSignal<Usuario[]> = signal<Usuario[]>([]);  // Mostrar todos los registros
  editarRegistro: Usuario = { idUsuario: 0, nombres: '', apellidos: '', idRol: 0, rolDescripcion: '', telefono: '', email: '', clave: '', estado: 'Activo' };

  todosRegistros : Usuario[] = []; // Guardar todos los registros para buscar
  valorBusqueda: string = '';

  private usuarioService = inject(UsuarioService);  //Iyección del servicio

  ngOnInit(): void {
    this.cargarUsuario();
  }

  //Cargar listado de usuarios
  cargarUsuario() {
    this.usuarioService.getUsuarios().subscribe({
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
        registro.nombres.toLowerCase().includes(valor) ||
        registro.apellidos.toLowerCase().includes(valor) ||
        registro.rolDescripcion.toLowerCase().includes(valor) ||
        registro.email.toLowerCase().includes(valor)
      );
      this.registros.set(filtrados);
    }
  }

  //Guardar registro
  guardarUsuario(usuario: Usuario) {
  // Crear un nuevo registro
  if(usuario.idUsuario === 0)
  {
    this.usuarioService.createUsuario(usuario).subscribe({
      next:(usuarioGuardado) => {
        this.registros.set([...this.registros(), usuarioGuardado]);
        this.cargarUsuario();
        window.alert('Registro guardado satisfactoriamente.');
        this.cerrarModal();
      },
      error: (error) => {
        window.alert(error.message);
      }
    });
  } else {
    //Actualizar un registro existente
      this.usuarioService.updateUsuario(usuario.idUsuario, usuario).subscribe({
        next:(usuarioActualizado) => {
          const index = this.registros().findIndex(r => r.idUsuario === usuarioActualizado.idUsuario);
          if(index > -1) {
            const updateRegistro = [...this.registros()];
            updateRegistro[index] = usuarioActualizado;
            this.registros.set(updateRegistro);
          }
          this.cargarUsuario();
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
      this.usuarioService.deteleUsuario(id).subscribe({
        next:() => {
          this.cargarUsuario();
        },
        error:(error) => {
          window.alert(error.message);
        }
      });
    }
  }

  //Abrir modal
    abrirModal(usuario: Usuario | null = null) {
      if(!this.modalAbierto) {
        this.editarRegistro = usuario ? {...usuario} : { idUsuario: 0, nombres: '', apellidos: '', idRol: 0, rolDescripcion: '', telefono: '', email: '', clave: '', estado: 'Activo' };
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
