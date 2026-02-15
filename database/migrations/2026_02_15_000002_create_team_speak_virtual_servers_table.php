<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('team_speak_virtual_servers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('master_id')->constrained('team_speak_server_masters')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('product_id')->constrained('products');
            $table->integer('virtual_port');
            $table->integer('sid')->nullable();
            $table->string('status')->default('pending');
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('team_speak_virtual_servers');
    }
};
