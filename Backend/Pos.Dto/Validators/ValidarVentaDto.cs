using FluentValidation;
using Pos.Dto.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pos.Dto.Validators
{
    public class ValidarVentaDto : AbstractValidator<VentaDto>
    {
        public ValidarVentaDto()
        {
            RuleFor(v => v.dni)
                .NotEmpty().WithMessage("Es necesario especificar el número de identificación del cliente.")
                .MaximumLength(20).WithMessage("El número de identificación no debe de superar los 20 caracteres.");

            RuleFor(v => v.cliente)
                .NotEmpty().WithMessage("Es necesario especificar el nombre del cliente.")
                .MinimumLength(3).WithMessage("El nombre del cliente debe tener al menos 3 caracteres.")
                .MaximumLength(50).WithMessage("El nombre del cliente no debe superar los 50 caracteres.");

            RuleFor(v => v.descuento)
                .GreaterThanOrEqualTo(0).WithMessage("El descuento de la venta no puede ser menor a cero.");

            RuleFor(v => v.total)
                .GreaterThan(0).WithMessage("El total de la venta debe ser mayor a cero.");

            RuleFor(v => v.idUsuario)
                .GreaterThan(0).WithMessage("No se ha especificado el usuario que realizó la venta.");

            RuleFor(v => v.estado)
                .IsInEnum().WithMessage("El estado de la venta no es válido. Seleccione una opción de la lista desplegable.");

            RuleFor(v => v.fechaAnulada)
                .Null().When(v => v.estado == Model.Models.EstadoVenta.Activa).WithMessage("La fecha de anulación debe ser nula si el estado de la venta es: 'Activa'.")
                .NotNull().When(v => v.estado == Model.Models.EstadoVenta.Anulada).WithMessage("La fecha de anulación es requerdia si el estado de la venta es 'Anulada'.")
                .LessThanOrEqualTo(DateOnly.FromDateTime(DateTime.Now)).When(v => v.fechaAnulada.HasValue).WithMessage("La fecha de anulación no puede ser mayor a la fecha actual.");

            RuleFor(v => v.motivo)
                .NotEmpty().When(v => v.estado == Model.Models.EstadoVenta.Anulada).WithMessage("El motivo de anulación de la venta es requerido cuando la venta es: 'Anulada'.");

            RuleFor(v => v.usuarioAnula)
                .NotEmpty().When(v => v.estado == Model.Models.EstadoVenta.Anulada).WithMessage("El usuario que anula la venta es requerido si el estado de la venta es: 'Anulada'.");
        }
    }
}
