using System.ComponentModel.DataAnnotations;

namespace ProAgil.WebAPI.Dto
{
    public class RedeSocialDto
    {
        public int Id { get; set; }
        
        [Required(ErrorMessage="O campo {0} é obrigatorio")]
        [StringLength(100, MinimumLength=3, ErrorMessage="O campo {0} deve ter entre 3 e 100 caracteres.")]
        public string Nome { get; set; }

        [Required]
        public string URL { get; set; }
    }
}