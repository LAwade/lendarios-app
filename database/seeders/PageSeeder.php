<?php

namespace Database\Seeders;

use App\Models\Page;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Page::create([
            'name' => 'Menus',
            'path' => 'admin/menus',
            'menu_id' => 1,
            'perm_max' => 100,
            'perm_min' => 100
        ]);

        Page::create([
            'name' => 'Páginas',
            'path' => 'admin/pages',
            'menu_id' => 1,
            'perm_max' => 100,
            'perm_min' => 100
        ]);

        Page::create([
            'name' => 'Permissões',
            'path' => 'admin/permissions',
            'menu_id' => 1,
            'perm_max' => 100,
            'perm_min' => 100
        ]);

        Page::create([
            'name' => 'Status',
            'path' => 'admin/status',
            'menu_id' => 1,
            'perm_max' => 100,
            'perm_min' => 100
        ]);

        Page::create([
            'name' => 'Categorias',
            'path' => 'admin/categories',
            'menu_id' => 1,
            'perm_max' => 100,
            'perm_min' => 100
        ]);

        Page::create([
            'name' => 'Produtos',
            'path' => 'admin/products',
            'menu_id' => 1,
            'perm_max' => 100,
            'perm_min' => 100
        ]);

        Page::create([
            'name' => 'Faturas',
            'path' => 'user/invoices',
            'menu_id' => 2,
            'perm_max' => 100,
            'perm_min' => 1
        ]);

        Page::create([
            'name' => 'Pedidos',
            'path' => 'user/orders',
            'menu_id' => 2,
            'perm_max' => 100,
            'perm_min' => 1
        ]);
    }
}
