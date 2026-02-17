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
        Schema::create('teamspeak_backups', function (Blueprint $table) {
            $table->id();
            $table->foreignId('virtual_server_id')->constrained('team_speak_virtual_servers')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->text('snapshot');
            $table->timestamps();
            
            $table->index(['virtual_server_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teamspeak_backups');
    }
};
