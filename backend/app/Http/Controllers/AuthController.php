<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\RegistrationRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(RegistrationRequest $request)
    {
        // Получаем валидированные данные
        $data = $request->validated();

        // Хешируем пароль перед сохранением
        $data['password'] = Hash::make($data['password']);

        // Создаем пользователя
        $user = User::create($data);

        // Возвращаем успешный ответ
        return response()->json([
            'message' => 'Пользователь успешно зарегистрирован!',
            'user' => $user,
        ], 201);
    }
}
