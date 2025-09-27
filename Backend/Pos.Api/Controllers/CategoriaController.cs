using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using Pos.Dto.Dtos;
using Pos.Model.Models;
using Pos.Service.Service;

namespace Pos.Api.Controllers
{
    [Route("api/categorias")]
    [ApiController]
    public class CategoriaController : ControllerBase
    {
        private readonly Categoria_Service _categoriaService;
        private readonly IMapper _mapper;

        public CategoriaController(Categoria_Service categoriaService, IMapper mapper)
        {
            _categoriaService = categoriaService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoriaDto>>> GetAll()
        {
            try
            {
                var entidad = await _categoriaService.GetAll();
                var entidadDto = _mapper.Map<List<CategoriaDto>>(entidad);
                return Ok(entidadDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al obtener el listado de registros.", ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CategoriaDto>> GetById(int id)
        {
            try
            {
                var entidad = await _categoriaService.GetById(id);
                if (entidad == null)
                {
                    return NotFound(new { statusCode = 404, message = "Registro no encontrado." });
                }
                return Ok(_mapper.Map<CategoriaDto>(entidad));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { statusCode = 500, message = "Error al obtener el registro.", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CategoriaDto categoriaDto)
        {
            try
            {
                var entidad = _mapper.Map<Categoria>(categoriaDto);
                var entidadCreada = await _categoriaService.Create(entidad);
                return Ok(new { statusCode = 200, message = "Registro creado con éxito.", data = _mapper.Map<CategoriaDto>(entidadCreada) });
            }
            catch (DbUpdateException ex)
            {
                if (ex.InnerException is PostgresException pgEx && pgEx.SqlState == "23505")
                {
                    return BadRequest(new { statusCode = 400, message = "Ya existe un registro con la misma descripción. Inténtelo de nuevo." });
                }
                return StatusCode(500, new { statusCode = 500, message = "Error al crear el registro.", error = ex.InnerException?.Message ?? ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { statusCode = 500, message = "Error al crear el registro.", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CategoriaDto categoriaDto)
        {
            try
            {
                if (id != categoriaDto.idCategoria)
                {
                    return BadRequest(new { statusCode = 400, messsage = "El ID del registro no coincide." });
                }

                var entidad = _mapper.Map<Categoria>(categoriaDto);
                var entidadActualizada = await _categoriaService.Update(entidad);
                return Ok(new { statusCode = 200, message = "Registro actualizado con éxito.", data = _mapper.Map<CategoriaDto>(entidadActualizada) });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { statusCode = 404, message = ex.Message });
            }
            catch (DbUpdateException ex)
            {
                if (ex.InnerException is PostgresException pgEx && pgEx.SqlState == "23505")
                {
                    return BadRequest(new { statusCode = 400, message = "Ya existe un registro con la misma descripción. Inténtelo de nuevo." });
                }
                return StatusCode(500, new { statusCode = 500, message = "Error al actualizar el registro.", error = ex.InnerException?.Message ?? ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { statusCode = 500, message = "Error al actualizar el registro.", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var resultado = await _categoriaService.Delete(id);
                if (!resultado)
                {
                    return NotFound(new { statusCode = 404, message = "Registro no encontrado." });
                }
                return Ok(new { statusCode = 200, message = "Registro eliminado satisfactoriamente." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { statusCode = 500, message = "Error al eliminar el registro.", error = ex.Message });
            }
        }
    }
}
