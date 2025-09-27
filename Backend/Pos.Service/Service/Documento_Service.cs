using Pos.Model.Models;
using Pos.Repository.Interface;
using Pos.Service.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pos.Service.Service
{
    public class Documento_Service : IDocumento_Service
    {
        private readonly IDocumento_Repository _documentoRepository;

        public Documento_Service(IDocumento_Repository documentoRepository)
        {
            _documentoRepository = documentoRepository;
        }

        public async Task<NumeroDocumento?> Get()
        {
           var entidad = await _documentoRepository.Get();
            if(entidad == null)
            {
                return null;
            }
            return entidad;
        }

        public async Task<NumeroDocumento> Save(NumeroDocumento documento)
        {
            var entidadExistente = await _documentoRepository.Get();
            if(entidadExistente == null)
            {
                var entidadCreada = await _documentoRepository.Create(documento);
                return entidadCreada;
            }
            else
            {
                documento.idNumeroDocumento = entidadExistente.idNumeroDocumento;
                var entidadActualizada = await _documentoRepository.Update(documento);
                return entidadActualizada;
            }

        }
    }
}
