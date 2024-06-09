<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Http\Controllers\AuthController;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;

class ApiTest extends TestCase
{

    use RefreshDatabase;

    public function teste_user_api()
    {
        /**
         * DADOS DO NOVO USUÁRIO
         */
        $userData = [
            'name' => 'Teste User',
            'email' => 'testeuser@gmail.com',
            'password' => '123456',
            'password_confirmation' => '123456',
        ];

        /**
         * CRIANDO UMA REQUISIÇÃO DE TESTE
         */
        $response = $this->postJson('/api/v1/registrar', $userData);

        /**
         * VERIFICANDO O RETORNO DO CODIGO HTTP
         */
        $response->assertStatus(201);

        /**
         * VALIDA SE O USUÁRIO FOI CRIADO
         */
        $this->assertDatabaseHas('users', [
            'email' => 'testeuser@gmail.com'
        ]);

        /**
         * ANALISA O RETORNO EM JSON
         */
        $response->assertJsonStructure(
            [
                'success', 
                'message', 
                'data' => [ 'id', 'name', 'email' ]
            ]
        );
    }
}
