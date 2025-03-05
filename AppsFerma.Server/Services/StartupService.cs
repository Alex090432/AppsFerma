using AppsFerma.Server.Services;
using AppsFerma.Server.WorkWithHub;
using Microsoft.Extensions.Hosting;

namespace AppsFerma.Server.Services
{
    public class StartupService : IHostedService
    {
        private readonly IHubConnection _hubConnection;
        private readonly IMicroservicesService _microservicesService;
        private readonly ILogger<StartupService> _logger;
        private Task? _executingTask;
        private CancellationTokenSource? _stoppingCts;

        public StartupService(IHubConnection hubConnection, IMicroservicesService microservicesService, ILogger<StartupService> logger)
        {
            _hubConnection = hubConnection;
            _microservicesService = microservicesService;
            _logger = logger;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            _stoppingCts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
            _executingTask = ExecuteAsync(_stoppingCts.Token);

            if (_executingTask.IsCompleted)
            {
                return _executingTask;
            }

            return Task.CompletedTask;
        }

        public async Task StopAsync(CancellationToken cancellationToken)
        {
            if (_executingTask == null)
            {
                return;
            }

            try
            {
                _stoppingCts?.Cancel();
            }
            finally
            {
                await Task.WhenAny(_executingTask, Task.Delay(-1, cancellationToken));
            }
        }

        private async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    var microservices = await _hubConnection.GetMicroservices();
                    _microservicesService.UpdateMicroservices(microservices);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Ошибка при получении списка микросервисов");
                }

                await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);
            }
        }
    }
}