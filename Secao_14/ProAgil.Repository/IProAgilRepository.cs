using System.Threading.Tasks;
using ProAgil.Domain;

namespace ProAgil.Repository
{
    public interface IProAgilRepository
    {
        //GERAL
        void Add<T>(T entity) where T : class;

        void Update<T>(T entity) where T : class;

        void Delete<T>(T entity) where T : class;

        void DeleteRange<T>(T[] entityArray) where T : class;

        Task<bool> SaveChangesAsync();

        // EVENTOS
        
        Task<Evento> GetEventoByIdAsync(int eventoId, bool includePalestrantes = false);

        Task<Evento[]> GetAllEventoAsync(bool includePalestrantes = false);

        Task<Evento[]> GetAllEventoByTemaAsync(string tema, bool includePalestrantes = false);


        // PALESTRANTES

        Task<Palestrante> GetPalestranteByIdAsync(int palestranteId, bool includeEventos = false);

        Task<Palestrante[]> GetAllPalestranteAsync(bool includeEventos = false);

        Task<Palestrante[]> GetAllPalestranteByNomeAsync(string nome, bool includeEventos = false);
    }
}