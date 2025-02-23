<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class RegistrationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'username' => 'required|unique:users,username',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'password_confirmation' => 'required',
            'photo_url' => 'nullable',
        ];
    }

    public function messages()
    {
        return [
            'username.required' => 'Логин обязателен для заполнения',
            'email.required' => 'Email обязателен для заполнения',
            'password.required' => 'Password обязателен для заполнения',
            'password.min' => 'Password не меньше 8 символов',
            'password.confirmed' => 'Подтверждение пароля не совпадает',
            'password_confirmation.required' => 'Подтверждение пароля обязательно для заполнения',
            'username.unique' => 'Данное имя пользователя уже занято',
            'email.unique' => 'Данный email уже занят',
            'email.email' => 'Введите корректный email',
            'photo_url.image' => 'Файл не является изображением',
        ];
    }
}
