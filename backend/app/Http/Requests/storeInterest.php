<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class storeInterest extends FormRequest
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
            'name.required' => 'name is required',
            'name.min' => 'name must be at least 3 characters',
            'name.max' => 'name must not exceed 30 characters',
            'name.string' => 'name must be in string format',


            'email.required' => 'email is required',
            'email.email' => 'email must be a valid email address',
            'email.unique' => 'register using another email address',

            'mobile_no.required' => 'mobile number is required',
            'mobile_no.min' => 'mobile number not more than 10 digit'

        ];
    }
}
