using Pos.Model.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pos.Service.Interface
{
    public interface IVenta_Service
    {
        Task<List<Venta>> GetAll();
        Task<List<Venta>> BuscarFecha(DateOnly FechaInicio, DateOnly FechaFin);
        Task<Venta> Create(Venta venta);
        Task<Venta?> AnularVenta(int idVenta, string motivo, int idUsuario);
        Task<List<DetalleVenta>> GetDatellesByIdVenta(int idVenta);
    }
}
