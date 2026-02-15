<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TeamSpeakVirtualServer;
use App\Services\TeamSpeakService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class TeamSpeakApiController extends Controller
{
    protected $tsService;

    public function __construct(TeamSpeakService $tsService)
    {
        $this->tsService = $tsService;
    }

    /**
     * Ver detalhes do servidor (Token, Status, etc)
     */
    public function show($id): JsonResponse
    {
        $server = TeamSpeakVirtualServer::with('master')
            ->where('user_id', Auth::id())
            ->find($id);

        if (!$server) {
            return response()->json(['success' => false, 'message' => 'Servidor não encontrado'], 404);
        }

        // Tentar obter informações em tempo real do TS3
        try {
            $this->tsService->connect($server->master);
            $this->tsService->selectServer($server->virtual_port);
            $info = $this->tsService->adapter()->serverInfo();
            
            // Exemplo: Buscar tokens de privilégio ativos
            $tokens = $this->tsService->adapter()->tokenList();

            return response()->json([
                'success' => true,
                'data' => [
                    'db' => $server,
                    'realtime' => $info['data'] ?? null,
                    'tokens' => $tokens['data'] ?? []
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => true, // Ainda sucesso pois temos dados no DB
                'data' => [
                    'db' => $server,
                    'realtime' => null,
                    'error' => 'Não foi possível conectar ao TeamSpeak no momento.'
                ]
            ]);
        }
    }

    /**
     * Gerar novo Token de Admin
     */
    public function generateToken($id): JsonResponse
    {
        $server = TeamSpeakVirtualServer::with('master')->where('user_id', Auth::id())->find($id);
        
        try {
            $this->tsService->connect($server->master);
            $this->tsService->selectServer($server->virtual_port);
            
            // sgid 6 geralmente é o Server Admin default
            $token = $this->tsService->adapter()->tokenAdd(0, 6, 0, 'Token gerado via Painel Lendários');
            
            return response()->json([
                'success' => true,
                'token' => $token['data']['token']
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Aplicar Template de Canais
     */
    public function applyTemplate(Request $request, $id): JsonResponse
    {
        $server = TeamSpeakVirtualServer::with('master')->where('user_id', Auth::id())->find($id);
        $type = $request->input('template', 'game');

        try {
            $this->tsService->applyTemplate($server->virtual_port, $type);
            return response()->json(['success' => true, 'message' => "Template {$type} aplicado com sucesso!"]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
