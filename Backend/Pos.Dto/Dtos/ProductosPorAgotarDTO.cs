using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pos.Dto.Dtos
{
    public class ProductosPorAgotarDTO
    {
        public int IdProducto { get; set; }
        public string Codigo { get; set; } = string.Empty;
        public string Producto { get; set; } = string.Empty;
        public string Categoria { get; set; } = string.Empty;
        public int Stock { get; set; }
    }
}
