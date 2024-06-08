<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::post('registrar', [App\Http\Controllers\AuthController::class, 'store']);
    Route::post('autenticar', [App\Http\Controllers\AuthController::class, 'verify']);
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
