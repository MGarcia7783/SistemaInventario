using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using Pos.Dto.Dtos;
using Pos.Dto.Validators;
using Pos.Model.Models;
using Pos.Service.Interface;
using Pos.Service.Service;

namespace Pos.Api.Controllers
{
    [Route("api/usuarios")]
    [ApiController]
    public class UsuarioController : ControllerBase
    {
        private readonly IUsuario_Service _usuarioService;
        private readonly IMapper _mapper;

        public UsuarioController(IUsuario_Service usuarioService, IMapper mapper)
        {
            _usuarioService = usuarioService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UsuarioDto>>> GetAll()
        {
            try
            {
                var entidad = await _usuarioService.GetAll();
                var entidadDto = _mapper.Map<List<UsuarioDto>>(entidad);
                return Ok(entidadDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al obtener el listado de registros.", ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UsuarioDto>> GetById(int id)
        {
            try
            {
                var entidad = await _usuarioService.GetById(id);
                if (entidad == null)
                {
                    return NotFound(new { statusCode = 404, message = "Registro no encontrado." });
                }
                return Ok(_mapper.Map<UsuarioDto>(entidad));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { statusCode = 500, message = "Error al obtener el registro.", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] UsuarioDto usuarioDto)
        {
            var validator = new ValidarUsuarioDto();
            var validationResult = await validator.ValidateAsync(usuarioDto);

            if(!validationResult.IsValid)
            {
                var errores = validationResult.Errors.Select(e => e.ErrorMessage).ToList();
                return BadRequest(new { statusCode = 400, message = errores });
            }

            try
            {
                var entidad = _mapper.Map<Usuario>(usuarioDto);
                var entidadCreada = await _usuarioService.Create(entidad, usuarioDto.clave);
                return Ok(new { statusCode = 200, message = "Registro creado con éxito.", data = _mapper.Map<UsuarioDto>(entidadCreada) });
            }
            catch (DbUpdateException ex)
            {
                if (ex.InnerException is PostgresException pgEx && pgEx.SqlState == "23505")
                {

                    string campoDuplicado = "un valor único";

                    if (!string.IsNullOrEmpty(pgEx.ConstraintName))
                    {
                        if (pgEx.ConstraintName.Contains("IX_Productos_UserName"))
                            campoDuplicado = "el correo electrónico";
                        else if (pgEx.ConstraintName.Contains("IX_Usuarios_telefono"))
                            campoDuplicado = "el teléfono";
                    }

                    return BadRequest(new { statusCode = 400, message = $"Ya existe un registro con {campoDuplicado} ingresado. Inténtelo de nuevo." });
                }
                return StatusCode(500, new { statusCode = 500, message = "Error al crear el registro.", error = ex.InnerException?.Message ?? ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { statusCode = 500, message = "Error al crear el registro.", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UsuarioDto usuarioDto)
        {
            if (!ModelState.IsValid)
            {
                var errores = ModelState.Values.SelectMany(p => p.Errors)
                                               .Select(e => e.ErrorMessage)
                                               .ToList();

                return BadRequest(new { statusCode = 400, message = "Los datos proporcionados son inválidos.", errores = errores ?? new List<string>() });
            }

            try
            {
                var entidad = _mapper.Map<Usuario>(usuarioDto);
                var entidadCreada = await _usuarioService.Update(entidad, usuarioDto.clave);
                return Ok(new { statusCode = 200, message = "Registro actualizado con éxito.", data = _mapper.Map<UsuarioDto>(entidadCreada) });
            }
            catch (DbUpdateException ex)
            {
                if (ex.InnerException is PostgresException pgEx && pgEx.SqlState == "23505")
                {

                    string campoDuplicado = "un valor único";

                    if (!string.IsNullOrEmpty(pgEx.ConstraintName))
                    {
                        if (pgEx.ConstraintName.Contains("IX_Productos_UserName"))
                            campoDuplicado = "el correo electrónico";
                        else if (pgEx.ConstraintName.Contains("IX_Usuarios_telefono"))
                            campoDuplicado = "el teléfono";
                    }

                    return BadRequest(new { statusCode = 400, message = $"Ya existe un registro con {campoDuplicado} ingresado. Inténtelo de nuevo." });
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
                var resultado = await _usuarioService.Delete(id);
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

        [HttpGet("rol/{id}")]
        public async Task<IActionResult> GetByRolid(int id)
        {
            try
            {
                var entidad = await _usuarioService.GetRolById(id);
                if (string.IsNullOrEmpty(entidad))
                {
                    return NotFound("Registro no encontrado.");
                }
                return Ok(entidad);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { statusCode = 500, message = "Error al obtener el registro.", error = ex.Message });
            }
        }
    }
}
