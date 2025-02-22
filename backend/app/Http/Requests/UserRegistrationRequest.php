<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserRegistrationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'username' => 'required|string|max:255|unique:users|regex:/^[A-Za-z0-9]+$/',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'photo_url' => 'nullable|string',
        ];
    }

    public function messages()
    {
        return [
            'username.required' => 'Имя пользователя обязательное для заполнения!',
            'username.regex' => 'Имя пользователя может содержать только английские буквы и цифры.',
            'username.unique' => 'Имя пользователя уже занято.',
            'email.required' => 'Почта обязательная для заполнения!',
            'email.unique' => 'Этот адрес электронной почты уже занят.',
            'password.required' => 'Пароль обязательный для заполнения!',
            'password.confirmed' => 'Пароли не совпадают!',
        ];
    }
}
