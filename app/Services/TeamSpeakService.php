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
}
