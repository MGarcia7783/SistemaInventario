import { Injectable } from '@angular/core';
import { Usuario } from '../Interface/usuario';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable, catchError } from 'rxjs';
import { environments } from '../../Environment/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

private apiUrl = environments.apiUrl + '/usuarios';

  constructor(private http: HttpClient) { }

  //Método para obtener todos los registros
 getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  //Método para crear un nuevo registro
  createUsuario(usuario: Usuario): Observable<any> {
      return this.http.post<any>(this.apiUrl, usuario).pipe(
        catchError(this.handleError)
      );
    }

  //Actualizar una usuario
  updateUsuario(id: number, usuario: Usuario): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, usuario).pipe(
      catchError(this.handleError)
    );
  }

  //Eliminar una usuario
  deteleUsuario(id: number): Observable<any> {
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
