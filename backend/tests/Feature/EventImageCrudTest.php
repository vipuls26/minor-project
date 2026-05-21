<?php

namespace Tests\Feature;

use App\Models\Event;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class EventImageCrudTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_stores_an_uploaded_image_and_returns_image_url(): void
    {
        Storage::fake('public');

        $response = $this->post('/api/add', [
            'name' => 'Photo Meetup',
            'category' => 'meetup',
            'location' => 'Hall A',
            'start_date' => now()->addDay()->toDateTimeString(),
            'end_date' => now()->addDays(2)->toDateTimeString(),
            'capacity' => 25,
            'image' => UploadedFile::fake()->image('event.jpg'),
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('name', 'Photo Meetup');

        $event = Event::firstOrFail();

        $this->assertNotNull($event->image_path);
        Storage::disk('public')->assertExists($event->image_path);
        $response->assertJsonPath('image_url', Storage::disk('public')->url($event->image_path));
    }

    public function test_it_can_remove_an_existing_image_during_update(): void
    {
        Storage::fake('public');

        $path = UploadedFile::fake()->image('old-event.jpg')->store('events', 'public');

        $event = Event::create([
            'name' => 'Photo Meetup',
            'category' => 'meetup',
            'location' => 'Hall A',
            'status' => 'active',
            'start_date' => now()->addDay(),
            'end_date' => now()->addDays(2),
            'capacity' => 25,
            'image_path' => $path,
        ]);

        $response = $this->postJson("/api/edit/{$event->id}", [
            'name' => 'Photo Meetup',
            'category' => 'meetup',
            'location' => 'Hall A',
            'status' => 'active',
            'start_date' => now()->addDays(3)->toDateTimeString(),
            'end_date' => now()->addDays(4)->toDateTimeString(),
            'capacity' => 25,
            'remove_image' => true,
        ]);

        $response
            ->assertOk()
            ->assertJsonPath('image_url', null);

        Storage::disk('public')->assertMissing($path);
        $this->assertNull($event->fresh()->image_path);
    }
}
