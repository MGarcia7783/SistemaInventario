using FluentValidation;
using Pos.Dto.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pos.Dto.Validators
{
    public class ValidarNegocioDto : AbstractValidator<NegocioDto>
    {
        public ValidarNegocioDto()
        {
            RuleFor(n => n.ruc)
                .NotEmpty().WithMessage("Es necesario especificar el número ruc de la empresa.")
                .MaximumLength(20).WithMessage("El número ruc no dede de superar los 20 caracteres.");

            RuleFor(n => n.razonSocial)
                .NotEmpty().WithMessage("Es necesario especificar el nombre de la empresa.")
                .MaximumLength(50).WithMessage("El nombre de la empresa no dede de superar los 50 caracteres.");

            RuleFor(n => n.email)
                .NotEmpty().WithMessage("Es necesario especificar el email de la empresa.")
                .MaximumLength(50).WithMessage("El email no dede de superar los 50 caracteres.");

            RuleFor(n => n.telefono)
                .NotEmpty().WithMessage("Es necesario especificar el número de teléfono.")
                .MinimumLength(8).WithMessage("El número de teléfono debe contener al menos 8 caracteres.")
                .MaximumLength(15).WithMessage("El número de teléfono no debe superar los 15 caracteres.");

            RuleFor(n => n.direccion)
                .NotEmpty().WithMessage("Es necesario especificar la dirección de la empresa.")
                .MaximumLength(500).WithMessage("La dirección no debe superar los 500 caracteres.");

            RuleFor(n => n.propietario)
                .NotEmpty().WithMessage("Es necesario especificar el propietario de la empresa.")
                .MinimumLength(3).WithMessage("El nombre del propietario debe contener al menos 3 caracteres.")
                .MaximumLength(50).WithMessage("El nombre del propietario no debe superar los 50 caracteres.");

            RuleFor(n => n.descuento)
                .NotEmpty().WithMessage("Es necesario especificar el descuento.")
                .GreaterThanOrEqualTo(0).WithMessage("El descuento no puede ser menor a cero.");
        }
    }
}
