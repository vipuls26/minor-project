<?php

namespace Tests\Feature;

use App\Models\Event;
use App\Models\Interest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EventCapacityUpdateTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_rejects_capacity_updates_below_registered_users(): void
    {
        $event = Event::create([
            'name' => 'Tech Expo',
            'location' => 'Hall A',
            'status' => 'active',
            'start_date' => now()->addDay(),
            'end_date' => now()->addDays(2),
            'capacity' => 5,
        ]);

        Interest::create([
            'name' => 'User One',
            'email' => 'user1@example.com',
            'mobile_no' => '1234567890',
            'event_id' => $event->id,
        ]);

        Interest::create([
            'name' => 'User Two',
            'email' => 'user2@example.com',
            'mobile_no' => '1234567891',
            'event_id' => $event->id,
        ]);

        $response = $this->postJson("/api/edit/{$event->id}", [
            'name' => 'Tech Expo',
            'location' => 'Hall A',
            'status' => 'active',
            'start_date' => now()->addDays(3)->toDateTimeString(),
            'end_date' => now()->addDays(4)->toDateTimeString(),
            'capacity' => 1,
        ]);

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors(['capacity']);

        $this->assertSame(5, $event->fresh()->capacity);
    }

    public function test_it_allows_capacity_updates_above_registered_users(): void
    {
        $event = Event::create([
            'name' => 'Tech Expo',
            'location' => 'Hall A',
            'status' => 'active',
            'start_date' => now()->addDay(),
            'end_date' => now()->addDays(2),
            'capacity' => 2,
        ]);

        Interest::create([
            'name' => 'User One',
            'email' => 'user1@example.com',
            'mobile_no' => '1234567890',
            'event_id' => $event->id,
        ]);

        $response = $this->postJson("/api/edit/{$event->id}", [
            'name' => 'Tech Expo Updated',
            'location' => 'Hall A',
            'status' => 'inactive',
            'start_date' => now()->addDays(3)->toDateTimeString(),
            'end_date' => now()->addDays(4)->toDateTimeString(),
            'capacity' => 4,
        ]);

        $response
            ->assertOk()
            ->assertJsonPath('capacity', 4);

        $updatedEvent = $event->fresh();

        $this->assertSame(4, $updatedEvent->capacity);
        $this->assertSame('Tech Expo Updated', $updatedEvent->name);
    }
}
