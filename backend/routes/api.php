<?php

use App\Http\Controllers\EventController;
use App\Http\Controllers\InterestController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::get('/all', [EventController::class, 'index']);
Route::post('/add', [EventController::class, 'store']);

Route::post('/edit/{id}', [EventController::class, 'update']);
Route::delete('/delete/{id}', [EventController::class, 'destroy']);

Route::get('/active', [EventController::class, 'activeEvent']);

Route::get('/events/{eventId}/interests', [InterestController::class, 'index']);
Route::post('/events/{eventId}/interests', [InterestController::class, 'store']);


