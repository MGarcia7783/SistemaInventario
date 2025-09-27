using Microsoft.EntityFrameworkCore;
using Pos.Model.Context;
using Pos.Model.Vistas;
using Pos.Repository.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pos.Repository.Repository
{
    public class Dashboard_Repository : IDashboard_Repository
    {
        private readonly PosContext _context;

        public Dashboard_Repository(PosContext context)
        {
            _context = context;
        }

        public async Task<List<IngresosUltimaSemanaView>> GetIngresosUltimaSemana()
        {
            var ventas = await _context.IngresosUltimaSemana
                .FromSqlRaw("SELECT * FROM vw_total_ingresos_ultima_semana")
                .ToListAsync();

            return ventas;
        }

        public async Task<List<ProductosMasVendidosView>> GetProductosMasVendidos()
        {
            var productos = await _context.ProductosMasVendidos
                .FromSqlRaw("SELECT * FROM vw_productos_mas_vendidos")
                .ToListAsync();

            return productos;
        }

        public async Task<List<ProductosPorAgotarView>> GetProductosPorAgotar()
        {
            var productos = await _context.ProductosPorAgotar
                .FromSqlRaw("SELECT * FROM vw_productos_por_agotar")
                .ToListAsync();

            return productos;
        }

        public async Task<List<TotalProductosVendidosView>> GetTotalProductosVendidos()
        {
            var productos = await _context.TotalProductosVendidos
                .FromSqlRaw("SELECT * FROM vw_total_productos_vendidos")
                .ToListAsync();

            return productos;
        }

        public async Task<List<VentasUltimaSemanaView>> GetVentasUltimaSemana()
        {
            var ventas = await _context.VentasUltimaSemanas
                .FromSqlRaw("SELECT * FROM vw_ventas_ultima_semana")
                .ToListAsync();

            return ventas;
        }
    }
}
