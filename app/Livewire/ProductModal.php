<?php

namespace App\Livewire;

use App\Models\Category;
use App\Models\Product;
use Livewire\Component;

class ProductModal extends Component
{
    public $name;
    public $category_id;
    public $price;
    public $description;
    public $unity;
    public $split_payment;
    public $tax;
    public $image;
    public $is_active;

    public $show = false;
    public Product $product;

    protected $rules = [
        'name' => 'required|min:3|max:200',
        'category_id' => 'required|integer',
        'description' => 'required|min:4|max:200',
        'price' => 'required|numeric',
        'unity' => 'required|integer',
        'split_payment' => 'integer',
        'tax' => 'integer',
        'image' => 'min:4|max:200',
    ];

    protected $messages = [
        'name.required' => 'O :attribute não pode ser vazio.',
        'name.min' => 'O :attribute não pode ter menos que :min caracteres.',
        'name.max' => 'O :attribute não pode ter mais que :max caracteres.',
        ###
        'description.required' => 'O :attribute não pode ser vazio.',
        'description.min' => 'O :attribute não pode ter menos que :min caracteres.',
        'description.max' => 'O :attribute não pode ter mais que :max caracteres.',
        ##
        'category_id.required' => 'O :attribute não pode ser vazio.',
        'category_id.integer' => 'O :attribute deve ser númerico.',
        ##
        'price.required' => 'O :attribute não pode ser vazio.',
        'price.integer' => 'O :attribute deve ser númerico.',
        ##
        'unity.required' => 'O :attribute não pode ser vazio.',
        'unity.integer' => 'O :attribute deve ser númerico.',
        ##
        'split_payment.integer' => 'O :attribute não pode ser vazio.',
        'tax.integer' => 'O :attribute deve ser númerico.',
        ##
        'image.required' => 'O :attribute não pode ser vazio.',
        'image.min' => 'O :attribute não pode ter menos que :min caracteres.',
        'image.max' => 'O :attribute não pode ter mais que :max caracteres.',
    ];

    public function openModal()
    {
        $this->resetValidation();
        $this->show = true;
        if (!empty($this->product)) {
            $this->name = $this->product->name;
            $this->description = $this->product->description;
            $this->category_id = $this->product->category_id;
            $this->price = $this->product->price;
            $this->unity = $this->product->unity;
            $this->split_payment = $this->product->split_payment;
            $this->tax = $this->product->tax;
            $this->image = $this->product->image;
            $this->is_active = $this->product->is_active;
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
        $product = new Product();
        if (!empty($this->product->id)) {
            $product = Product::find($this->product->id);
        }

        $product->name = $this->name;
        $product->description = $this->description;
        $product->category_id = $this->category_id;
        $product->price = $this->price;
        $product->unity = $this->unity;
        $product->split_payment = $this->split_payment;
        $product->tax = $this->tax;
        $product->image = $this->image;

        $product->is_active = $this->is_active ?? false;
        $product->save();
        return $this->redirect('/admin/products');
    }

    public function delete()
    {
        $isDeleted = Product::destroy($this->product->id);
        if (!$isDeleted) {
            session()->flash('error', 'Não foi possível excluir o produto!');
        } else {
            session()->flash('success', 'Produto foi excluido com sucesso!');
        }
        return $this->redirect('/admin/products');
    }

    public function render()
    {
        return view('livewire.product-modal', [
            'products' => Product::orderBy('name')->get(),
            'categories' => Category::orderBy('name')->get()
        ]);
    }
}
