<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Order;
use App\Models\Invoice;
use App\Models\Ticket;
use App\Models\TeamSpeakVirtualServer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminApiController extends Controller
{
    /**
     * Estatísticas gerais para o Admin
     */
    public function stats(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'total_users' => User::count(),
                'active_servers' => TeamSpeakVirtualServer::where('status', 'online')->count(),
                'pending_invoices' => Invoice::where('status_id', 2)->count(),
                'open_tickets' => Ticket::where('status', 'open')->count(),
                'monthly_revenue' => Invoice::where('status_id', 1)->whereMonth('created_at', now()->month)->sum('amount'),
            ]
        ]);
    }

    /**
     * Listar todos os usuários
     */
    public function users(): JsonResponse
    {
        $users = User::withCount(['virtualServers', 'orders'])->orderBy('created_at', 'desc')->get();
        return response()->json(['success' => true, 'data' => $users]);
    }

    /**
     * Listar todos os tickets pendentes
     */
    public function tickets(): JsonResponse
    {
        $tickets = Ticket::with('user')->orderBy('priority', 'desc')->orderBy('created_at', 'desc')->get();
        return response()->json(['success' => true, 'data' => $tickets]);
    }

    /**
     * Obter configurações da instância Server Query (Master + Flood settings)
     */
    public function getQuerySettings(\App\Services\TeamSpeakService $tsService): JsonResponse
    {
        try {
            $master = \App\Models\TeamSpeakServerMaster::first();
            
            $data = [
                'master' => $master,
                'flood' => [
                    'flood_commands' => 10,
                    'flood_time' => 3,
                    'ban_time' => 600,
                ]
            ];

            if ($master) {
                try {
                    $tsService->connect($master);
                    $info = $tsService->adapter()->instanceInfo();
                    $data['flood'] = [
                        'flood_commands' => $info['data']['serverinstance_serverquery_flood_commands'] ?? 10,
                        'flood_time' => $info['data']['serverinstance_serverquery_flood_time'] ?? 3,
                        'ban_time' => $info['data']['serverinstance_serverquery_ban_time'] ?? 600,
                    ];
                } catch (\Exception $e) {
                    $data['connection_error'] = $e->getMessage();
                }
            }

            return response()->json([
                'success' => true,
                'data' => $data
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Atualizar configurações do Server Query (Master + Flood)
     */
    public function updateQuerySettings(Request $request, \App\Services\TeamSpeakService $tsService): JsonResponse
    {
        $request->validate([
            'host' => 'required|string',
            'query_port' => 'required|integer',
            'username' => 'required|string',
            'password' => 'nullable|string',
            'flood_commands' => 'required|integer',
            'flood_time' => 'required|integer',
            'ban_time' => 'required|integer',
        ]);

        try {
            $master = \App\Models\TeamSpeakServerMaster::first() ?: new \App\Models\TeamSpeakServerMaster();
            
            $master->name = 'Servidor Principal';
            $master->host = $request->host;
            $master->query_port = $request->query_port;
            $master->username = $request->username;
            if ($request->password) {
                $master->password = $request->password;
            }
            $master->is_active = true;
            $master->save();

            // Tentar aplicar configurações de flood se a conexão funcionar
            try {
                $tsService->connect($master);
                $floodData = [
                    'serverinstance_serverquery_flood_commands' => $request->flood_commands,
                    'serverinstance_serverquery_flood_time' => $request->flood_time,
                    'serverinstance_serverquery_ban_time' => $request->ban_time,
                ];
                $tsService->adapter()->instanceEdit($floodData);
            } catch (\Exception $e) {
                return response()->json([
                    'success' => true, 
                    'message' => 'Dados do servidor salvos, mas não foi possível conectar para atualizar o flood: ' . $e->getMessage()
                ]);
            }

            return response()->json(['success' => true, 'message' => 'Configurações atualizadas com sucesso!']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Listar pedidos (pendentes por padrão)
     */
    public function orders(): JsonResponse
    {
        $orders = Order::with(['user', 'product', 'invoice'])->orderBy('created_at', 'desc')->get();
        return response()->json(['success' => true, 'data' => $orders]);
    }

    /**
     * Confirmar um pedido
     */
    public function confirmOrder($id): JsonResponse
    {
        $order = Order::with(['product', 'invoice'])->find($id);
        if (!$order) return response()->json(['success' => false, 'message' => 'Pedido não encontrado'], 404);

        DB::beginTransaction();
        try {
            $order->status = 'completed';
            $order->save();

            if ($order->invoice) {
                $order->invoice->status_id = 1; // Pago
                $order->invoice->paid_at = now();
                $order->invoice->save();
            }

            // Simular criação de servidor TeamSpeak se for um produto de TS3
            if (str_contains(strtolower($order->product->name), 'plano') || str_contains(strtolower($order->product->name), 'ts3')) {
                TeamSpeakVirtualServer::create([
                    'user_id' => $order->user_id,
                    'order_id' => $order->id,
                    'name' => 'Servidor de ' . $order->user->name,
                    'port' => rand(9987, 12000),
                    'slots' => 50, // Padrão
                    'status' => 'online',
                    'expires_at' => now()->addMonth(),
                ]);
            }

            DB::commit();
            return response()->json(['success' => true, 'message' => 'Pedido confirmado e serviço ativado']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Cancelar um pedido
     */
    public function cancelOrder($id): JsonResponse
    {
        $order = Order::find($id);
        if (!$order) return response()->json(['success' => false, 'message' => 'Pedido não encontrado'], 404);

        $order->status = 'cancelled';
        $order->save();

        if ($order->invoice) {
            $order->invoice->status_id = 3; // Cancelado
            $order->invoice->save();
        }

        return response()->json(['success' => true, 'message' => 'Pedido cancelado']);
    }
}
