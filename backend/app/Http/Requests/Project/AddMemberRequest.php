<?php

namespace App\Http\Requests\Project;

use Illuminate\Foundation\Http\FormRequest;

class AddMemberRequest extends FormRequest
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
            'user_id' => 'required|exists:users,id',
            'role' => 'required|string|in:Администратор,Участник',
        ];
    }

    public function messages()
    {
        return [
            'user_id.required' => 'Пользователь обязательно для заполнения',
            'user_id.exists' => 'Пользователь не найден',
            'role.required' => 'Роль обязательно для заполнения'
        ];
    }
}
