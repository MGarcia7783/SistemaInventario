import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon'
import { RouterModule } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    MatIconModule,
    RouterModule,
    NgClass
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  menuAbierto: string | null = null;

  //Controlar la apertura y cierre de los submenús
  enlace_menu(menu: string, event: Event) {
    event.preventDefault();
    this.menuAbierto = this.menuAbierto === menu ? null : menu;
  }

  //Verificar si un submenú está abierto
  esSubMenuAbierto(menu: string): boolean {
    return this.menuAbierto === menu;
  }

  //Método para cerrar los submenús
  cerrarSubMenu() {
    this.menuAbierto = null;
  }
}
