<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tibia_apis', function (Blueprint $table) {
            $table->id();
            $table->string('server_name'); // e.g. "Global", "Icewar"
            $table->string('api_type'); // e.g. "global", "versao86"
            $table->string('api_url')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tibia_apis');
    }
};
