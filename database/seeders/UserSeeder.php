<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Lucas Awade',
            'permission_id' => 1,
            'email' => 'lucasawade46@gmail.com',
            'password' => password_hash('123456', PASSWORD_DEFAULT)
        ]);

        User::factory()->create([
            'name' => 'Pandas',
            'permission_id' => 3,
            'email' => 'pandas@gmail.com',
            'password' => password_hash('12345678', PASSWORD_DEFAULT)
        ]);
    }
}
