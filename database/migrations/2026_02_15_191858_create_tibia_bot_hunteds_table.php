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
        Schema::create('tibia_bot_hunteds', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tibia_bot_config_id')->constrained('tibia_bot_configs')->onDelete('cascade');
            $table->string('name_hunted');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tibia_bot_hunteds');
    }
};
