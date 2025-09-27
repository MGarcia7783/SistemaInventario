using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pos.Dto.Dtos
{
    public class VentasUltimaSemanaDTO
    {
        public DateOnly Fecha { get; set; }
        public int TotalVentas { get; set; }
    }
}
