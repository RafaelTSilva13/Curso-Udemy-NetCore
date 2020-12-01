using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ProAgil.Domain;

namespace ProAgil.Repository
{
    public class ProAgilRepository : IProAgilRepository
    {
        public ProAgilContext ProAgilContext { get; }

        public ProAgilRepository(ProAgilContext proAgilContext)
        {
            this.ProAgilContext = proAgilContext;
            this.ProAgilContext.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
        }

        //GERAL
        public void Add<T>(T entity) where T : class
        {
            this.ProAgilContext.Add(entity);
        }

        public void Update<T>(T entity) where T : class
        {
            this.ProAgilContext.Update(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            this.ProAgilContext.Remove(entity);
        }

        public void DeleteRange<T>(T[] entityArray) where T : class
        {
            this.ProAgilContext.RemoveRange(entityArray);
        }

        public async Task<bool> SaveChangesAsync()
        {
            return (await this.ProAgilContext.SaveChangesAsync()) > 0;
        }

        // EVENTOS
        public async Task<Evento> GetEventoByIdAsync(int eventoId, bool includePalestrantes = false)
        {
            IQueryable<Evento> query = this.ProAgilContext.Eventos
                .Include(e => e.Lotes)
                .Include(e => e.RedeSociais);

            if(includePalestrantes)
            {
                query = query
                    .Include(pe => pe.PalestranteEventos)
                    .ThenInclude(p => p.Palestrante);
            }

            query = query.AsNoTracking()
                    .Where(e => e.Id == eventoId);

            return await query.FirstOrDefaultAsync();
        }

        public async Task<Evento[]> GetAllEventoAsync(bool includePalestrantes = false)
        {
            IQueryable<Evento> query = this.ProAgilContext.Eventos
                .Include(e => e.Lotes)
                .Include(e => e.RedeSociais);

            if(includePalestrantes)
            {
                query = query
                    .Include(pe => pe.PalestranteEventos)
                    .ThenInclude(p => p.Palestrante);
            }

            query = query.AsNoTracking()
                        .OrderBy(e => e.Id);

            return await query.ToArrayAsync();
        }

        public async Task<Evento[]> GetAllEventoByTemaAsync(string tema, bool includePalestrantes = false)
        {
            IQueryable<Evento> query = this.ProAgilContext.Eventos
                .Include(e => e.Lotes)
                .Include(e => e.RedeSociais);

            if(includePalestrantes)
            {
                query = query
                    .Include(pe => pe.PalestranteEventos)
                    .ThenInclude(p => p.Palestrante);
            }

            query = query.AsNoTracking()
                    .OrderBy(e => e.Id)
                    .Where(e => e.Tema.ToLower().Contains(tema.ToLower()));

            return await query.ToArrayAsync();
        }


        // PALESTRANTES

        public async Task<Palestrante> GetPalestranteByIdAsync(int palestranteId, bool includeEventos = false)
        {
            IQueryable<Palestrante> query = this.ProAgilContext.Palestrantes
                .Include(p => p.RedeSociais);

            if(includeEventos)
            {
                query = query
                    .Include(pe => pe.PalestranteEventos)
                    .ThenInclude(e => e.Evento);
            }

            query = query.AsNoTracking()
                .OrderBy(p => p.Nome)
                .Where(p => p.Id == palestranteId);

            return await query.FirstOrDefaultAsync();
        }

        public async Task<Palestrante[]> GetAllPalestranteAsync(bool includeEventos = false)
        {
            IQueryable<Palestrante> query = this.ProAgilContext.Palestrantes
                .Include(p => p.RedeSociais);

            if(includeEventos)
            {
                query = query
                    .Include(pe => pe.PalestranteEventos)
                    .ThenInclude(e => e.Evento);
            }

            query = query.AsNoTracking().OrderBy(p => p.Nome);

            return await query.ToArrayAsync();
        }

        public async Task<Palestrante[]> GetAllPalestranteByNomeAsync(string nome, bool includeEventos = false)
        {
            IQueryable<Palestrante> query = this.ProAgilContext.Palestrantes
                .Include(p => p.RedeSociais);

            if(includeEventos)
            {
                query = query
                    .Include(pe => pe.PalestranteEventos)
                    .ThenInclude(e => e.Evento);
            }

            query = query.AsNoTracking()
                        .OrderBy(p => p.Nome)
                        .Where(p => p.Nome.ToLower().Contains(nome.ToLower()));

            return await query.ToArrayAsync();
        }
    }
}