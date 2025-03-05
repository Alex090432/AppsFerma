using CadFermaHub.MicroserviceServer;
using Grpc.Core;
using Grpc.Net.Client;

namespace AppsFerma.Server.WorkWithHub
{
    public interface IHubConnection
    {
        public Task<List<Microservice>> GetMicroservices();
    }
    public class HubConnection: IHubConnection
    {
        string StringConnection { get; } = "https://localhost:7047";

        public async Task<List<Microservice>> GetMicroservices()
        {
            GetMicroserviceResponse response = new();
            try
            {
                using var channel = GrpcChannel.ForAddress(StringConnection);
                var client = new ApiService.ApiServiceClient(channel);
                response = await client.GetMicroservicesAsync(new Google.Protobuf.WellKnownTypes.Empty());
            }
            catch (RpcException rpcEx)
            {
                Console.WriteLine($"Ошибка подключения к эндпоинту {StringConnection}: {rpcEx.Message}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Неизвестная ошибка при подключении к эндпоинту {StringConnection}: {ex.Message}");
            }
            return response.Microservices.ToList();
        }
    }
}
