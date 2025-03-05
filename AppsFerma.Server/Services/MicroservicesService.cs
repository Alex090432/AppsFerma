using System.Collections.Concurrent;
using CadFermaHub.MicroserviceServer;

namespace AppsFerma.Server.Services
{
    public interface IMicroservicesService
    {
        Task<IEnumerable<Microservice>> GetMicroservicesAsync();
        void UpdateMicroservices(IEnumerable<Microservice> microservices);
    }

    public class MicroservicesService : IMicroservicesService
    {
        private readonly ConcurrentDictionary<string, Microservice> _microservices = new();

        public MicroservicesService() { }

        public async Task<IEnumerable<Microservice>> GetMicroservicesAsync()
        {
            return _microservices.Values.ToList();
        }

        public void UpdateMicroservices(IEnumerable<Microservice> microservices)
        {
            _microservices.Clear();
            foreach (var service in microservices)
            {
                _microservices.TryAdd(service.Name, service);
            }
        }
    }
} 