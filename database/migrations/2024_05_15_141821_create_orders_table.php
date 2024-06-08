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
        Schema::create('orders', function (Blueprint $table) {
            $table->increments('id');
            $table->foreignId('user_id')->references('id')->on('users')->name('user_id')->index();
            $table->foreignId('status_id')->references('id')->on('status')->name('orders_status_id')->index();
            $table->timestamps();
        });

        Schema::create('itens', function (Blueprint $table) {
            $table->increments('id');
            $table->foreignId('order_id')->references('id')->on('orders')->name('order_id')->index();
            $table->foreignId('product_id')->references('id')->on('products')->name('product_id')->index();
            $table->integer('quantity');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('itens');
        Schema::dropIfExists('orders');
    }
};
