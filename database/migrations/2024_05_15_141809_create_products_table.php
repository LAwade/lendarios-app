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
        Schema::create('products', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->foreignId('category_id')->references('id')->on('categories')->name('categories_id')->index();
            $table->float('price', 2, 0);
            $table->text('description')->nullable();
            $table->integer('unity')->default(1);
            $table->integer('split_payment')->default(1);
            $table->float('tax', 2, 0)->default(0);
            $table->boolean('is_active')->default(true);
            $table->string('image')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
