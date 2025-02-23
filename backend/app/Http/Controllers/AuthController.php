<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\RegistrationRequest;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'register']]);
    }

    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login()
    {
        $credentials = request(['username', 'password']);

        if (!$token = auth()->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return $this->respondWithToken($token);
    }

    public function register(RegistrationRequest $request)
    {
        // Получаем валидированные данные
        $data = $request->validated();
        
        // Обработка загрузки фото
        if ($request->hasFile('photo_url')) {
            $datePath = now()->format('Y/m/d');
            $username = $data['username'];
            $path = $request->file('photo_url')->storeAs(
                "photos/{$datePath}/{$username}",
                $request->file('photo_url')->getClientOriginalName(),
                'public'
            );
            $data['photo_url'] = $path;
        }
        $data['password'] = Hash::make($data['password']);

        // Создаем пользователя
        $user = User::create($data);

        // Возвращаем успешный ответ
        return response()->json([
            'message' => 'Пользователь успешно зарегистрирован!',
            'user' => $user,
        ], 201);
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me()
    {
        return response()->json([
            'message' => 'Информация о пользователе',
            'user' => auth()->user()
        ]);
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        auth()->logout();

        return response()->json(['message' => 'Вы успешно вышли из аккаунта!']);
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return $this->respondWithToken(auth()->refresh());
    }

    /**
     * Get the token array structure.
     *
     * @param string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60
        ]);
    }
}
