<div>
    @if (empty($page->id))
        <button wire:click="openModal" class="btn btn-info btn-sm" data-toggle="modal" data-target="#modal_new">
            <i class="fas fa-plus"></i> Nova Página
        </button>
    @else
        <button wire:click="openModal" class="btn btn-info btn-sm" data-toggle="modal"
            data-target="#modal{{ $page->id }}">
            <i class="fas fa-pen"></i> Editar
        </button>
        <button class="btn btn-danger btn-sm" wire:click="delete">
            <i class="fas fa-trash"></i>
            Deletar
        </button>
    @endif

    <x-dialog-modal wire:model="show" id="modal{{ empty($page->id) ? '_new' : $page->id }}">
        <x-slot name="title">
            <div class="modal-header">
                <h4 class="modal-title">Configuração da Página</h4>
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
                    <x-label for="path" value="{{ __('Path') }}" />
                    <x-input id="path" type="text" class="mt-1 block w-full" autocomplete="path"
                        wire:model="path" />
                    <x-input-error for="path" class="mt-2" />
                    @error('path')
                        <span class="error invalid-feedback">{{ $message }}</span>
                    @enderror
                </div>
                <div class="form-group">
                    <div class="form-group">
                        <x-label for="menu" value="{{ __('Menu') }}" />
                        <select id="menu" class="custom-select" wire:model="menu_id">
                            @foreach ($menus as $menu)
                                <option value="{{ $menu->id }}" :key>{{ $menu->name }}</option>
                            @endforeach
                        </select>
                        @error('menu_id')
                            <span class="error invalid-feedback">{{ $message }}</span>
                        @enderror
                    </div>
                </div>
                <div class="form-group">
                    <x-label for="perm_min" value="{{ __('Permissão Mímina') }}" />
                    <x-input id="perm_min" type="number" class="mt-1 block w-full" autocomplete="perm_min"
                        wire:model="perm_min" />
                    <x-input-error for="perm_min" class="mt-2" />
                    @error('perm_min')
                        <span class="error invalid-feedback">{{ $message }}</span>
                    @enderror
                </div>
                <div class="form-group">
                    <x-label for="perm_max" value="{{ __('Permissão Máxima') }}" />
                    <x-input id="perm_max" type="number" class="mt-1 block w-full" autocomplete="perm_max"
                        wire:model="perm_max" />
                    <x-input-error for="perm_max" class="mt-2" />
                    @error('perm_max')
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
                <button type="button" class="btn btn-default" wire:click="closeModal"
                    data-dismiss="modal">Fechar</button>
            </div>
        </x-slot>
    </x-dialog-modal>
</div>
