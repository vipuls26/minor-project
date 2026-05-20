<?php

namespace App\Http\Controllers;

use App\Http\Requests\storeInterest;
use App\Models\Event;
use App\Models\Interest;

class InterestController extends Controller
{
    public function index($eventId)
    {
        $event = Event::find($eventId);

        if (!$event) {
            return response()->json(['message' => 'Event not found'], 404);
        }

        return response()->json($event->interests()->latest()->get());
    }

    public function store(storeInterest $request, $eventId)
    {
        $event = Event::findOrFail($eventId);
        $validated = $request->validated();

        if ($event->capacity !== null && $event->interests()->count() >= $event->capacity) {
            return response()->json([
                'message' => 'Event capacity has been reached.'
            ], 422);
        }

        $isExist = Interest::where('event_id', $event->id)
            ->where('email', $validated['email'])
            ->exists();

        if ($isExist) {
            return response()->json([
                'message' => 'this email is already register in this event.'
            ], 422);
        }

        $interest = $event->interests()->create($validated);

        return response()->json($interest, 201);
    }
}
