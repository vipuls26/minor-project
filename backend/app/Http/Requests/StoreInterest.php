<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreInterest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'min:3',
                'max:30',
            ],

            'email' => [
                'required',
                'string',
                'email',
                'max:100',
            ],

            'mobile_no' => [
                'required',
                'digits:10',
            ],
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'Name is required',
            'name.string' => 'Name must be a valid text value',
            'name.min' => 'Name must be at least 3 characters',
            'name.max' => 'Name must not exceed 30 characters',

            'email.required' => 'Email is required',
            'email.string' => 'Email must be a valid text value',
            'email.email' => 'Email must be a valid email address',
            'email.max' => 'Email must not exceed 100 characters',

            'mobile_no.required' => 'Mobile number is required',
            'mobile_no.digits' => 'Mobile number must be exactly 10 digits',
        ];
    }
}
