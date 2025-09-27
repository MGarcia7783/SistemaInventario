import { Routes } from '@angular/router';
import { ListaRolComponent } from './Pages/Roles/lista-rol/lista-rol.component';
import { ListaCategoriaComponent } from './Pages/Categorias/lista-categoria/lista-categoria.component';
import { ListaUsuariosComponent } from './Pages/Usuarios/lista-usuarios/lista-usuarios.component';
import { ListaProductoComponent } from './Pages/Productos/lista-producto/lista-producto.component';
import { FormVentaComponent } from './Pages/Ventas/form-venta/form-venta.component';
import { DashboardComponent } from './Pages/Dashboard/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: 'Pages/Roles',
    component: ListaRolComponent
  },
  {
    path: 'Pages/Categorias',
    component: ListaCategoriaComponent
  },
  {
    path: 'Pages/Usuarios',
    component: ListaUsuariosComponent
  },
  {
    path: 'Pages/Productos',
    component: ListaProductoComponent
  },
  {
    path: 'Pages/Ventas',
    component: FormVentaComponent
  },
  {
    path: 'Pages/Dashboard',
    component: DashboardComponent
  }
];
