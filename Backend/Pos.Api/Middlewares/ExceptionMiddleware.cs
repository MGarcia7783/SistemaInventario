using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Text.Json;

namespace Pos.Api.Middlewares
{
    public class ExceptionMiddleware
    {
        // RequestDelegate, representa el siguiente midleware en el pipeline
        private readonly RequestDelegate _next;

        // ILogger, registra los errores
        private readonly ILogger<ExceptionMiddleware> _logger;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        // Método principal que se ejecuta en cada solicitud HTTP
        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                // Capturar cualquier excepción
                await _next(context);
            }
            catch (Exception ex)
            {
                // Registra la excepción
                _logger.LogError(ex, "Se capturó una excepción inesperada.");
                // Genera una respuesta HTTP 
                await HandleExceptionAsync(context, ex);
            }
        }

        // Método construye una respuesta HTTP en formato JSON cuando ocurre una excepción.
        private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            // Obtenie la ruta donde ocurrió el error
            var path = context.Request.Path;
            context.Response.ContentType = "application/json";

            // Asignar un código de estado HTTP según el tipo de excepción
            context.Response.StatusCode = exception switch
            {
                KeyNotFoundException => (int)HttpStatusCode.NotFound,                                // 404: recurso no encontrado
                ArgumentException or ArgumentNullException => (int)HttpStatusCode.BadRequest,        // 400: datos inválidos
                UnauthorizedAccessException => (int)HttpStatusCode.Unauthorized,                    // 401: no autorizado
                DbUpdateException => (int)HttpStatusCode.InternalServerError,                       // 500: error de base de datos
                _ => (int)HttpStatusCode.InternalServerError                                        // 500. error genérico
            };

            // Construir mensaje de error personalizado
            var errorResponse = new
            {
                StatusCode = context.Response.StatusCode, // Código de estado HTTP
                Message = context.Response.StatusCode == 500 ? "Ocurrió un error interno en el servidor." : exception.Message,
                Detail = context.Response.StatusCode == 500 && !context.Request.Host.Host.Contains("localhost") ? "Contacte al administrador del sistema." : exception.Message,
                Path = path,
                Timestamp = DateTime.UtcNow
            };

            // Serializar el JSON en camelCase
            var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
            var errorJson = JsonSerializer.Serialize(errorResponse, options);

            // Escribir la respuesta en el cuerpo de la respuesta HTTP
            await context.Response.WriteAsync(errorJson);
        }
    }
}
