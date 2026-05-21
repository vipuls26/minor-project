<?php

namespace App\Http\Controllers;

use App\Http\Requests\eventStore;
use App\Http\Requests\eventUpdate;
use App\Models\Event;
use Illuminate\Support\Facades\Storage;

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

        if ($request->hasFile('image')) {
            $validated['image_path'] = $request->file('image')->store('events', 'public');
        }

        unset($validated['image']);

        $event = Event::create($validated);
        $event->loadCount('interests');

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

        if ($request->boolean('remove_image') && $event->image_path) {
            Storage::disk('public')->delete($event->image_path);
            $validated['image_path'] = null;
        }

        if ($request->hasFile('image')) {
            if ($event->image_path) {
                Storage::disk('public')->delete($event->image_path);
            }

            $validated['image_path'] = $request->file('image')->store('events', 'public');
        }

        unset($validated['image'], $validated['remove_image']);
        $event->update($validated);
        $event->loadCount('interests');

        return response()->json($event);
    }

    public function destroy($id)
    {
        $event = Event::find($id);
        if (!$event) {
            return response()->json(['message' => 'Event not found'], 404);
        }

        if ($event->image_path) {
            Storage::disk('public')->delete($event->image_path);
        }

        $event->interests()->delete();
        $event->delete();
        return response()->json(['message' => 'Event deleted successfully'], 200);
    }

    public function activeEvent()
    {
        $activeEvents = Event::withCount('interests')
            ->where('status', 'active')
            ->where('end_date', '>', now())
            ->latest()
            ->get();

        return response()->json($activeEvents);
    }
}
