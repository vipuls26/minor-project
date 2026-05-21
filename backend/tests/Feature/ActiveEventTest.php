<?php

namespace Tests\Feature;

use App\Models\Event;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ActiveEventTest extends TestCase
{
    use RefreshDatabase;

    public function test_active_events_endpoint_excludes_ended_events(): void
    {
        $upcomingEvent = Event::create([
            'name' => 'Upcoming Meetup',
            'location' => 'Hall A',
            'status' => 'active',
            'start_date' => now()->addHour(),
            'end_date' => now()->addDay(),
            'capacity' => 25,
        ]);

        $ongoingEvent = Event::create([
            'name' => 'Ongoing Workshop',
            'location' => 'Room B',
            'status' => 'active',
            'start_date' => now()->subHour(),
            'end_date' => now()->addHours(2),
            'capacity' => 15,
        ]);

        $endedEvent = Event::create([
            'name' => 'Ended Session',
            'location' => 'Room C',
            'status' => 'active',
            'start_date' => now()->subDays(2),
            'end_date' => now()->subHour(),
            'capacity' => 10,
        ]);

        $inactiveEvent = Event::create([
            'name' => 'Inactive Event',
            'location' => 'Room D',
            'status' => 'inactive',
            'start_date' => now()->addDay(),
            'end_date' => now()->addDays(2),
            'capacity' => 10,
        ]);

        $response = $this->getJson('/api/active');

        $response
            ->assertOk()
            ->assertJsonCount(2)
            ->assertJsonFragment(['id' => $upcomingEvent->id, 'name' => 'Upcoming Meetup'])
            ->assertJsonFragment(['id' => $ongoingEvent->id, 'name' => 'Ongoing Workshop'])
            ->assertJsonMissing(['id' => $endedEvent->id, 'name' => 'Ended Session'])
            ->assertJsonMissing(['id' => $inactiveEvent->id, 'name' => 'Inactive Event']);
    }
}
