using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProAgil.Domain;
using ProAgil.Repository;
using ProAgil.WebAPI.Dto;

namespace ProAgil.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventoController : ControllerBase
    {
        public IProAgilRepository IProAgilRepository { get; }
        public IMapper IMapper { get; }

        public EventoController(IProAgilRepository iProAgilRepository, IMapper iMapper)
        {
            this.IMapper            = iMapper;
            this.IProAgilRepository = iProAgilRepository;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var eventos = await this.IProAgilRepository.GetAllEventoAsync(true);
                var result = this.IMapper.Map<IEnumerable<EventoDto>>(eventos);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Banco de dados Falhou {ex.Message}");
            }
        }

        [HttpGet("{eventoId}")]
        public async Task<IActionResult> Get(int eventoId)
        {
            try
            {
                var evento = await this.IProAgilRepository.GetEventoByIdAsync(eventoId, true);
                var result = this.IMapper.Map<EventoDto>(evento);
                return Ok(result);
            }
            catch (Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados Falhou");
            }
        }

        [HttpGet("getByTema/{tema}")]
        public async Task<IActionResult> Get(string tema)
        {
            try
            {
                var eventos = await this.IProAgilRepository.GetAllEventoByTemaAsync(tema, true);
                var result = this.IMapper.Map<IEnumerable<EventoDto>>(eventos);
                return Ok(result);
            }
            catch (Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados Falhou");
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post(EventoDto model)
        {
            try
            {
                var evento = this.IMapper.Map<Evento>(model);
                this.IProAgilRepository.Add(evento);

                if (await this.IProAgilRepository.SaveChangesAsync())
                {
                    return Created($"/api/evento/{evento.Id}", this.IMapper.Map<EventoDto>(evento));
                }

                return BadRequest();
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Banco de dados Falhou {ex.Message}");
            }
        }

        [HttpPut("{eventoId}")]
        public async Task<IActionResult> Put(int eventoId, EventoDto model)
        {
            try
            {
                Evento evento = await this.IProAgilRepository.GetEventoByIdAsync(eventoId);
                if (evento == null)
                {
                    return NotFound();
                }

                this.IMapper.Map(model, evento);

                this.IProAgilRepository.Update(evento);

                if (await this.IProAgilRepository.SaveChangesAsync())
                {
                    return Created($"/api/evento/{evento.Id}", this.IMapper.Map<EventoDto>(evento));
                }

                return BadRequest();
            }
            catch (Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados Falhou");
            }
        }

        [HttpDelete("{eventoId}")]
        public async Task<IActionResult> Delete(int eventoId)
        {
            try
            {
                Evento evento = await this.IProAgilRepository.GetEventoByIdAsync(eventoId);
                if (evento == null)
                {
                    return NotFound();
                }

                this.IProAgilRepository.Delete(evento);

                if (await this.IProAgilRepository.SaveChangesAsync())
                {
                    return Ok();
                }

                return BadRequest();
            }
            catch (Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados Falhou");
            }
        }
    }
}