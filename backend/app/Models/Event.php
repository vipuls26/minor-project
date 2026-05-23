<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Event extends Model
{
    protected $fillable = ['name', 'category', 'location', 'start_date', 'status', 'end_date', 'capacity', 'image_path'];

    // add extra add-on data in json response
    protected $appends = ['image_url'];

    public function interests()
    {
        return $this->hasMany(Interest::class);
    }

    // create image path for ready to use in frontend and avoid to hardcode domain in frontend
    public function getImageUrlAttribute(): ?string
    {
        // check if image path exist other-wise it will return null
        if (!$this->image_path) {
            return null;
        }

        return Storage::disk('public')->url($this->image_path);
    }
}
