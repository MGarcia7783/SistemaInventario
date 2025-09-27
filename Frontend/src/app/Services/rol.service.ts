import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environments } from '../../Environment/environment';
import { Rol } from '../Interface/rol';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  private apiUrl = environments.apiUrl + '/roles';

  constructor(private http: HttpClient) { }

  //Método para obtener todos los roles
  getRoles(): Observable<Rol[]> {
    return this.http.get<Rol[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  //Crear nuevo rol
  createRol(rol: Rol): Observable<any> {
    return this.http.post<any>(this.apiUrl, rol).pipe(
      catchError(this.handleError)
    );
  }

  //Actualizar un rol
  updateRol(id: number, rol: Rol): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, rol).pipe(
      catchError(this.handleError)
    );
  }

  //Eliminar un rol
  deteleRol(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }


  private handleError(error: HttpErrorResponse) {
    let mensajeError = 'Ocurrió un error inesperado.';
    let statusCode = error.status || 0;
    let detallesErrores: any = null;

    if (error.error instanceof ErrorEvent) {
       // Error del cliente o de red
      mensajeError = `Error: ${error.error.message}`;
    } else {
      // Error del backend
      if (statusCode === 0) {
        mensajeError = 'No hay conexión con el servidor.';
      } else if (error.error) {
        // Si el backend envía un mensaje personalizado
        mensajeError = error.error.message || `Código: ${statusCode}, Mensaje: ${error.message}`;

      // Captura los errores detallados de validación si existen
      if(error.error.errores) {
        detallesErrores = error.error.errores;
      }
    }
    }

    //return throwError(() => new Error(mensajeError));
    return throwError(() => ({
      message: mensajeError,
      status: statusCode,
      detalles: detallesErrores
    }));
  }
}
