<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreInterest;
use App\Models\Event;
use App\Models\Interest;
use Illuminate\Support\Facades\DB;

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

    public function store(StoreInterest $request, $eventId)
    {

        return DB::transaction(function () use ($request, $eventId) {

            $event = Event::where('id', $eventId)
                ->lockForUpdate()
                ->first();

            if (!$event) {
                return response()->json([
                    'message' => 'Event not found'
                ], 404);
            }

            // prevent registration for inactive event
            if ($event->status !== 'active') {
                return response()->json([
                    'message' => 'This event is inactive.'
                ], 422);
            }

            // prevent registration for expired event
            if ($event->end_date < now()) {
                return response()->json([
                    'message' => 'This event has already ended.'
                ], 422);
            }

            // validating FE data
            $validated = $request->validated();

            // clean email
            $validated['email'] = strtolower(
                trim($validated['email'])
            );

            // check if already register
            $isExist = Interest::where('event_id', $event->id)
                ->where('email', $validated['email'])
                ->exists();

            if ($isExist) {
                return response()->json([
                    'message' => 'This email is already registered for this event.'
                ], 422);
            }

            // reload total count for current event
            $event->loadCount('interests');

            if (
                $event->capacity !== null &&
                $event->interests_count >= $event->capacity
            ) {
                return response()->json([
                    'message' => 'Event capacity has been reached.'
                ], 422);
            }

            // create user registration
            $interest = $event->interests()->create($validated);

            return response()->json($interest, 201);
        });
    }
}
