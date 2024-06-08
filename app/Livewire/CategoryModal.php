<?php

namespace App\Livewire;

use App\Models\Category;
use Livewire\Component;

class CategoryModal extends Component
{
    public $name;
    public $description;
    public $is_active;

    public $show = false;
    public Category $category;

    protected $rules = [
        'name' => 'required|min:3|max:200',
        'description' => 'required|min:4|max:200',
    ];

    protected $messages = [
        'name.required' => 'O :attribute não pode ser vazio.',
        'name.min' => 'O :attribute não pode ter menos que :min caracteres.',
        'name.max' => 'O :attribute não pode ter mais que :max caracteres.',
        ###
        'description.required' => 'O :attribute não pode ser vazio.',
        'description.min' => 'O :attribute não pode ter menos que :min caracteres.',
        'description.max' => 'O :attribute não pode ter mais que :max caracteres.',
    ];

    public function openModal()
    {
        $this->resetValidation();
        $this->show = true;
        if (!empty($this->category)) {
            $this->name = $this->category->name;
            $this->description = $this->category->description;
            $this->is_active = $this->category->is_active;
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
        $category = new Category();
        if (!empty($this->category->id)) {
            $category = Category::find($this->category->id);
        }

        $category->name = $this->name;
        $category->description = $this->description;
        $category->is_active = $this->is_active ?? false;
        $category->save();
        return $this->redirect('/admin/categories');
    }

    public function delete()
    {
        $isDeleted = Category::destroy($this->category->id);
        if (!$isDeleted) {
            session()->flash('error', 'Não foi possível excluir o categoria!');
        } else {
            session()->flash('success', 'Categoria foi excluido com sucesso!');
        }
        return $this->redirect('/admin/categories');
    }

    public function render()
    {
        return view('livewire.category-modal');
    }
}
