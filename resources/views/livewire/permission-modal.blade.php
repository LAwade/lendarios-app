<div>
    @if (empty($permission->id))
        <button wire:click="openModal" class="btn btn-info btn-sm" data-toggle="modal" data-target="#modal_new">
            <i class="fas fa-plus"></i> Nova Permissão
        </button>
    @else
        <button wire:click="openModal" class="btn btn-info btn-sm" data-toggle="modal"
            data-target="#modal{{ $permission->id }}">
            <i class="fas fa-pen"></i> Editar
        </button>
        <button class="btn btn-danger btn-sm" wire:click="delete">
            <i class="fas fa-trash"></i>
            Deletar
        </button>
    @endif

    <x-dialog-modal wire:model="show" id="modal{{ empty($permission->id) ? '_new' : $permission->id }}" >
        <x-slot name="title">
            <div class="modal-header">
                <h4 class="modal-title">Configuração da Permissão</h4>
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
                    <x-label for="value" value="{{ __('Valor') }}" />
                    <x-input id="value" type="number" class="mt-1 block w-full" required autocomplete="value"
                        wire:model="value" />
                    <x-input-error for="value" class="mt-2" />
                    @error('value')
                        <span class="error invalid-feedback">{{ $message }}</span>
                    @enderror
                </div>
            </div>
            <x-slot name="footer">
                <div class="modal-footer">
                    <x-button type="submit">Salvar</x-button>
                    <button type="button" class="btn btn-default" wire:click="closeModal" data-dismiss="modal">
                        Fechar
                    </button>
                </div>
            </x-slot>
        </x-slot>
    </x-dialog-modal>
</div>
