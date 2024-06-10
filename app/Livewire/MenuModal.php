<?php

namespace App\Livewire;

use App\Livewire\Forms\MenuForm;
use App\Models\Menu;
use Livewire\Component;

class MenuModal extends Component
{
    public $name;
    public $icon;
    public $position;
    public $path;
    public $is_active;

    public $show = false;
    public Menu $menu;

    protected $rules = [
        'name' => 'required|min:3|max:200',
        'icon' => 'min:4|max:200',
        'path' => 'max:200',
        'position' => 'required|integer'
    ];

    protected $messages = [
        'name.required' => 'O :attribute não pode ser vazio.',
        'name.min' => 'O :attribute não pode ter menos que :min caracteres.',
        'name.max' => 'O :attribute não pode ter mais que :max caracteres.',
        'icon.min' => 'O :attribute não pode ter menos que :min caracteres.',
        'icon.max' => 'O :attribute não pode ter mais que :max caracteres.',
        'path.max' => 'O :attribute não pode ter mais que :max caracteres.',
        'position.required' => 'O :attribute não pode ser vazio.',
        'position.integer' => 'O :attribute deve ser númerico.',
    ];

    public function openModal()
    {
        $this->resetValidation();
        $this->show = true;
        if (!empty($this->menu)) {
            $this->name = $this->menu->name;
            $this->icon = $this->menu->icon;
            $this->position = $this->menu->position;
            $this->path = $this->menu->path;
            $this->is_active = $this->menu->is_active;
        }
    }

    public function closeModal()
    {
        $this->show = false;
    }

    public function updated($propertyName)
    {
        $this->validateOnly($propertyName);
    }

    public function save()
    {
        $this->validate();
        $menu = new Menu();
        if (!empty($this->menu->id)) {
            $menu = Menu::find($this->menu->id);
        }

        $menu->name = $this->name;
        $menu->icon = $this->icon;
        $menu->position = $this->position;
        $menu->path = $this->path;
        $menu->is_active = $this->is_active ?? false;
        $menu->save();
        return $this->redirect('/admin/menus');
    }

    public function delete()
    {
        $isDeleted = Menu::destroy($this->menu->id);
        if (!$isDeleted) {
            session()->flash('error', 'Não foi possível excluir o menu!');
        } else {
            session()->flash('success', 'Menu foi excluido com sucesso!');
        }
        return $this->redirect('/admin/menus');
    }

    public function render()
    {
        return view('livewire.menu-modal');
    }
}
