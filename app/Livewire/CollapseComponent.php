<?php

namespace App\Livewire;

use Livewire\Component;

class CollapseComponent extends Component
{
    public $id;
    public $value = 'Mostrar Mais';

    public function show(){
        if($this->value == 'Mostrar Mais'){
            $this->value = 'Mostrar Menos';
        } else {
            $this->value = 'Mostrar Mais';
        }
    }

    public function render()
    {
        return view('livewire.components.collapse-component');
    }
}
