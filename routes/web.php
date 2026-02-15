<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Qualquer rota que não comece com /api será tratada pelo React
Route::get('login', function () {
    return view('welcome');
})->name('login');

Route::get('{any}', function () {
    return view('welcome');
})->where('any', '^(?!api).*$');
