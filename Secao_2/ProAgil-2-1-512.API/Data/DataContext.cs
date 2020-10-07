using Microsoft.EntityFrameworkCore;
using ProAgil_2_1_512.API.Models;

namespace ProAgil_2_1_512.API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options){}

        public DbSet<Evento> Eventos{ get; set; }
    }
}