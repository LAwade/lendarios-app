<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use App\Models\Status;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Criar Status
        $statuses = [
            ['id' => 1, 'name' => 'Pago'],
            ['id' => 2, 'name' => 'Pendente'],
            ['id' => 3, 'name' => 'Cancelado'],
        ];
        foreach ($statuses as $status) {
            Status::updateOrCreate(['id' => $status['id']], $status);
        }

        // Criar Permissões
        $permissions = [
            ['id' => 1, 'name' => 'Admin'],
            ['id' => 2, 'name' => 'Cliente'],
        ];
        foreach ($permissions as $perm) {
            \App\Models\Permission::updateOrCreate(['id' => $perm['id']], $perm);
        }

        // Criar Admin User
        User::updateOrCreate(
            ['email' => 'lucasawade46@gmail.com'],
            [
                'name' => 'Lucas Awade',
                'password' => Hash::make('123456'),
                'permission_id' => 1,
            ]
        );

        // Criar Categorias
        $categories = [
            ['id' => 1, 'name' => 'TeamSpeak 3', 'description' => 'Servidores de TeamSpeak 3'],
            ['id' => 2, 'name' => 'Tibia Bot', 'description' => 'Bots para Tibia'],
            ['id' => 3, 'name' => 'Hospedagem', 'description' => 'Serviços de hospedagem'],
        ];
        foreach ($categories as $cat) {
            Category::updateOrCreate(['id' => $cat['id']], $cat);
        }

        // Criar Produtos
        $products = [
            ['id' => 1, 'name' => 'Plano TS3 Starter', 'category_id' => 1, 'price' => 15.00, 'description' => '32 slots, DDoS Protection', 'unity' => 1],
            ['id' => 2, 'name' => 'Plano TS3 Basic', 'category_id' => 1, 'price' => 25.00, 'description' => '64 slots, DDoS Protection', 'unity' => 1],
            ['id' => 3, 'name' => 'Plano TS3 Pro', 'category_id' => 1, 'price' => 40.00, 'description' => '128 slots, DDoS Protection', 'unity' => 1],
            ['id' => 4, 'name' => 'Plano TS3 Enterprise', 'category_id' => 1, 'price' => 70.00, 'description' => '256 slots, DDoS Protection', 'unity' => 1],
            ['id' => 5, 'name' => 'Tibia Bot Mensal', 'category_id' => 2, 'price' => 20.00, 'description' => 'Bot para Tibia com todas as funções', 'unity' => 1],
        ];
        foreach ($products as $prod) {
            Product::updateOrCreate(['id' => $prod['id']], $prod);
        }

        $this->command->info('✅ Dados iniciais criados com sucesso!');
    }
}
