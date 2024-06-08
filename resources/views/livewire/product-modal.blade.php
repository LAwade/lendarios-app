<div>
    @if (empty($product->id))
        <button wire:click="openModal" class="btn btn-info btn-sm" data-toggle="modal" data-target="#modal_new">
            <i class="fas fa-plus"></i> Novo Produto
        </button>
    @else
        <button wire:click="openModal" class="btn btn-info btn-sm" data-toggle="modal"
            data-target="#modal{{ $product->id }}">
            <i class="fas fa-pen"></i> Editar
        </button>
        <button class="btn btn-danger btn-sm" wire:click="delete">
            <i class="fas fa-trash"></i>
            Deletar
        </button>
    @endif

    <x-dialog-modal wire:model="show" id="modal{{ empty($product->id) ? '_new' : $product->id }}">
        <x-slot name="title">
            <div class="modal-header">
                <h4 class="modal-title">Configuração da Produtos</h4>
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
                    <div class="form-group">
                        <x-label for="category_id" value="{{ __('Categoria') }}" />
                        <select id="category_id" class="custom-select" wire:model="category_id" required>
                            @if(empty($category))
                            <option>Selecione uma opção</option>
                            @endif
                            @foreach ($categories as $category)
                                <option value="{{ $category->id }}" :key>{{ $category->name }}</option>
                            @endforeach
                        </select>
                        @error('category_id')
                            <span class="error invalid-feedback">{{ $message }}</span>
                        @enderror
                    </div>
                </div>
                <div class="form-group">
                    <x-label for="price" value="{{ __('Preço') }}" />
                    <x-input id="price" type="text" class="mt-1 block w-full" autocomplete="price"
                        wire:model="price" required />
                    <x-input-error for="price" class="mt-2" />
                    @error('price')
                        <span class="error invalid-feedback">{{ $message }}</span>
                    @enderror
                </div>
                <div class="form-group">
                    <x-label for="description" value="{{ __('Descrição') }}" />
                    <textarea id="description" type="text" class="form-control" rows="4" cols="50"
                        wire:model="description" required></textarea>
                    @error('description')
                        <span class="error invalid-feedback">{{ $message }}</span>
                    @enderror
                </div>
                <div class="form-group">
                    <x-label for="unity" value="{{ __('Unidade') }}" />
                    <x-input id="unity" type="number" class="mt-1 block w-full" autocomplete="unity"
                        wire:model="unity" required />
                    <x-input-error for="unity" class="mt-2" />
                    @error('unity')
                        <span class="error invalid-feedback">{{ $message }}</span>
                    @enderror
                </div>
                <div class="form-group">
                    <x-label for="split_payment" value="{{ __('Parcelamento') }}" />
                    <x-input id="split_payment" type="number" class="mt-1 block w-full" autocomplete="split_payment"
                        wire:model="split_payment" required />
                    <x-input-error for="split_payment" class="mt-2" />
                    @error('split_payment')
                        <span class="error invalid-feedback">{{ $message }}</span>
                    @enderror
                </div>
                <div class="form-group">
                    <x-label for="tax" value="{{ __('Taxa') }}" />
                    <x-input id="tax" type="number" class="mt-1 block w-full" autocomplete="tax"
                        wire:model="tax" />
                    <x-input-error for="tax" class="mt-2" required />
                    @error('tax')
                        <span class="error invalid-feedback">{{ $message }}</span>
                    @enderror
                </div>
                <div class="form-group">
                    <x-label for="image" value="{{ __('Imagem') }}" />
                    <x-input id="image" type="text" class="mt-1 block w-full" autocomplete="image"
                        wire:model="image" />
                    <x-input-error for="image" class="mt-2" />
                    @error('image')
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
