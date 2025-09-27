using Pos.Model.Vistas;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pos.Service.Interface
{
    public interface IDashboard_Service
    {
        Task<List<ProductosMasVendidosView>> GetProductosMasVendidos();
        Task<List<ProductosPorAgotarView>> GetProductosPorAgotar();
        Task<List<VentasUltimaSemanaView>> GetVentasUltimaSemana();
        Task<List<TotalProductosVendidosView>> GetTotalProductosVendidos();
        Task<List<IngresosUltimaSemanaView>> GetIngresosUltimaSemana();
    }
}
