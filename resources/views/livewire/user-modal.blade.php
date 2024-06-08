<div>
    <button wire:click="openModal" class="btn btn-info btn-sm" data-toggle="modal" data-target="#modal{{ $user->id }}">
        <i class="fas fa-pen"></i> Editar
    </button>

    <form wire:submit.prevent="save()">
        <x-dialog-modal wire:model="show" id="modal{{ $user->id }}">
            <x-slot name="title">
                <div class="modal-header">
                    <h4 class="modal-title">Configuração do Usuário</h4>
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
                        <div>
                            @error('name')
                                <span class="error invalid-feedback">{{ $message }}</span>
                            @enderror
                        </div>
                    </div>
                    <div class="form-group">
                        <x-label for="path" value="{{ __('Email') }}" />
                        <x-input id="path" type="text" class="mt-1 block w-full" value="{{ $user->email }}"
                            autocomplete="email" disabled />
                        <x-input-error for="path" class="mt-2" />
                    </div>
                    <div class="form-group">
                        <div class="form-group">
                            <x-label for="permission" value="{{ __('Permissão') }}" />
                            <select id="permission" class="custom-select" wire:model="permission_id">
                                @foreach ($permissions as $permission)
                                    <option value="{{ $permission->id }}" :key>
                                        {{ $permission->name }}
                                    </option>
                                @endforeach
                            </select>
                            @error('permission_id')
                                <span class="error invalid-feedback">{{ $message }}</span>
                            @enderror
                        </div>
                    </div>
                    <div class="form-group">
                        <x-checkbox id="active" autocomplete="is_active" wire:model="is_active" :checked="isset($user) && $user->is_active" />
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
    </form>
</div>
