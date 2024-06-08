<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Status;

class StatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Status::create(['id' => 1, 'name' => 'EM TESTE']);
        Status::create(['id' => 2, 'name' => 'EM ABERTO']);
        Status::create(['id' => 3, 'name' => 'ATRASADA']);
        Status::create(['id' => 4, 'name' => 'PENDENTE']);
        Status::create(['id' => 5, 'name' => 'CANCELADO']);
        Status::create(['id' => 6, 'name' => 'FINALIZADO']);
        Status::create(['id' => 7, 'name' => 'PAGO']);
        Status::create(['id' => 8, 'name' => 'ATIVO']);
    }
}
