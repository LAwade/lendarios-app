<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Permission::create([
            'id' => 1,
            'name' => 'Master',
            'value' => 100
        ]);

        Permission::create([
            'id' => 2,
            'name' => 'Administrator',
            'value' => 90
        ]);

        Permission::create([
            'id' => 3,
            'name' => 'User',
            'value' => 5
        ]);
    }
}
