import { Injectable } from '@angular/core';
import { Categoria } from '../Interface/categoria';
import { environments } from '../../Environment/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private apiUrl = environments.apiUrl + '/categorias';

  constructor(private http: HttpClient) { }

  //Método para obtener todas las categorias
    getCategoria(): Observable<Categoria[]> {
      return this.http.get<Categoria[]>(this.apiUrl).pipe(
        catchError(this.handleError)
      );
    }

    //Crear nueva categoria
    createCategoria(categoria: Categoria): Observable<any> {
      return this.http.post<any>(this.apiUrl, categoria).pipe(
        catchError(this.handleError)
      );
    }

    //Actualizar una categoria
    updateCategoria(id: number, categoria: Categoria): Observable<any> {
      return this.http.put<any>(`${this.apiUrl}/${id}`, categoria).pipe(
        catchError(this.handleError)
      );
    }

    //Eliminar una categoria
    deteleCategoria(id: number): Observable<any> {
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
