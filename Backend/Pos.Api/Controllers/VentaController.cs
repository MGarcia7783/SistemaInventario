using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using Pos.Dto.Dtos;
using Pos.Model.Models;
using Pos.Service.Interface;
using Pos.Service.Service;

namespace Pos.Api.Controllers
{
    [Route("api/ventas")]
    [ApiController]
    public class VentaController : ControllerBase
    {
        private readonly IVenta_Service _ventaService;
        private readonly IMapper _mapper;

        public VentaController(IVenta_Service ventaService, IMapper mapper)
        {
            _ventaService = ventaService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<VentaDto>>> GetAll()
        {
            try
            {
                var entidad = await _ventaService.GetAll();
                var entidadDto = _mapper.Map<List<VentaDto>>(entidad);
                return Ok(entidadDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al obtener el listado de registros.", ex.Message });
            }
        }

        [HttpGet("buscar-fecha")]
        public async Task<ActionResult<IEnumerable<VentaDto>>> BuscarPorFecha([FromQuery] DateOnly FechaInicio, [FromQuery] DateOnly FechaFin)
        {
            try
            {
                var entidad = await _ventaService.BuscarFecha(FechaInicio, FechaFin);
                if(entidad.Count == 0)
                {
                    return NotFound(new { statusCode = 404, message = "No existe ningún registro para la consulta solicitada." });
                }
                var entidadDto = _mapper.Map<List<VentaDto>>(entidad);
                return Ok(entidadDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al buscar por fechas.", ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] VentaDto ventaDto)
        {
            if(!ModelState.IsValid)
            {
                var errores = ModelState.Values.SelectMany(e => e.Errors)
                                               .Select(e => e.ErrorMessage)
                                               .ToList();

                return BadRequest(new { statusCode = 400, message = "Los datos proporcionados son inválidos.", errors = errores ?? new List<string>()});
            }

            try
            {
                var entidad = _mapper.Map<Venta>(ventaDto);
                var entidadCreada = await _ventaService.Create(entidad);
                return Ok(new { statusCode = 200, message = "Registro creado con éxito.", data = _mapper.Map<VentaDto>(entidadCreada) });
            }

            catch (InvalidOperationException ex)
            {
                return BadRequest(new { StatusCode = 400, message = ex.Message });
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, new { statusCode = 500, message = "Error al crear el registro.", error = ex.InnerException?.Message ?? ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { statusCode = 500, message = "Error al crear el registro.", error = ex.Message });
            }
        }

        [HttpPut("{idVenta}/anular")]
        public async Task<IActionResult> AnularVenta(int idVenta, [FromBody] AnularVentaDto anularVentaDto)
        {
            if(string.IsNullOrWhiteSpace(anularVentaDto.motivo) || anularVentaDto.idUsuario <= 0)
            {
                return BadRequest(new { statusCode = 400, messsage = "El ID del usuario y el motivo son obligatorios para anular la venta." });
            }

            try
            {
                var ventaAnulada = await _ventaService.AnularVenta(idVenta, anularVentaDto.motivo, anularVentaDto.idUsuario);
                if(ventaAnulada == null)
                {
                    return NotFound(new { statusCode = 404, message = "Venta no encontrada." });
                }

                return Ok(new { statusCode = 200, message = "Venta anulada con éxito.", data = _mapper.Map<VentaDto>(ventaAnulada) });
            }

            catch (Exception ex)
            {
                return StatusCode(500, new { statusCode = 500, message = "Error al anular el registro.", error = ex.Message });
            }
        }

        public class AnularVentaDto
        {
            public string motivo { get; set; } = string.Empty;
            public int idUsuario { get; set; }
        }

        [HttpGet("{idVenta}/detalles")]
        public async Task<ActionResult<IEnumerable<DetalleVentaDto>>> GetDetallesByIdVenta(int idVenta)
        {
            try
            {
                var entidad = await _ventaService.GetDatellesByIdVenta(idVenta);
                if (entidad.Count == 0 || entidad == null)
                {
                    return NotFound(new { statusCode = 404, message = "No se encontraron detalles para la venta especificada." });
                }

                var entidadDto = _mapper.Map<List<DetalleVentaDto>>(entidad);
                return Ok(entidadDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al obtener los detalles de venta.", ex.Message });
            }
        }
    }
}
