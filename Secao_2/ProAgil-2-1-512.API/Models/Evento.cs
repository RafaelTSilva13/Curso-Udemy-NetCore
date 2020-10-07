namespace ProAgil_2_1_512.API.Models
{
    public class Evento
    {
        public int EventoID { get; set; }

        public string Local { get; set; }

        public string DataEvento { get; set; }

        public string Tema { get; set; }

        public int QtdPessoas { get; set; }

        public string Lote { get; set; }

        public string ImagemURL { get; set; }
    }
}