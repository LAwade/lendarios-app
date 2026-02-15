<?php

namespace Database\Seeders;

use App\Models\TibiaApi;
use Illuminate\Database\Seeder;

class TibiaApiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $apis = [
            ['server_name' => 'Tibia Global', 'api_type' => 'global', 'api_url' => 'https://api.tibiadata.com/v4'],
            ['server_name' => 'Icewar', 'api_type' => 'icewar', 'api_url' => 'http://144.22.199.156:3003'],
            ['server_name' => 'Taleon', 'api_type' => 'taleon', 'api_url' => 'http://144.22.199.156:3003'],
            ['server_name' => 'Mega Baiak', 'api_type' => 'megabaiak', 'api_url' => 'http://144.22.199.156:3003'],
            ['server_name' => 'Epicwar', 'api_type' => 'epicwar', 'api_url' => 'http://144.22.199.156:3003'],
            ['server_name' => 'Underwar', 'api_type' => 'underwar', 'api_url' => 'http://144.22.199.156:3003'],
            ['server_name' => 'Medivia', 'api_type' => 'medivia', 'api_url' => 'http://144.22.199.156:3003'],
        ];

        foreach ($apis as $api) {
            TibiaApi::create($api);
        }
    }
}
