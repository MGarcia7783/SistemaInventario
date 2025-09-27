using Npgsql.EntityFrameworkCore.PostgreSQL.Query.Expressions.Internal;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pos.Model.Models
{
    public class NumeroDocumento
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int idNumeroDocumento { get; set; }
        public string documento { get; set; } = string.Empty;
        public DateTime fechaRegistro { get; private set; }
    }
}
