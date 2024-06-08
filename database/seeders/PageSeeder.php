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
            'path' => 'menus',
            'menu_id' => 1,
            'perm_max' => 100,
            'perm_min' => 100
        ]);

        Page::create([
            'name' => 'Pages',
            'path' => 'pages',
            'menu_id' => 1,
            'perm_max' => 100,
            'perm_min' => 100
        ]);
    }
}
