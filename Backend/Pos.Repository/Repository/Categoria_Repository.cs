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
    public class Categoria_Repository : IRepository<Categoria>
    {
        private readonly PosContext _posContext;

        public Categoria_Repository(PosContext posContext)
        {
            _posContext = posContext;
        }

        public async Task<Categoria> Create(Categoria entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException(nameof(entity));
            }

            _posContext.Categorias.Add(entity);
            await _posContext.SaveChangesAsync();
            return entity;
        }

        public async Task<bool> Delete(int id)
        {
            var categoria = await _posContext.Categorias.FindAsync(id);
            if (categoria == null)
            {
                return false;
            }

            _posContext.Categorias.Remove(categoria);
            await _posContext.SaveChangesAsync();
            return true;
        }

        public async Task<List<Categoria>> GetAll()
        {
            return await _posContext.Categorias.ToListAsync();
        }

        public async Task<Categoria?> GetById(int id)
        {
            return await _posContext.Categorias.FindAsync(id);
        }

        public async Task<Categoria> Update(Categoria entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException(nameof(entity));
            }

            var categoriaExistente = await _posContext.Categorias.FirstOrDefaultAsync(r => r.idCategoria == entity.idCategoria);
            if (categoriaExistente == null)
            {
                throw new KeyNotFoundException($"No se encontró la categoria con el ID: {entity.idCategoria}");
            }

            categoriaExistente.descripcion = entity.descripcion;
            categoriaExistente.estado = entity.estado;

            _posContext.Categorias.Update(categoriaExistente);
            await _posContext.SaveChangesAsync();
            return categoriaExistente;
        }
    }
}
