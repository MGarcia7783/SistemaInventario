using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pos.Dto.Dtos
{
    public class ProductosMasVendidosDTO
    {
        public int IdProducto { get; set; }
        public string Producto { get; set; } = string.Empty;
        public int CantidadVendida { get; set; }
    }
}
