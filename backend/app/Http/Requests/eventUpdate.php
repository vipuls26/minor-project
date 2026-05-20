<?php

namespace App\Http\Requests;

use App\Models\Event;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class eventUpdate extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|min:3|max:30|string',
            'location' => 'required|min:3|max:10|string',
            'start_date' => 'required|date|after:now',
            'end_date' => 'required|date|after:start_date',
            'capacity' => 'required|integer|min:1',
        ];
    }


    public function messages()
    {
        return [
            'name.required' => 'event name is required',
            'name.min' => 'event name must be more than 3 character',
            'name.max' => 'event name not be more than 30 character',

            'location.required' => 'event location is required',
            'location.min' => 'event location must be more than 3 character',
            'location.max' => 'event location not be more than 10 character',

            'start_date.required' => 'event start date is required',
            'start_date.date' => 'date must be a valid date and time',
            'start_date.after' => 'event start date must be in the future',

            'end_date.required' => 'event end date is required',
            'end_date.date' => 'date must be a valid date and time',
            'end_date.after' => 'event end date must be after the start date',

            'capacity.required' => 'add total user capacity',
            'capacity.integer' => 'capacity must be an integer',
            'capacity.min' => 'capacity must be at least 1',
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $eventId = $this->route('id');

            if (!$eventId || !$this->filled('capacity')) {
                return;
            }

            $event = Event::withCount('interests')->find($eventId);

            if (!$event) {
                return;
            }

            $newCapacity = (int) $this->input('capacity');

            if ($newCapacity < $event->interests_count) {
                $validator->errors()->add(
                    'capacity',
                    'capacity cannot be less than the total registered users.'
                );
            }
        });
    }
}
