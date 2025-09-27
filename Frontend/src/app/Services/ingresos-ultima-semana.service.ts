import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable, catchError } from 'rxjs';
import { environments } from '../../Environment/environment';
import { IngresosUltimaSemana } from '../Interface/ingresos-ultima-semana';

@Injectable({
  providedIn: 'root'
})
export class IngresosUltimaSemanaService {

  private apiUrl = environments.apiUrl + '/dashboard/ingresos_ultima_semana';

  constructor(private http: HttpClient) { }

  //Método para obtener las ventas
      getIngresosVentasUltimaSemana(): Observable<IngresosUltimaSemana[]> {
        return this.http.get<IngresosUltimaSemana[]>(this.apiUrl).pipe(
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
