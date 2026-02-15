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
        Schema::create('tibia_bot_configs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('virtual_server_id')->constrained('team_speak_virtual_servers')->onDelete('cascade');
            $table->foreignId('tibia_api_id')->constrained('tibia_apis')->onDelete('cascade');
            $table->string('guild_name');
            $table->string('world');
            $table->integer('hunted_level')->default(350);
            $table->boolean('alert_poke')->default(false);
            
            // TeamSpeak Channel Mappings
            $table->integer('channel_friend_list')->nullable();
            $table->integer('channel_neutral_list')->nullable();
            $table->integer('channel_hunted_list')->nullable();
            $table->integer('channel_huntedmaker_list')->nullable();
            $table->integer('channel_ally_list')->nullable();
            $table->integer('channel_enemy_list')->nullable();
            $table->integer('channel_death_list')->nullable();
            $table->integer('channel_news_list')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tibia_bot_configs');
    }
};
