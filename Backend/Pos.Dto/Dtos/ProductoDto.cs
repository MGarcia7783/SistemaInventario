using Pos.Model.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pos.Dto.Dtos
{
    public class ProductoDto
    {
        public int idProducto { get; set; }
        public string codigoBarra { get; set; } = string.Empty;
        public string descripcion { get; set; } = string.Empty;
        public int idCatagoria { get; set; }
        public string categoriaDescripcion { get; set; } = string.Empty;
        public decimal precioVenta { get; set; }
        public int stock { get; set; }
        public int stockMinimo { get; set; }
        public string estado { get; set; } = string.Empty;
    }
}
