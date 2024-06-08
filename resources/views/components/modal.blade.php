@props(['id'])

@php
    $id = $id ?? md5($attributes->wire('model'));
@endphp

<div id="{{ $id }}" class="modal fade" tabindex="-1" aria-hidden="true" role="dialog" x-data="{ show: @entangle($attributes->wire('model')) }"
    x-on:close.stop="show = false" x-show="show" wire:ignore.self>
    <form wire:submit.prevent="save">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                {{ $slot }}
            </div>
        </div>
    </form>
</div>
