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
        Schema::create('invoices', function (Blueprint $table) {
            $table->increments('id');
            $table->float('amount', 2, 0);
            $table->foreignId('order_id')->references('id')->on('orders')->name('orders_id')->index();
            $table->timestamp('payment_date')->nullable();
            $table->timestamp('due_date');
            $table->foreignId('status_id')->references('id')->on('status')->name('invoice_status_id')->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
