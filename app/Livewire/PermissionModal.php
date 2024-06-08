<?php

namespace App\Livewire;

use App\Models\Permission;
use Livewire\Component;

class PermissionModal extends Component
{
    public $name;
    public $value;

    public $show = false;
    public Permission $permission;

    protected $rules = [
        'name' => 'required|min:4|max:200',
        'value' => 'required|integer'
    ];

    protected $messages = [
        'name.required' => 'O :attribute não pode ser vazio.',
        'name.min' => 'O :attribute não pode ter menos que :min caracteres.',
        'name.max' => 'O :attribute não pode ter mais que :max caracteres.',
        'value.required' => 'O :attribute não pode ser vazio.',
        'value.integer' => 'O :attribute deve ser um númerico.',
    ];

    public function openModal()
    {
        $this->resetValidation();
        $this->show = true;
        if (!empty($this->permission->id)) {
            $this->name = $this->permission->name;
            $this->value = $this->permission->value;
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
        $permission = new Permission();
        if (!empty($this->permission->id)) {
            $permission = Permission::find($this->permission->id);
        }

        $permission->name = $this->name;
        $permission->value = $this->value;
        $permission->save();
        return $this->redirect('/admin/permissions');
    }

    public function delete()
    {
        $isDeleted = Permission::destroy($this->permission->id);
        if (!$isDeleted) {
            session()->flash('error', 'Não foi possível excluir a permissão!');
        } else {
            session()->flash('success', 'Permissão foi excluido com sucesso!');
        }
        return $this->redirect('/admin/permissions');
    }

    public function render()
    {
        return view('livewire.permission-modal');
    }
}
