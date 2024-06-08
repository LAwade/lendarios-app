<div>
    @if (empty($menu->id))
        <button wire:click="openModal" class="btn btn-info btn-sm" data-toggle="modal" data-target="#modal_new">
            <i class="fas fa-plus"></i> Novo Menu
        </button>
    @else
        <button wire:click="openModal" class="btn btn-info btn-sm" data-toggle="modal"
            data-target="#modal{{ $menu->id }}">
            <i class="fas fa-pen"></i> Editar
        </button>
        <button class="btn btn-danger btn-sm" wire:click="delete">
            <i class="fas fa-trash"></i>
            Deletar
        </button>
    @endif

    <x-dialog-modal wire:model="show" id="modal{{ empty($menu->id) ? '_new' : $menu->id }}">
        <x-slot name="title">
            <div class="modal-header">
                <h4 class="modal-title">Configuração Menu</h4>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true" wire:click="closeModal">×</span>
                </button>
            </div>
        </x-slot>
        <x-slot name="content">
            <div class="modal-body">
                <div class="form-group">
                    <x-label for="name" value="{{ __('Nome') }}" />
                    <x-input id="name" type="text" class="mt-1 block w-full" required autocomplete="name"
                        wire:model="name" />
                    <x-input-error for="name" class="mt-2" />
                    @error('name')
                        <span class="error invalid-feedback">{{ $message }}</span>
                    @enderror
                </div>
                <div class="form-group">
                    <x-label for="icon" value="{{ __('Icone') }}" />
                    <x-input id="icon" type="text" class="mt-1 block w-full" autocomplete="icon"
                        wire:model="icon" />
                    <x-input-error for="icon" class="mt-2" />
                    @error('icon')
                        <span class="error invalid-feedback">{{ $message }}</span>
                    @enderror
                </div>
                <div class="form-group">
                    <x-label for="postion" value="{{ __('Posição') }}" />
                    <x-input id="postion" type="number" class="mt-1 block w-full" autocomplete="position"
                        wire:model="position" />
                    <x-input-error for="position" class="mt-2" />
                    @error('position')
                        <span class="error invalid-feedback">{{ $message }}</span>
                    @enderror
                </div>
                <div class="form-group">
                    <x-label for="path" value="{{ __('Caminho') }}" />
                    <x-input id="path" type="text" class="mt-1 block w-full" autocomplete="path"
                        wire:model="path" />
                    <x-input-error for="path" class="mt-2" />
                    @error('path')
                        <span class="error invalid-feedback">{{ $message }}</span>
                    @enderror
                </div>
                <div class="form-group">
                    <x-checkbox id="active" autocomplete="is_active" wire:model="is_active" />
                    <x-label for="active" value="{{ __('Ativo') }}" />
                </div>
            </div>
        </x-slot>
        <x-slot name="footer">
            <div class="modal-footer">
                <x-button type="submit">Salvar</x-button>
                <button type="button" class="btn btn-default" wire:click="closeModal" data-dismiss="modal">
                    Fechar
                </button>
            </div>
        </x-slot>
    </x-dialog-modal>

</div>
