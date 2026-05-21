<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Event extends Model
{
    protected $fillable = ['name', 'category', 'location', 'start_date', 'status', 'end_date', 'capacity', 'image_path'];

    protected $appends = ['image_url'];

    public function interests()
    {
        return $this->hasMany(Interest::class);
    }

    public function getImageUrlAttribute(): ?string
    {
        if (!$this->image_path) {
            return null;
        }

        return Storage::disk('public')->url($this->image_path);
    }
}
