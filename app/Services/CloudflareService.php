<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Exception;

class CloudflareService
{
    protected string $apiBaseUrl = 'https://api.cloudflare.com/client/v4';
    protected string $zoneId;
    protected string $email;
    protected string $apiKey;
    protected string $teamspeakDomain;

    public function __construct()
    {
        $this->zoneId = config('services.cloudflare.zone_id');
        $this->email = config('services.cloudflare.email');
        $this->apiKey = config('services.cloudflare.api_key');
        $this->teamspeakDomain = config('services.cloudflare.teamspeak_domain');
    }

    /**
     * Headers padrão para a API do Cloudflare
     */
    protected function headers(): array
    {
        return [
            'X-Auth-Email' => $this->email,
            'X-Auth-Key' => $this->apiKey,
            'Content-Type' => 'application/json',
        ];
    }

    /**
     * Faz requisição para a API do Cloudflare
     */
    protected function request(string $method, string $endpoint, array $data = null): array
    {
        $url = "{$this->apiBaseUrl}{$endpoint}";
        
        $response = Http::withHeaders($this->headers())
            ->{$method}($url, $data);

        $result = $response->json();

        if (!$result['success']) {
            Log::error('Cloudflare API Error', [
                'endpoint' => $endpoint,
                'method' => $method,
                'data' => $data,
                'response' => $result
            ]);
        }

        return $result;
    }

    /**
     * Cria registro SRV para servidor TeamSpeak
     * 
     * @param string $name Nome do servidor (sem domínio)
     * @param int $port Porta do servidor TeamSpeak
     * @return array|false
     * 
     * Exemplo: createDNS('meuservidor', 9987)
     * Cria: _ts3._udp.meuservidor.ts3.lendariosteam.com.br -> ts3.lendariosteam.com.br:9987
     */
    public function createDNS(string $name, int $port): array|false
    {
        // Remove domínio se já estiver incluído
        $name = str_replace('.' . $this->teamspeakDomain, '', $name);

        $data = [
            'type' => 'SRV',
            'ttl' => 1,
            'name' => "_ts3._udp.{$name}.ts3",
            'data' => [
                'priority' => 1,
                'weight' => 1,
                'port' => $port,
                'target' => $this->teamspeakDomain
            ]
        ];

        $response = $this->request('post', "/zones/{$this->zoneId}/dns_records", $data);

        if (!$response['success']) {
            return false;
        }

        return $response['result'];
    }

    /**
     * Lista registros DNS SRV
     * 
     * @param string|null $name Filtrar por nome (opcional)
     * @return array
     */
    public function getDNS(?string $name = null): array
    {
        $query = '?type=SRV&per_page=100';

        if ($name) {
            // Remove domínio se já estiver incluído
            $name = str_replace('.' . $this->teamspeakDomain, '', $name);
            $fqdn = "_ts3._udp.{$name}.{$this->teamspeakDomain}";
            $query .= "&name={$fqdn}";
        }

        $response = $this->request('get', "/zones/{$this->zoneId}/dns_records{$query}");

        return $response['result'] ?? [];
    }

    /**
     * Busca um registro DNS específico pelo nome
     * 
     * @param string $name Nome do servidor
     * @return array|null
     */
    public function findDNS(string $name): ?array
    {
        $records = $this->getDNS($name);
        return $records[0] ?? null;
    }

    /**
     * Deleta registro DNS pelo ID
     * 
     * @param string $recordId ID do registro no Cloudflare
     * @return bool
     */
    public function deleteDNS(string $recordId): bool
    {
        $response = $this->request('delete', "/zones/{$this->zoneId}/dns_records/{$recordId}");
        return $response['success'] ?? false;
    }

    /**
     * Deleta registro DNS pelo nome do servidor
     * 
     * @param string $name Nome do servidor
     * @return bool
     */
    public function deleteDNSByName(string $name): bool
    {
        $record = $this->findDNS($name);
        
        if (!$record) {
            return false;
        }

        return $this->deleteDNS($record['id']);
    }

    /**
     * Atualiza o nome de um registro DNS
     * 
     * @param string $recordId ID do registro
     * @param string $newName Novo nome
     * @return array|false
     */
    public function updateDNS(string $recordId, string $newName): array|false
    {
        // Remove domínio se já estiver incluído
        $newName = str_replace('.' . $this->teamspeakDomain, '', $newName);

        $data = [
            'name' => "_ts3._udp.{$newName}.ts3",
        ];

        $response = $this->request('patch', "/zones/{$this->zoneId}/dns_records/{$recordId}", $data);

        if (!$response['success']) {
            return false;
        }

        return $response['result'];
    }

    /**
     * Retorna o FQDN completo para conexão TeamSpeak
     * 
     * @param string $name Nome do servidor
     * @return string
     */
    public function getFullDomain(string $name): string
    {
        $name = str_replace('.' . $this->teamspeakDomain, '', $name);
        return "{$name}.{$this->teamspeakDomain}";
    }
}
