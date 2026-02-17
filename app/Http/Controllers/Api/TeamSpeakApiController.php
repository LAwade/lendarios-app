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

    /**
     * Listar canais do servidor virtual
     */
    public function channels($id): JsonResponse
    {
        $server = TeamSpeakVirtualServer::with('master')->where('user_id', Auth::id())->find($id);
        if (!$server) return response()->json(['success' => false, 'message' => 'Servidor não encontrado'], 404);

        try {
            $this->tsService->connect($server->master);
            $channels = $this->tsService->getChannelList($server->virtual_port);

            return response()->json([
                'success' => true,
                'data' => $channels
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Restaurar Server Admin - Gera token para recuperar acesso
     */
    public function restoreAdmin($id): JsonResponse
    {
        $server = TeamSpeakVirtualServer::with('master')->where('user_id', Auth::id())->find($id);
        if (!$server) {
            return response()->json(['success' => false, 'message' => 'Servidor não encontrado'], 404);
        }

        try {
            $this->tsService->connect($server->master);
            $token = $this->tsService->restoreServerAdmin($server->virtual_port);

            return response()->json([
                'success' => true,
                'token' => $token,
                'message' => 'Token de Server Admin gerado com sucesso! Use-o no cliente TeamSpeak para recuperar o acesso.'
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Listar clientes online
     */
    public function onlineClients($id): JsonResponse
    {
        $server = TeamSpeakVirtualServer::with('master')->where('user_id', Auth::id())->find($id);
        if (!$server) {
            return response()->json(['success' => false, 'message' => 'Servidor não encontrado'], 404);
        }

        try {
            $this->tsService->connect($server->master);
            $clients = $this->tsService->getOnlineClients($server->virtual_port);

            return response()->json([
                'success' => true,
                'data' => $clients
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Listar todos os clientes (banco de dados)
     */
    public function allClients($id): JsonResponse
    {
        $server = TeamSpeakVirtualServer::with('master')->where('user_id', Auth::id())->find($id);
        if (!$server) {
            return response()->json(['success' => false, 'message' => 'Servidor não encontrado'], 404);
        }

        try {
            $this->tsService->connect($server->master);
            $clients = $this->tsService->getDatabaseClients($server->virtual_port);

            return response()->json([
                'success' => true,
                'data' => $clients
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Listar grupos do servidor
     */
    public function groups($id): JsonResponse
    {
        $server = TeamSpeakVirtualServer::with('master')->where('user_id', Auth::id())->find($id);
        if (!$server) {
            return response()->json(['success' => false, 'message' => 'Servidor não encontrado'], 404);
        }

        try {
            $this->tsService->connect($server->master);
            $groups = $this->tsService->getServerGroups($server->virtual_port);

            return response()->json([
                'success' => true,
                'data' => $groups
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Listar grupos de um cliente específico
     */
    public function clientGroups(Request $request, $id): JsonResponse
    {
        $server = TeamSpeakVirtualServer::with('master')->where('user_id', Auth::id())->find($id);
        if (!$server) {
            return response()->json(['success' => false, 'message' => 'Servidor não encontrado'], 404);
        }

        $clientDbId = $request->input('client_dbid');
        if (!$clientDbId) {
            return response()->json(['success' => false, 'message' => 'client_dbid é obrigatório'], 400);
        }

        try {
            $this->tsService->connect($server->master);
            $groups = $this->tsService->getClientGroups($server->virtual_port, $clientDbId);

            return response()->json([
                'success' => true,
                'data' => $groups
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Adicionar grupo a um cliente
     */
    public function addGroup(Request $request, $id): JsonResponse
    {
        $server = TeamSpeakVirtualServer::with('master')->where('user_id', Auth::id())->find($id);
        if (!$server) {
            return response()->json(['success' => false, 'message' => 'Servidor não encontrado'], 404);
        }

        $validated = $request->validate([
            'client_dbid' => 'required|integer',
            'group_id' => 'required|integer',
        ]);

        try {
            $this->tsService->connect($server->master);
            $this->tsService->addClientToGroup(
                $server->virtual_port,
                $validated['client_dbid'],
                $validated['group_id']
            );

            return response()->json([
                'success' => true,
                'message' => 'Grupo adicionado com sucesso!'
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Remover grupo de um cliente
     */
    public function removeGroup(Request $request, $id): JsonResponse
    {
        $server = TeamSpeakVirtualServer::with('master')->where('user_id', Auth::id())->find($id);
        if (!$server) {
            return response()->json(['success' => false, 'message' => 'Servidor não encontrado'], 404);
        }

        $validated = $request->validate([
            'client_dbid' => 'required|integer',
            'group_id' => 'required|integer',
        ]);

        try {
            $this->tsService->connect($server->master);
            $this->tsService->removeClientFromGroup(
                $server->virtual_port,
                $validated['client_dbid'],
                $validated['group_id']
            );

            return response()->json([
                'success' => true,
                'message' => 'Grupo removido com sucesso!'
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Listar banimentos
     */
    public function bans($id): JsonResponse
    {
        $server = TeamSpeakVirtualServer::with('master')->where('user_id', Auth::id())->find($id);
        if (!$server) {
            return response()->json(['success' => false, 'message' => 'Servidor não encontrado'], 404);
        }

        try {
            $this->tsService->connect($server->master);
            $bans = $this->tsService->getBans($server->virtual_port);

            return response()->json([
                'success' => true,
                'data' => $bans
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Adicionar banimento
     */
    public function addBan(Request $request, $id): JsonResponse
    {
        $server = TeamSpeakVirtualServer::with('master')->where('user_id', Auth::id())->find($id);
        if (!$server) {
            return response()->json(['success' => false, 'message' => 'Servidor não encontrado'], 404);
        }

        $validated = $request->validate([
            'ip' => 'nullable|string',
            'uid' => 'nullable|string',
            'duration' => 'nullable|integer|min:0',
            'reason' => 'nullable|string|max:200',
        ]);

        if (empty($validated['ip']) && empty($validated['uid'])) {
            return response()->json(['success' => false, 'message' => 'IP ou UID é obrigatório'], 400);
        }

        try {
            $this->tsService->connect($server->master);
            
            if (!empty($validated['ip'])) {
                $result = $this->tsService->addBan(
                    $server->virtual_port,
                    $validated['ip'],
                    $validated['duration'] ?? 0,
                    $validated['reason'] ?? ''
                );
            } else {
                $result = $this->tsService->addBanByUid(
                    $server->virtual_port,
                    $validated['uid'],
                    $validated['duration'] ?? 0,
                    $validated['reason'] ?? ''
                );
            }

            return response()->json([
                'success' => true,
                'message' => 'Banimento adicionado com sucesso!',
                'data' => $result
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Remover banimento
     */
    public function removeBan(Request $request, $id): JsonResponse
    {
        $server = TeamSpeakVirtualServer::with('master')->where('user_id', Auth::id())->find($id);
        if (!$server) {
            return response()->json(['success' => false, 'message' => 'Servidor não encontrado'], 404);
        }

        $validated = $request->validate([
            'ban_id' => 'required|integer',
        ]);

        try {
            $this->tsService->connect($server->master);
            $this->tsService->removeBan($server->virtual_port, $validated['ban_id']);

            return response()->json([
                'success' => true,
                'message' => 'Banimento removido com sucesso!'
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Criar backup (snapshot)
     */
    public function createBackup($id): JsonResponse
    {
        $server = TeamSpeakVirtualServer::with('master')->where('user_id', Auth::id())->find($id);
        if (!$server) {
            return response()->json(['success' => false, 'message' => 'Servidor não encontrado'], 404);
        }

        try {
            $this->tsService->connect($server->master);
            $snapshot = $this->tsService->createBackup($server->virtual_port);

            // Salvar snapshot no banco de dados
            $backup = \App\Models\TeamSpeakBackup::create([
                'virtual_server_id' => $server->id,
                'user_id' => Auth::id(),
                'snapshot' => $snapshot,
                'created_at' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Backup criado com sucesso!',
                'backup_id' => $backup->id,
                'snapshot' => $snapshot
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Listar backups
     */
    public function listBackups($id): JsonResponse
    {
        $server = TeamSpeakVirtualServer::with('master')->where('user_id', Auth::id())->find($id);
        if (!$server) {
            return response()->json(['success' => false, 'message' => 'Servidor não encontrado'], 404);
        }

        $backups = \App\Models\TeamSpeakBackup::where('virtual_server_id', $server->id)
            ->orderBy('created_at', 'desc')
            ->get(['id', 'created_at']);

        return response()->json([
            'success' => true,
            'data' => $backups
        ]);
    }

    /**
     * Restaurar backup
     */
    public function restoreBackup(Request $request, $id): JsonResponse
    {
        $server = TeamSpeakVirtualServer::with('master')->where('user_id', Auth::id())->find($id);
        if (!$server) {
            return response()->json(['success' => false, 'message' => 'Servidor não encontrado'], 404);
        }

        $validated = $request->validate([
            'backup_id' => 'required|integer',
        ]);

        try {
            $backup = \App\Models\TeamSpeakBackup::where('id', $validated['backup_id'])
                ->where('virtual_server_id', $server->id)
                ->first();

            if (!$backup) {
                return response()->json(['success' => false, 'message' => 'Backup não encontrado'], 404);
            }

            $this->tsService->connect($server->master);
            $this->tsService->restoreBackup($server->virtual_port, $backup->snapshot);

            return response()->json([
                'success' => true,
                'message' => 'Backup restaurado com sucesso!'
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Aplicar template completo (com opção de limpar existentes)
     */
    public function applyTemplateFull(Request $request, $id): JsonResponse
    {
        $server = TeamSpeakVirtualServer::with('master')->where('user_id', Auth::id())->find($id);
        if (!$server) {
            return response()->json(['success' => false, 'message' => 'Servidor não encontrado'], 404);
        }

        $validated = $request->validate([
            'template' => 'required|string|in:game,tibia,clan,default',
            'clear_existing' => 'nullable|boolean',
        ]);

        try {
            $this->tsService->connect($server->master);
            $this->tsService->applyFullTemplate(
                $server->virtual_port,
                $validated['template'],
                $validated['clear_existing'] ?? false
            );

            return response()->json([
                'success' => true,
                'message' => "Template {$validated['template']} aplicado com sucesso!"
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
