<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRegistrationRequest;
use App\Models\User;

class AuthController extends Controller
{
    public function register(UserRegistrationRequest $request)
    {
        $data = $request->validated();
        $user = User::create($data);

        return response()->json([
            'message' => 'Пользователь успешно зарегистрирован',
            'user' => $user
        ], 201);

    }
}
