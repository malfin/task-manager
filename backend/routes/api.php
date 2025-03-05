<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register'])->name('auth.register');
    Route::post('/login', [AuthController::class, 'login'])->name('auth.login');
    Route::post('/logout', [AuthController::class, 'logout'])->name('auth.logout');
    Route::post('/refresh', [AuthController::class, 'refresh'])->name('auth.refresh');
    Route::get('/me', [AuthController::class, 'me'])->name('auth.me');
});

Route::prefix('projects')->group(function () {
    Route::get('/', [ProjectController::class, 'index'])->name('project.index');
    Route::post('/create', [ProjectController::class, 'create'])->name('project.create');
    Route::post('/{projectId}/members', [ProjectController::class, 'addMember'])->name('project.add.member');
});

Route::prefix('projects/{projectId}')->group(function () {
    Route::get('/tasks', [TaskController::class, 'index'])->name('task.index');
    Route::post('/tasks/create', [TaskController::class, 'create'])->name('task.create');
    Route::put('/tasks/{taskId}/status', [TaskController::class, 'updateStatus'])->name('task.updateStatus');
});
