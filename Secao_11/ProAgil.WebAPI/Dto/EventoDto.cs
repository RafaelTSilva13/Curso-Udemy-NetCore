using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ProAgil.WebAPI.Dto
{
    public class EventoDto
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100, MinimumLength=3)]
        public string Local { get; set; }

        public string DataEvento { get; set; }

        [Required]
        public string Tema { get; set; }

        [Range(2, 120000)]
        public int QtdPessoas { get; set; }

        public string ImagemURL { get; set; }

        [Phone]
        public string Telefone { get; set; }

        [EmailAddress]
        public string Email { get; set; }

        public List<LoteDto> Lotes { get; set; }

        public List<RedeSocialDto> RedeSociais { get; set; }

        public List<PalestranteDto> Palestrantes { get; set; }
    }
}