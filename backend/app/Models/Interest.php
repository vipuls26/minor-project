<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Interest extends Model
{
    protected $fillable = ['name', 'email', 'mobile_no', 'event_id'];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }
}
