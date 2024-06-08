<?php

use App\Http\Controllers\UserController;
use App\Models\Permission;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/registrar', [App\Http\Controllers\AuthController::class, 'registrar']);
Route::get('/autenticar', [App\Http\Controllers\AuthController::class, 'autenticar']);


Auth::routes();

/**  ALL ROUTES **/
Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');

/**  STORE ROUTES **/
Route::prefix('store')->group(function () {
    Route::get('/shop', [App\Http\Controllers\ShopController::class, 'index'])->name('shop');
    Route::get('/checkout/{id}', [App\Http\Controllers\ShopController::class, 'checkout'])->name('checkout');
});

/**  USER ROUTES **/
Route::prefix('user')->group(function () {
    
});

/**  ADMIN ROUTES **/
Route::prefix('admin')->group(function () {
    Route::get('/users', [App\Http\Controllers\UserController::class, 'index'])->name('users')
        ->can('hasPermission', Permission::class);
    Route::get('/permissions', [App\Http\Controllers\PermissionController::class, 'index'])->name('permissions')
        ->can('hasPermission', Permission::class);
    Route::get('/status', [App\Http\Controllers\StatusController::class, 'index'])->name('status')
        ->can('hasPermission', Permission::class);

    Route::get('/menus', [App\Http\Controllers\MenuController::class, 'index'])->name('menus')
        ->can('hasPermission', Permission::class);
    Route::get('/pages', [App\Http\Controllers\PageController::class, 'index'])->name('pages')
        ->can('hasPermission', Permission::class);
    Route::get('/categories', [App\Http\Controllers\CategoryController::class, 'index'])->name('categories')
        ->can('hasPermission', Permission::class);
    Route::get('/products', [App\Http\Controllers\ProductController::class, 'index'])->name('products')
        ->can('hasPermission', Permission::class);
});
