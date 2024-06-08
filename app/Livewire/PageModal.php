<?php

namespace App\Livewire;

use App\Livewire\Forms\PageForm;
use App\Models\Menu;
use App\Models\Page;
use Livewire\Component;

class PageModal extends Component
{
    public $name;
    public $path;
    public $menu_id;
    public $perm_min;
    public $perm_max;
    public $is_active;

    public $show = false;
    public Page $page;

    protected $rules = [
        'name' => 'required|min:4|max:200',
        'path' => 'required|min:4|max:200',
        'menu_id' => 'required|integer',
        'perm_min' => 'required|integer',
        'perm_max' => 'required|integer'
    ];

    protected $messages = [
        'name.required' => 'O :attribute não pode ser vazio.',
        'name.min' => 'O :attribute não pode ter menos que :min caracteres.',
        'name.max' => 'O :attribute não pode ter mais que :max caracteres.',

        'path.required' => 'O :attribute não pode ser vazio.',
        'path.min' => 'O :attribute não pode ter menos que :min caracteres.',
        'path.max' => 'O :attribute não pode ter mais que :max caracteres.',

        'menu_id.required' => 'O :attribute não pode ser vazio.',
        'menu_id.integer' => 'O :attribute deve ser númerico.',

        'perm_min.required' => 'O :attribute não pode ser vazio.',
        'perm_min.integer' => 'O :attribute deve ser númerico.',

        'perm_max.required' => 'O :attribute não pode ser vazio.',
        'perm_max.integer' => 'O :attribute deve ser númerico.',
    ];

    public function openModal()
    {
        $this->resetValidation();
        $this->show = true;
        if (!empty($this->page)) {
            $this->name = $this->page->name;
            $this->path = $this->page->path;
            $this->menu_id = $this->page->menu_id;
            $this->perm_min = $this->page->perm_min;
            $this->perm_max = $this->page->perm_max;
            $this->is_active = $this->page->is_active;
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
        $page = new Page();
        if (!empty($this->page->id)) {
            $page = Page::find($this->page->id);
        }

        $page->name = $this->name;
        $page->path = $this->path;
        $page->menu_id = $this->menu_id;
        $page->perm_max = $this->perm_max;
        $page->perm_min = $this->perm_min;
        $page->is_active = $this->is_active ?? false;
        $page->save();
        return $this->redirect('/admin/pages');
    }

    public function delete()
    {
        $isDeleted = Page::destroy($this->page->id);
        if (!$isDeleted) {
            session()->flash('error', 'Não foi possível excluir o page!');
        } else {
            session()->flash('success', 'Page foi excluido com sucesso!');
        }
        return $this->redirect('/admin/pages');
    }
    public function render()
    {
        return view('livewire.page-modal', [
            'menus' => Menu::where('is_active', true)->orderBy('name')->get()
        ]);
    }
}
