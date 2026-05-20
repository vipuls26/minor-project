<?php

namespace App\Http\Controllers;

use App\Http\Requests\eventStore;
use App\Http\Requests\eventUpdate;
use App\Models\Event;

class EventController extends Controller
{
    public function index()
    {
        $events = Event::withCount('interests')->latest()->get();
        return response()->json($events);
    }

    public function store(eventStore $request)
    {
        $validated = $request->validated();
        $event = Event::create($validated);

        return response()->json($event, 201);
    }

    public function update(eventUpdate $request, $id)
    {
        $event = Event::find($id);
        if (!$event) {
            return response()->json(['message' => 'Event not found'], 404);
        }

        $validated = $request->validated();
        $validated['status'] = $request['status'];
        $event->update($validated);

        return response()->json($event);
    }

    public function destroy($id)
    {
        $event = Event::find($id);
        if (!$event) {
            return response()->json(['message' => 'event not found'], 404);
        }
        $event->interests()->delete();
        $event->delete();
        return response()->json(['message' => 'Event deleted successfully'], 200);
    }

    public function activeEvent()
    {
        $activeEvents = Event::withCount('interests')->where('status', 'active')->latest()->get();
        return response()->json($activeEvents);
    }
}
