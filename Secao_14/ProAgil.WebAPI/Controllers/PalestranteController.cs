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
    public class PalestranteController : ControllerBase
    {
        public IProAgilRepository IProAgilRepository { get; }

        public PalestranteController(IProAgilRepository iProAgilRepository)
        {
            this.IProAgilRepository = iProAgilRepository;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var result = await this.IProAgilRepository.GetAllPalestranteAsync(true);
                return Ok(result);
            }
            catch (Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados Falhou");
            }
        }

        [HttpGet("{palestranteId}")]
        public async Task<IActionResult> Get(int palestranteId)
        {
            try
            {
                var result = await this.IProAgilRepository.GetPalestranteByIdAsync(palestranteId, true);
                return Ok(result);
            }
            catch (Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados Falhou");
            }
        }

        [HttpGet("getByNome/{nome}")]
        public async Task<IActionResult> Get(string nome)
        {
            try
            {
                var result = await this.IProAgilRepository.GetAllPalestranteByNomeAsync(nome, true);
                return Ok(result);
            }
            catch (Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados Falhou");
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post(Palestrante model)
        {
            try
            {
                this.IProAgilRepository.Add(model);

                if(await this.IProAgilRepository.SaveChangesAsync())
                {
                    return Created($"/api/palestrante/{model.Id}", model);
                }

                return BadRequest();
            }
            catch (Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados Falhou");
            }
        }

        [HttpPut]
        public async Task<IActionResult> Put(int palestranteId, Palestrante model)
        {
            try
            {
                Palestrante palestrante = await this.IProAgilRepository.GetPalestranteByIdAsync(palestranteId);
                if(palestrante == null)
                {
                    return NotFound();
                }

                this.IProAgilRepository.Update(model);

                if(await this.IProAgilRepository.SaveChangesAsync())
                {
                    return Created($"/api/palestrante/{model.Id}", model);
                }

                return BadRequest();
            }
            catch (Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados Falhou");
            }
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int palestranteId)
        {
            try
            {
                Palestrante palestrante = await this.IProAgilRepository.GetPalestranteByIdAsync(palestranteId);
                if(palestrante == null)
                {
                    return NotFound();
                }

                this.IProAgilRepository.Delete(palestrante);

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