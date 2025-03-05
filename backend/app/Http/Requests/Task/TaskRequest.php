<?php

namespace App\Http\Requests\Task;

use Illuminate\Foundation\Http\FormRequest;

class TaskRequest extends FormRequest
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
            'title' => 'required|string|max:255|unique:tasks',
            'description' => 'nullable|string',
            'deadline' => 'nullable|date',
            'status' => 'nullable|in:new,in_progress,completed,on_hold,cancelled',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Название задачи обязательно для заполнения.',
            'title.unique' => 'Задача с таким названием уже существует.',
            'status.in' => 'Недопустимый статус задачи.',
        ];
    }
}
