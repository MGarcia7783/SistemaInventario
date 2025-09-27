using Microsoft.EntityFrameworkCore;
using Pos.Model.Context;
using Pos.Model.Models;
using Pos.Repository.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pos.Repository.Repository
{
    public class Rol_Repository : IRepository<Rol>
    {
        private readonly PosContext _posContext;

        public Rol_Repository( PosContext posContext )
        {
            _posContext = posContext;
        }

        public async Task<Rol> Create(Rol entity)
        {
            if( entity == null )
            {
                throw new ArgumentNullException(nameof(entity));
            }

            _posContext.Roles.Add(entity);
            await _posContext.SaveChangesAsync();
            return entity;
        }

        public async Task<bool> Delete(int id)
        {
            var rol = await _posContext.Roles.FindAsync(id);
            if(rol == null)
            {
                return false;
            }

            _posContext.Roles.Remove(rol);
            await _posContext.SaveChangesAsync();
            return true;
        }

        public async Task<List<Rol>> GetAll()
        {
            return await _posContext.Roles.ToListAsync();
        }

        public async Task<Rol?> GetById(int id)
        {
            return await _posContext.Roles.FindAsync(id);
        }

        public async Task<Rol> Update(Rol entity)
        {
            if(entity == null)
            {
                throw new ArgumentNullException(nameof(entity));
            }

            var rolExistente = await _posContext.Roles.FirstOrDefaultAsync(r => r.idRol == entity.idRol);
            if(rolExistente == null)
            {
                throw new KeyNotFoundException($"No se encontró el rol con el ID: {entity.idRol}");
            }

            rolExistente.descripcion = entity.descripcion;
            rolExistente.estado = entity.estado;

            _posContext.Roles.Update(rolExistente);
            await _posContext.SaveChangesAsync();
            return rolExistente;
        }
    }
}
