<?php

namespace App\Services;

use App\Models\TeamSpeakServerMaster;
use App\Models\TeamSpeakVirtualServer;
use Exception;

// Carrega a biblioteca ts3admin legado
require_once app_path('Libraries/TeamSpeak/ts3admin.class.php');

class TeamSpeakService
{
    private $ts3;

    public function __construct()
    {
        // A versão do ts3admin legado exige host e porta no construtor
        // Usamos valores placeholder e sobrescrevemos no connect()
        $this->ts3 = new \ts3admin('127.0.0.1', 10011);
    }

    /**
     * Conecta ao servidor Master
     */
    public function connect(TeamSpeakServerMaster $master)
    {
        $connection = $this->ts3->connect($master->host, $master->query_port);
        
        if (!$connection['success']) {
            throw new Exception("Erro de conexão TS3: " . implode(' | ', $connection['errors']));
        }

        $login = $this->ts3->login($master->username, $master->password);
        
        if (!$login['success']) {
            throw new Exception("Erro de login TS3: " . implode(' | ', $login['errors']));
        }

        return true;
    }

    /**
     * Seleciona um servidor virtual pela porta
     */
    public function selectServer(int $port)
    {
        $result = $this->ts3->selectServer($port);
        if (!$result['success']) {
            throw new Exception("Erro ao selecionar servidor na porta {$port}: " . implode(' | ', $result['errors']));
        }
        return $result;
    }

    /**
     * Cria um novo servidor virtual
     */
    public function createVirtualServer(TeamSpeakServerMaster $master, array $data)
    {
        $this->connect($master);
        
        // Exemplo de dados: ['virtualserver_name' => 'Meu Server', 'virtualserver_maxclients' => 50]
        $newServer = $this->ts3->serverCreate($data);
        
        if (!$newServer['success']) {
            throw new Exception("Erro ao criar servidor virtual: " . implode(' | ', $newServer['errors']));
        }

        return $newServer['data']; // Contém sid e virtualserver_port
    }

    /**
     * Aplica um template de canais
     */
    public function applyTemplate(int $port, string $type)
    {
        $this->selectServer($port);
        
        $channels = $type === 'game' ? $this->getGameTemplate() : $this->getTibiaTemplate();

        foreach ($channels as $channel) {
            $this->ts3->channelCreate($channel);
        }

        return true;
    }

    protected function getGameTemplate()
    {
        return [
            ['channel_name' => '[cspacer01]┏╋━━━━━━۩ ۞ ۩━━━━━━╋┓', 'channel_topic' => 'Bem-vindo'],
            ['channel_name' => '[csspacer01]›»       Bem-vindo      «‹'],
            ['channel_name' => '[csspacer1]--═● AGUARDANDO REGISTRO ●═--'],
            ['channel_name' => '[cspacer03]┗╋━━━━━━━━━━━━━━━╋┛'],
        ];
    }

    protected function getTibiaTemplate()
    {
        return [
            ['channel_name' => '[cspacer01]┏╋━━━━━━۩ ۞ ۩━━━━━━╋┓'],
            ['channel_name' => '[csspacer1] ›»   Seja Bem-vindo   «‹'],
            ['channel_name' => '[csspacer1]--═● AGUARDANDO REGISTRO ●═--'],
        ];
    }

    /**
     * Retorna a instância bruta do ts3admin para operações customizadas
     */
    public function adapter()
    {
        return $this->ts3;
    }

    /**
     * Restaurar Server Admin - Gera token de admin para recuperar acesso
     */
    public function restoreServerAdmin(int $port)
    {
        $this->selectServer($port);
        
        // Buscar o grupo Server Admin (geralmente ID 6)
        $groups = $this->ts3->serverGroupList();
        $adminGroupId = 6; // Default
        
        if ($groups['success']) {
            foreach ($groups['data'] as $group) {
                if ($group['type'] == 0 && stripos($group['name'], 'admin') !== false) {
                    $adminGroupId = $group['sgid'];
                    break;
                }
            }
        }
        
        // Gerar token de privilégio para o grupo admin
        $token = $this->ts3->tokenAdd(0, $adminGroupId, 0, 'Token de recuperação - Painel Lendários');
        
        if (!$token['success']) {
            throw new Exception("Erro ao gerar token de admin: " . implode(' | ', $token['errors']));
        }
        
        return $token['data']['token'];
    }

    /**
     * Listar clientes online no servidor
     */
    public function getOnlineClients(int $port)
    {
        $this->selectServer($port);
        
        $clients = $this->ts3->clientList();
        
        if (!$clients['success']) {
            throw new Exception("Erro ao listar clientes: " . implode(' | ', $clients['errors']));
        }
        
        // Filtrar apenas clientes reais (não query)
        $realClients = array_filter($clients['data'], function($client) {
            return $client['client_type'] == 0;
        });
        
        return array_values($realClients);
    }

    /**
     * Listar todos os grupos do servidor
     */
    public function getServerGroups(int $port)
    {
        $this->selectServer($port);
        
        $groups = $this->ts3->serverGroupList();
        
        if (!$groups['success']) {
            throw new Exception("Erro ao listar grupos: " . implode(' | ', $groups['errors']));
        }
        
        return $groups['data'];
    }

    /**
     * Adicionar grupo a um cliente
     */
    public function addClientToGroup(int $port, int $clientDbId, int $groupId)
    {
        $this->selectServer($port);
        
        $result = $this->ts3->serverGroupAddClient($groupId, $clientDbId);
        
        if (!$result['success']) {
            throw new Exception("Erro ao adicionar grupo: " . implode(' | ', $result['errors']));
        }
        
        return true;
    }

    /**
     * Remover grupo de um cliente
     */
    public function removeClientFromGroup(int $port, int $clientDbId, int $groupId)
    {
        $this->selectServer($port);
        
        $result = $this->ts3->serverGroupDeleteClient($groupId, $clientDbId);
        
        if (!$result['success']) {
            throw new Exception("Erro ao remover grupo: " . implode(' | ', $result['errors']));
        }
        
        return true;
    }

    /**
     * Listar banimentos do servidor
     */
    public function getBans(int $port)
    {
        $this->selectServer($port);
        
        $bans = $this->ts3->banList();
        
        if (!$bans['success']) {
            // Se não há bans, retorna array vazio
            return [];
        }
        
        return $bans['data'];
    }

    /**
     * Adicionar banimento por IP
     */
    public function addBan(int $port, string $ip, int $duration = 0, string $reason = '')
    {
        $this->selectServer($port);
        
        // duration em segundos, 0 = permanente
        $result = $this->ts3->banAddByIp($ip, $duration, $reason);
        
        if (!$result['success']) {
            throw new Exception("Erro ao adicionar ban: " . implode(' | ', $result['errors']));
        }
        
        return $result['data'];
    }

    /**
     * Adicionar banimento por UID
     */
    public function addBanByUid(int $port, string $uid, int $duration = 0, string $reason = '')
    {
        $this->selectServer($port);
        
        $result = $this->ts3->banAddByUid($uid, $duration, $reason);
        
        if (!$result['success']) {
            throw new Exception("Erro ao adicionar ban por UID: " . implode(' | ', $result['errors']));
        }
        
        return $result['data'];
    }

    /**
     * Remover banimento
     */
    public function removeBan(int $port, int $banId)
    {
        $this->selectServer($port);
        
        $result = $this->ts3->banDelete($banId);
        
        if (!$result['success']) {
            throw new Exception("Erro ao remover ban: " . implode(' | ', $result['errors']));
        }
        
        return true;
    }

    /**
     * Criar backup do servidor (snapshot)
     */
    public function createBackup(int $port)
    {
        $this->selectServer($port);
        
        // Criar snapshot do servidor
        $snapshot = $this->ts3->serverSnapshotCreate();
        
        if (!$snapshot['success']) {
            throw new Exception("Erro ao criar backup: " . implode(' | ', $snapshot['errors']));
        }
        
        return $snapshot['data'];
    }

    /**
     * Restaurar backup do servidor (snapshot)
     */
    public function restoreBackup(int $port, string $snapshot)
    {
        $this->selectServer($port);
        
        $result = $this->ts3->serverSnapshotDeploy($snapshot);
        
        if (!$result['success']) {
            throw new Exception("Erro ao restaurar backup: " . implode(' | ', $result['errors']));
        }
        
        return true;
    }

    /**
     * Listar clientes do banco de dados (todos, incluindo offline)
     */
    public function getDatabaseClients(int $port)
    {
        $this->selectServer($port);
        
        $clients = $this->ts3->clientDbList();
        
        if (!$clients['success']) {
            throw new Exception("Erro ao listar clientes do banco: " . implode(' | ', $clients['errors']));
        }
        
        return $clients['data'];
    }

    /**
     * Buscar informações de um cliente específico
     */
    public function getClientInfo(int $port, int $clientDbId)
    {
        $this->selectServer($port);
        
        $info = $this->ts3->clientDbInfo($clientDbId);
        
        if (!$info['success']) {
            throw new Exception("Erro ao buscar info do cliente: " . implode(' | ', $info['errors']));
        }
        
        return $info['data'];
    }

    /**
     * Listar grupos de um cliente específico
     */
    public function getClientGroups(int $port, int $clientDbId)
    {
        $this->selectServer($port);
        
        $groups = $this->ts3->serverGroupsByClientId($clientDbId);
        
        if (!$groups['success']) {
            throw new Exception("Erro ao listar grupos do cliente: " . implode(' | ', $groups['errors']));
        }
        
        return $groups['data'];
    }

    /**
     * Listar canais do servidor
     */
    public function getChannelList(int $port)
    {
        $this->selectServer($port);
        
        $channels = $this->ts3->channelList();
        
        if (!$channels['success']) {
            throw new Exception("Erro ao listar canais: " . implode(' | ', $channels['errors']));
        }
        
        return $channels['data'];
    }

    /**
     * Deletar todos os canais (para recriar template limpo)
     */
    public function clearChannels(int $port)
    {
        $this->selectServer($port);
        
        $channels = $this->ts3->channelList();
        
        if ($channels['success']) {
            // Ordenar de trás para frente (canais filhos primeiro)
            $channelList = $channels['data'];
            usort($channelList, function($a, $b) {
                return $b['cid'] - $a['cid'];
            });
            
            foreach ($channelList as $channel) {
                // Pular canal padrão (geralmente ID 1)
                if ($channel['cid'] == 1) continue;
                
                $this->ts3->channelDelete($channel['cid'], true); // force=true
            }
        }
        
        return true;
    }

    /**
     * Aplicar template completo (limpa e recria canais)
     */
    public function applyFullTemplate(int $port, string $type, bool $clearExisting = false)
    {
        $this->selectServer($port);
        
        // Se solicitado, limpar canais existentes
        if ($clearExisting) {
            $this->clearChannels($port);
        }
        
        // Buscar template
        $channels = $this->getTemplateByType($type);
        
        foreach ($channels as $channel) {
            $result = $this->ts3->channelCreate($channel);
            if (!$result['success']) {
                // Log erro mas continua
                \Log::warning("Erro ao criar canal: " . implode(' | ', $result['errors']));
            }
        }
        
        return true;
    }

    /**
     * Retorna template por tipo
     */
    protected function getTemplateByType(string $type)
    {
        $templates = [
            'game' => $this->getGameTemplate(),
            'tibia' => $this->getTibiaTemplate(),
            'clan' => $this->getClanTemplate(),
            'default' => $this->getDefaultTemplate(),
        ];
        
        return $templates[$type] ?? $templates['default'];
    }

    protected function getClanTemplate()
    {
        return [
            ['channel_name' => '[cspacer]════════════════════════════', 'channel_flag_permanent' => 1],
            ['channel_name' => '» lobby', 'channel_flag_permanent' => 1],
            ['channel_name' => '» afk', 'channel_flag_permanent' => 1],
            ['channel_name' => '[cspacer]═══════ Clan ═══════', 'channel_flag_permanent' => 1],
            ['channel_name' => '» Officers', 'channel_flag_permanent' => 1, 'channel_password' => 'officer123'],
            ['channel_name' => '» Members', 'channel_flag_permanent' => 1],
            ['channel_name' => '» Recruits', 'channel_flag_permanent' => 1],
            ['channel_name' => '[cspacer]════════════════════════════', 'channel_flag_permanent' => 1],
        ];
    }

    protected function getDefaultTemplate()
    {
        return [
            ['channel_name' => '[cspacer]══════ Bem-vindo ══════', 'channel_flag_permanent' => 1],
            ['channel_name' => '» Lobby', 'channel_flag_permanent' => 1],
            ['channel_name' => '» AFK', 'channel_flag_permanent' => 1],
            ['channel_name' => '[cspacer]════════════════════════', 'channel_flag_permanent' => 1],
        ];
    }
}
