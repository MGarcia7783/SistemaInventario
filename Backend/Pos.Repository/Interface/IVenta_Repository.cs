using Pos.Model.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pos.Repository.Interface
{
    public interface IVenta_Repository
    {
        Task<List<Venta>> GetAll();
        Task<List<Venta>> BuscarFecha(DateOnly FechaInicio, DateOnly FechaFin);
        Task<Venta> Create(Venta venta);
        Task<Venta?> AnularVenta(int idVenta, string motivo, int idUsuario);
        Task ActualizarStock(List<DetalleVenta> detalleVentas);
        Task<List<DetalleVenta>> GetDatellesByIdVenta(int idVenta);
    }
}
