using Microsoft.AspNetCore.Mvc;
using AppsFerma.Server.Services;
using CadFermaHub.MicroserviceServer;

namespace AppsFerma.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MicroservicesController : ControllerBase
    {
        private readonly IMicroservicesService _microservicesService;

        public MicroservicesController(IMicroservicesService microservicesService)
        {
            _microservicesService = microservicesService;
        }

        [HttpGet("services")]
        public async Task<ActionResult<IEnumerable<Microservice>>> GetServices()
        {
            try
            {
                var services = await _microservicesService.GetMicroservicesAsync();
                return Ok(services);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Внутренняя ошибка сервера: {ex.Message}");
            }
        }
    }
} 