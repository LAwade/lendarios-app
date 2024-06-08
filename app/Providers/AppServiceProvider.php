<?php

namespace App\Providers;

use App\Models\Menu;
use App\Models\Page;
use Illuminate\Bus\Dispatcher;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;
use JeroenNoten\LaravelAdminLte\Events\BuildingMenu;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        view()->composer('*', function ($view) {
            Event::listen(BuildingMenu::class, function (BuildingMenu $event) {
                $user = Auth::user();
                $menus = Menu::orderBy('position')->get();
                foreach ($menus as $menu) {
                    if($event->menu->itemKeyExists($menu->id)){
                        continue;
                    }

                    if($menu->path){
                        $event->menu->add([
                            'key' => $menu->id,
                            'text' => $menu->name,
                            'icon' => 'nav-icon ' . $menu->icon,
                            'url' => $menu->path
                        ]);
                    }    

                    $submenu = [];
                    $pages = Page::where('menu_id', '=', $menu->id)
                        ->where('perm_min', '<=', $user->permission->value)
                        ->where('perm_max', '>=', $user->permission->value)
                        ->orderBy('name', 'asc')
                        ->get();

                    foreach ($pages as $page) {
                        $submenu[] = [
                            'icon' => 'fa fa-angle-right nav-icon',
                            'text' => $page->name,
                            'url' => $page->path,
                        ];
                    }
                    if($submenu){
                        $event->menu->add([
                            'key' => $menu->id,
                            'text' => $menu->name,
                            'icon' => 'nav-icon ' . $menu->icon,
                            'submenu' => $submenu
                        ]);
                    }
                }
            });
        });
    }
}
