using Pos.Model.Models;
using Pos.Repository.Interface;
using Pos.Service.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pos.Service.Service
{
    public class Venta_Service : IVenta_Service
    {
        private readonly IVenta_Repository _venta_Repository;

        public Venta_Service(IVenta_Repository venta_Repository)
        {
            _venta_Repository = venta_Repository;
        }

        public async Task<Venta?> AnularVenta(int idVenta, string motivo, int idUsuario)
        {
            return await _venta_Repository.AnularVenta(idVenta, motivo, idUsuario);
        }

        public async Task<List<Venta>> BuscarFecha(DateOnly FechaInicio, DateOnly FechaFin)
        {
            return await _venta_Repository.BuscarFecha(FechaInicio, FechaFin);
        }

        public async Task<Venta> Create(Venta venta)
        {
            return await _venta_Repository.Create(venta);
        }

        public async Task<List<Venta>> GetAll()
        {
            return await _venta_Repository.GetAll();
        }

        public async Task<List<DetalleVenta>> GetDatellesByIdVenta(int idVenta)
        {
            return await _venta_Repository.GetDatellesByIdVenta(idVenta);
        }
    }
}
