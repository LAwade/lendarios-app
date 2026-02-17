<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('team_speak_virtual_servers', function (Blueprint $table) {
            $table->string('dns_name')->nullable()->after('sid')->unique();
            $table->string('dns_record_id')->nullable()->after('dns_name');
        });
    }

    public function down(): void
    {
        Schema::table('team_speak_virtual_servers', function (Blueprint $table) {
            $table->dropColumn(['dns_name', 'dns_record_id']);
        });
    }
};
