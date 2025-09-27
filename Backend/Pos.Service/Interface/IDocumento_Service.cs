using Pos.Model.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pos.Service.Interface
{
    public interface IDocumento_Service
    {
        Task<NumeroDocumento?> Get();
        Task<NumeroDocumento> Save(NumeroDocumento documento);
    }
}
