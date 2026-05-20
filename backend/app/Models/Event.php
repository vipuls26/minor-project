<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $fillable = ['name', 'location', 'start_date', 'status', 'end_date', 'capacity'];

    public function interests()
    {
        return $this->hasMany(Interest::class);
    }
}
