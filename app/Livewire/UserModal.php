<?php

namespace App\Livewire;

use App\Livewire\Forms\UserForm;
use App\Models\Permission;
use App\Models\User;
use Livewire\Component;

class UserModal extends Component
{
    public $name;
    public $permission_id;
    public $is_active;

    public $show = false;
    public User $user;

    protected $rules = [
        'name' => 'required|min:5|max:200',
        'permission_id' => 'required|integer'
    ];

    protected $messages = [
        'name.required' => 'O :attribute não pode ser vazio.',
        'name.min' => 'O :attribute não pode ter menos que :min caracteres.',
        'name.max' => 'O :attribute não pode ter mais que :max caracteres.',
 
        'permission_id.required' => 'O :attribute não pode ser vazio.',
        'permission_id.integer' => 'O :attribute deve ser númerico.',
    ];

    public function openModal()
    {
        $this->resetValidation();
        $this->show = true;
        if (!empty($this->user)) {
            $this->name = $this->user->name;
            $this->permission_id = $this->user->permission_id;
            $this->is_active = $this->user->is_active;
        }
    }

    public function closeModal()
    {
        $this->show = false;
    }

    public function save()
    {
        $user = new User();
        if (!empty($this->user->id)) {
            $user = User::find($this->user->id);
        }

        $user->name = $this->name;
        $user->permission_id = $this->permission_id;
        $user->is_active = $this->is_active ?? false;
        $user->save();
        return $this->redirect('/admin/users');
    }

    public function render()
    {
        return view('livewire.user-modal', [
            'permissions' => Permission::orderBy('value', 'desc')->get()
        ]);
    }
}
