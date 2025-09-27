using Pos.Model.Vistas;
using Pos.Repository.Interface;
using Pos.Service.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pos.Service.Service
{
    public class Dashboard_Service : IDashboard_Service
    {
        private readonly IDashboard_Repository _repository;

        public Dashboard_Service(IDashboard_Repository repository)
        {
            _repository = repository;
        }

        public async Task<List<IngresosUltimaSemanaView>> GetIngresosUltimaSemana()
        {
            return await _repository.GetIngresosUltimaSemana();
        }

        public async Task<List<ProductosMasVendidosView>> GetProductosMasVendidos()
        {
            return await _repository.GetProductosMasVendidos();
        }

        public async Task<List<ProductosPorAgotarView>> GetProductosPorAgotar()
        {
            return await _repository.GetProductosPorAgotar();
        }

        public async Task<List<TotalProductosVendidosView>> GetTotalProductosVendidos()
        {
            return await _repository.GetTotalProductosVendidos();
        }

        public async Task<List<VentasUltimaSemanaView>> GetVentasUltimaSemana()
        {
            return await _repository.GetVentasUltimaSemana();
        }
    }
}
