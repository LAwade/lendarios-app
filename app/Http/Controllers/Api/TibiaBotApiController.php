<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TibiaBotConfig;
use App\Models\TibiaApi;
use App\Models\TeamSpeakVirtualServer;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;

class TibiaBotApiController extends Controller
{
    /**
     * Obter configuração do bot para um servidor virtual
     */
    public function show($virtualServerId): JsonResponse
    {
        $server = TeamSpeakVirtualServer::where('user_id', Auth::id())->findOrFail($virtualServerId);
        $config = TibiaBotConfig::with(['api', 'hunteds'])->where('virtual_server_id', $server->id)->first();

        return response()->json([
            'success' => true,
            'data' => [
                'config' => $config,
                'apis' => TibiaApi::where('is_active', true)->get()
            ]
        ]);
    }

    /**
     * Salvar/Atualizar configuração do bot
     */
    public function store(Request $request, $virtualServerId): JsonResponse
    {
        $server = TeamSpeakVirtualServer::where('user_id', Auth::id())->findOrFail($virtualServerId);
        
        $data = $request->validate([
            'tibia_api_id' => 'required|exists:tibia_apis,id',
            'guild_name' => 'required|string',
            'world' => 'required|string',
            'hunted_level' => 'integer',
            'alert_poke' => 'boolean',
        ]);

        $config = TibiaBotConfig::updateOrCreate(
            ['virtual_server_id' => $server->id],
            $data
        );

        return response()->json(['success' => true, 'data' => $config]);
    }

    /**
     * Buscar dados das listas (Makers, Hunted, Deaths)
     */
    public function fetchLists($virtualServerId): JsonResponse
    {
        $server = TeamSpeakVirtualServer::where('user_id', Auth::id())->findOrFail($virtualServerId);
        $config = TibiaBotConfig::with('api')->where('virtual_server_id', $server->id)->first();

        if (!$config) {
            return response()->json(['success' => false, 'message' => 'Bot não configurado'], 404);
        }

        $apiBase = $config->api->api_url ?: 'http://144.22.199.156:3003';
        $type = $config->api->api_type;
        $guild = urlencode($config->guild_name);
        $server_name = $config->api->server_name; // This is not exactly what the API expects for OT servers

        // In legacy: self::SERVER_API . "/api/tibia/friends/{$this->src}/{$this->server}/{$this->guild}"
        // src = api_type, server = api_type (usually), guild = guild_name
        
        try {
            $friends = Http::get("{$apiBase}/api/tibia/friends/{$type}/{$type}/{$guild}")->json();
            $neutrals = Http::get("{$apiBase}/api/tibia/neutrals/{$type}/{$type}/{$guild}")->json();
            $deaths = Http::get("{$apiBase}/api/tibia/deaths/{$type}/{$type}/{$guild}")->json();

            return response()->json([
                'success' => true,
                'data' => [
                    'friends' => $friends['data'] ?? [],
                    'neutrals' => $neutrals['data'] ?? [],
                    'deaths' => $deaths['data'] ?? []
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Erro ao conectar na API de Tibia'], 500);
        }
    }
}
