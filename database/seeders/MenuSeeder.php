<?php

namespace Database\Seeders;

use App\Models\Menu;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Menu::create([
            'name' => 'Administração',
            'icon' => 'fa fa-cog',
            'position' => 1
        ]);

        Menu::create([
            'name' => 'Pagamentos',
            'icon' => 'fa fa-credit-card',
            'position' => 2
        ]);

        Menu::create([
            'name' => 'Compras',
            'icon' => 'fa fa-shopping-cart',
            'position' => 3,
            'path' => 'store/shop'
        ]);
    }
}
