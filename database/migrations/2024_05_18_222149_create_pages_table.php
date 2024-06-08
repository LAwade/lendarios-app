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
        Schema::create('pages', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name', 250);
            $table->string('path', 250);
            $table->integer('menu_id')->references('id')->on('menu')->name('menu_id')->index();
            $table->boolean('is_active')->default(true);
            $table->integer('perm_max')->default(100);
            $table->integer('perm_min')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pages');
    }
};
