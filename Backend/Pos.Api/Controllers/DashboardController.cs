using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Pos.Dto.Dtos;
using Pos.Service.Interface;

namespace Pos.Api.Controllers
{
    [Route("api/dashboard")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboard_Service _service;
        private readonly IMapper _mapper;

        public DashboardController(IDashboard_Service service, IMapper mapper)
        {
            _service = service;
            _mapper = mapper;
        }

        [HttpGet("productos_mas_vendidos")]
        public async Task<ActionResult<List<ProductosMasVendidosDTO>>> GetProductosMasVendidos()
        {
            try
            {
                var productos = await _service.GetProductosMasVendidos();
                var productosDTO = _mapper.Map<List<ProductosMasVendidosDTO>>(productos);
                return Ok(productosDTO);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al obtener los productos más vendidos.", error = ex.Message });
            }
        }

        [HttpGet("productos_por_agotar")]
        public async Task<ActionResult<List<ProductosPorAgotarDTO>>> GetProductosPorAgotar()
        {
            try
            {
                var productos = await _service.GetProductosPorAgotar();
                var productosDTO = _mapper.Map<List<ProductosPorAgotarDTO>>(productos);
                return Ok(productosDTO);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al obtener los productos por agotar.", error = ex.Message });
            }
        }

        [HttpGet("ventas_ultima_semana")]
        public async Task<ActionResult<List<VentasUltimaSemanaDTO>>> GetVentasUltimaSemana()
        {
            try
            {
                var ventas = await _service.GetVentasUltimaSemana();
                var ventasDTO = _mapper.Map<List<VentasUltimaSemanaDTO>>(ventas);
                return Ok(ventasDTO);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al obtener las ventas de la última semana.", error = ex.Message });
            }
        }

        [HttpGet("total_productos_vendidos")]
        public async Task<ActionResult<List<TotalProductosVendidosDTO>>> GetTotalProductosVendidos()
        {
            try
            {
                var productos = await _service.GetTotalProductosVendidos();
                var productosDTO = _mapper.Map<List<TotalProductosVendidosDTO>>(productos);
                return Ok(productosDTO);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al obtener los productos vendidos.", error = ex.Message });
            }
        }

        [HttpGet("ingresos_ultima_semana")]
        public async Task<ActionResult<List<IngresosUltimaSemanaDTO>>> GetIngresosUltimaSemana()
        {
            try
            {
                var ventas = await _service.GetIngresosUltimaSemana();
                var ventasDTO = _mapper.Map<List<IngresosUltimaSemanaDTO>>(ventas);
                return Ok(ventasDTO);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al obtener los ingresos de la última semana", error = ex.Message });
            }
        }
    }
}
