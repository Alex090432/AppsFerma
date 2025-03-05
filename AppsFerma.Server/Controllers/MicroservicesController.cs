using Microsoft.AspNetCore.Mvc;
using CadFermaHub.MicroserviceServer;
using AppsFerma.Server.WorkWithHub;
using System.Text.Json;

namespace AppsFerma.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MicroservicesController : ControllerBase
    {
        private readonly IHubConnection _hubConnection;

        public MicroservicesController(IHubConnection hubConnection)
        {
            _hubConnection = hubConnection;
        }

        [HttpGet("services")]
        public async Task<ActionResult<IEnumerable<Microservice>>> GetServices()
        {
            try
            {
                var services = await _hubConnection.GetMicroservices();
                return Ok(services);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Внутренняя ошибка сервера: {ex.Message}");
            }
        }

        [HttpPost("services")]
        public async Task<ActionResult> SetService([FromBody] JsonElement jsonData)
        {
            try
            {          
                await _hubConnection.AddMicroservice(FromJSONToMicroservice(jsonData));
                return Ok();
            }
            catch (Exception ex)
            {
                // Логируем полную информацию об ошибке
                Console.WriteLine($"Error details: {ex}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return StatusCode(500, $"Внутренняя ошибка сервера: {ex.Message}\nStack trace: {ex.StackTrace}");
            }
        }

        [HttpPatch("services/{id}")]
        public async Task<ActionResult<Microservice>> UpdateService(string id, [FromBody] JsonElement jsonData)
        {
            try
            {
                var microservice = FromJSONToMicroservice(jsonData);
                
                // Проверяем, совпадает ли ID в URL с ID в теле запроса
                if (microservice.Id != id)
                {
                    return BadRequest("ID в URL не совпадает с ID в теле запроса");
                }

                await _hubConnection.UpdateMicroservice(microservice);
                return Ok(microservice);
            }
            catch (Exception ex)
            {
                // Логируем ошибку
                Console.WriteLine($"Error updating service {id}: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return StatusCode(500, $"Внутренняя ошибка сервера при обновлении сервиса: {ex.Message}");
            }
        }

        [HttpDelete("services/{id}")]
        public async Task<ActionResult> DeleteService(string id)
        {
            try
            {
                await _hubConnection.DeleteMicroservice(id);
                return Ok();
            }
            catch (Exception ex)
            {
                // Логируем ошибку
                Console.WriteLine($"Error deleting service {id}: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return StatusCode(500, $"Внутренняя ошибка сервера при удалении сервиса: {ex.Message}");
            }
        }

        private Microservice FromJSONToMicroservice(JsonElement jsonData)
        {
            var id = jsonData.GetProperty("id").GetString();
            var name = jsonData.GetProperty("name").GetString();

            var httpMethodsArray = jsonData.GetProperty("http_methods").EnumerateArray();

            var httpMethods = httpMethodsArray
                .Select(x => x.GetString() switch
                {
                    "GET" => CadFermaHub.MicroserviceServer.HttpMethod.Get,
                    "POST" => CadFermaHub.MicroserviceServer.HttpMethod.Post,
                    "PUT" => CadFermaHub.MicroserviceServer.HttpMethod.Put,
                    "DELETE" => CadFermaHub.MicroserviceServer.HttpMethod.Delete,
                    "PATCH" => CadFermaHub.MicroserviceServer.HttpMethod.Patch,
                    _ => CadFermaHub.MicroserviceServer.HttpMethod.Unspecified
                })
                .ToList();

            var endpoints = jsonData.GetProperty("endpoints").EnumerateArray()
                .Select(x => x.GetString())
                .ToList();

            var inputTypeStr = jsonData.GetProperty("input_type").GetString();
            var typeResultStr = jsonData.GetProperty("type_result").GetString();

            var inputType = inputTypeStr switch
            {
                "FILES" => CadFermaHub.MicroserviceServer.DataType.Files,
                "TABLE" => CadFermaHub.MicroserviceServer.DataType.Table,
                "TEXT" => CadFermaHub.MicroserviceServer.DataType.Text,
                _ => CadFermaHub.MicroserviceServer.DataType.TypeResultUnspecified
            };

            var typeResult = typeResultStr switch
            {
                "FILES" => CadFermaHub.MicroserviceServer.DataType.Files,
                "TABLE" => CadFermaHub.MicroserviceServer.DataType.Table,
                "TEXT" => CadFermaHub.MicroserviceServer.DataType.Text,
                _ => CadFermaHub.MicroserviceServer.DataType.TypeResultUnspecified
            };

            var author = jsonData.GetProperty("author").GetString();
            var parameters = jsonData.GetProperty("params").GetString();
            var description = jsonData.GetProperty("description").GetString();
            var notes = jsonData.GetProperty("notes").GetString();

            var microservice = new Microservice()
            {
                Id = id,
                Name = name,
                HttpMethods = { httpMethods },
                Endpoints = { endpoints },
                InputType = inputType,
                TypeResult = typeResult,
                Author = author,
                Params = parameters,
                Description = description,
                Notes = notes
            };
            return microservice;
        }
    }
} 