<?php

namespace App\Livewire;

use App\Models\Status;
use Livewire\Component;

class StatusModal extends Component
{
    public $name;
    public $is_active;

    public $show = false;
    public Status $status;

    protected $rules = [
        'name' => 'required|min:4|max:200',
    ];

    protected $messages = [
        'name.required' => 'O :attribute não pode ser vazio.',
        'name.min' => 'O :attribute não pode ter menos que :min caracteres.',
        'name.max' => 'O :attribute não pode ter mais que :max caracteres.',
    ];

    public function openModal()
    {
        $this->resetValidation();
        $this->show = true;
        if (!empty($this->status->id)) {
            $this->name = $this->status->name;
            $this->is_active = $this->status->is_active;
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
        $status = new Status();
        if (!empty($this->status->id)) {
            $status = Status::find($this->status->id);
        }
        $status->name = $this->name;
        $status->is_active = $this->is_active;
        $status->save();
        return $this->redirect('/admin/status');
    }

    public function render()
    {
        return view('livewire.status-modal');
    }
}
