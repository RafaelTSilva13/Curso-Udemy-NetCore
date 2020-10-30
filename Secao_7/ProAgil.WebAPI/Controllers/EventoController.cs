using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProAgil.Domain;
using ProAgil.Repository;

namespace ProAgil.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventoController : ControllerBase
    {
        public IProAgilRepository IProAgilRepository { get; }

        public EventoController(IProAgilRepository iProAgilRepository)
        {
            this.IProAgilRepository = iProAgilRepository;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var result = await this.IProAgilRepository.GetAllEventoAsync(true);
                return Ok(result);
            }
            catch (Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados Falhou");
            }
        }

        [HttpGet("{eventoId}")]
        public async Task<IActionResult> Get(int eventoId)
        {
            try
            {
                var result = await this.IProAgilRepository.GetEventoByIdAsync(eventoId, true);
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
                var result = await this.IProAgilRepository.GetAllEventoByTemaAsync(tema, true);
                return Ok(result);
            }
            catch (Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados Falhou");
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post(Evento model)
        {
            try
            {
                this.IProAgilRepository.Add(model);

                if(await this.IProAgilRepository.SaveChangesAsync())
                {
                    return Created($"/api/evento/{model.Id}", model);
                }

                return BadRequest();
            }
            catch (Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados Falhou");
            }
        }

        [HttpPut("{eventoId}")]
        public async Task<IActionResult> Put(int eventoId, Evento model)
        {
            try
            {
                Evento evento = await this.IProAgilRepository.GetEventoByIdAsync(eventoId);
                if(evento == null)
                {
                    return NotFound();
                }

                this.IProAgilRepository.Update(model);

                if(await this.IProAgilRepository.SaveChangesAsync())
                {
                    return Created($"/api/evento/{model.Id}", model);
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
                if(evento == null)
                {
                    return NotFound();
                }

                this.IProAgilRepository.Delete(evento);

                if(await this.IProAgilRepository.SaveChangesAsync())
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