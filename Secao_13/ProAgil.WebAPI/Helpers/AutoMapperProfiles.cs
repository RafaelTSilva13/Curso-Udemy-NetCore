using System.Linq;
using AutoMapper;
using ProAgil.Domain;
using ProAgil.Domain.Identity;
using ProAgil.WebAPI.Dto;

namespace ProAgil.WebAPI.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<Evento, EventoDto>()
            .ForMember(dto => dto.Palestrantes, opt =>{
                opt.MapFrom(e => e.PalestranteEventos.Select(x => x.Palestrante).ToList());
            })
            .ReverseMap();
            CreateMap<Palestrante, PalestranteDto>()
            .ForMember(dto => dto.Eventos, opt => {
                opt.MapFrom(p => p.PalestranteEventos.Select(x => x.Evento).ToList());
            })
            .ReverseMap();
            CreateMap<Lote, LoteDto>().ReverseMap();
            CreateMap<RedeSocial, RedeSocialDto>().ReverseMap();
            CreateMap<User, UserDto>().ReverseMap();
            CreateMap<User, UserLoginDto>().ReverseMap();
        }
    }
}