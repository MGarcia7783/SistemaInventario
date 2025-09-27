using FluentValidation;
using Pos.Dto.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pos.Dto.Validators
{
    public class ValidarRolDto : AbstractValidator<RolDto>
    {
        public ValidarRolDto()
        {
            RuleFor(r => r.descripcion)
                .NotEmpty().WithMessage("Es necesario especificar la descripción del rol.")
                .MaximumLength(50).WithMessage("La descripción del rol no debe de superar los 50 caracteres.");

            RuleFor(r => r.estado)
                .NotEmpty().WithMessage("Es necesario especificar el estado del rol.")
                .MaximumLength(8).WithMessage("El estado del rol no debe de superar los 8 caracteres.")
                .Must(estado => estado == "Activo" || estado == "Inactivo").WithMessage("El estado debe ser 'activo' o 'Inactivo'.");
        }
    }
}
