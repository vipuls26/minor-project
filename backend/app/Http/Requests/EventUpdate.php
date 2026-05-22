<?php

namespace App\Http\Requests;

use App\Models\Event;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class EventUpdate extends FormRequest
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
            'name' => 'required|min:3|max:150|string',
            'category' => 'required|string|in:conference,workshop,meetup,webinar,hackathon,social',
            'location' => 'required|min:3|max:120|string',
            'start_date' => 'required|date|after:now',
            'end_date' => 'required|date|after:start_date',
            'capacity' => 'required|integer|min:1',
            'status' => 'required|string|in:active,inactive',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'remove_image' => 'nullable|boolean',
        ];
    }


    public function messages()
    {
        return [
            'name.required' => 'Event name is required',
            'name.min' => 'Event name must be more than 3 character',
            'name.max' => 'Event name not be more than 30 character',

            'category.required' => 'Event category is required',
            'category.in' => 'Select a valid event category',

            'location.required' => 'Event location is required',
            'location.min' => 'Event location must be more than 3 character',
            'location.max' => 'Event location must not be more than 120 characters',

            'start_date.required' => 'Event start date is required',
            'start_date.date' => 'Date must be a valid date and time',
            'start_date.after' => 'Event start date must be in the future',

            'end_date.required' => 'Event end date is required',
            'end_date.date' => 'Date must be a valid date and time',
            'end_date.after' => 'Event end date must be after the start date',

            'capacity.required' => 'Add total user capacity',
            'capacity.integer' => 'Capacity must be an integer',
            'capacity.min' => 'Capacity must be at least 1',

            'status.required' => 'Event status is required',
            'status.in' => 'Status must be either active or inactive',

            'image.image' => 'Event image must be a valid image file',
            'image.mimes' => 'Event image must be a JPG, PNG, or WEBP file',
            'image.max' => 'Event image size must not exceed 2 MB',
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
                    'Capacity cannot be less than the total registered users.'
                );
            }
        });
    }
}
