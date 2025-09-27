using FluentValidation;
using Pos.Dto.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pos.Dto.Validators
{
    public class ValidarCategoriaDto : AbstractValidator<CategoriaDto>
    {
        public ValidarCategoriaDto()
        {
            RuleFor(r => r.descripcion)
                .NotEmpty().WithMessage("Es necesario especificar la descripción de la categoría.")
                .MaximumLength(50).WithMessage("La descripción de la categoría no debe de superar los 50 caracteres.");

            RuleFor(r => r.estado)
                .NotEmpty().WithMessage("Es necesario especificar el estado de la categoría.")
                .MaximumLength(8).WithMessage("El estado de la categoría no debe de superar los 8 caracteres.")
                .Must(estado => estado == "Activo" || estado == "Inactivo").WithMessage("El estado debe ser 'activo' o 'Inactivo'.");
        }
    }
}
