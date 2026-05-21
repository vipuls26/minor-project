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
            'name' => 'required|min:3|max:30|string',
            'email' => [
                'required',
                'email',
                'max:100',
            ],
            'mobile_no' => 'required|min:10|max:10|string',
        ];
    }

    public function messages()
    {
        return[
            'name.required' => 'Name is required',
            'name.min' => 'Name must be at least 3 characters',
            'name.max' => 'Name must not exceed 30 characters',
            'name.string' => 'Name must be in string format',


            'email.required' => 'Email is required',
            'email.email' => 'Email must be a valid email address',
            'email.unique' => 'Register using another email address',

            'mobile_no.required' => 'Mobile number is required',
            'mobile_no.min' => 'Mobile number not more than 10 digit'

        ];
    }
}
