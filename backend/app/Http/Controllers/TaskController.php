<?php

namespace App\Http\Controllers;

use App\Http\Requests\Task\TaskRequest;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;


class TaskController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    /**
     * @param $project_id
     * @return JsonResponse
     * Получение списка всех задач
     */
    public function index($project_id)
    {
        $project = Project::with('creator', 'tasks.assignees')->findOrFail($project_id);
        return response()->json([
            'message' => 'Задачи успешно получены',
            'project' => [
                'id' => $project->id,
                'name' => $project->name,
                'description' => $project->description,
                'created_by' => $project->creator->username,
                'created_at' => $project->created_at,
                'updated_at' => $project->updated_at,
                'tasks' => $project->tasks->map(function ($task) {
                    return [
                        'id' => $task->id,
                        'title' => $task->title,
                        'description' => $task->description,
                        'deadline' => $task->deadline,
                        'status' => $task->status,
                        'created_by' => $task->creator->username,
                        'project_id' => $task->project_id,
                        'created_at' => $task->created_at,
                        'updated_at' => $task->updated_at,
                        'assignees' => $task->assignees,
                    ];
                }),
            ],
        ]);
    }

    /**
     * @param TaskRequest $request
     * @param $project_id
     * @return JsonResponse
     * Создание задачи
     */

    public function create(Request $request, $project_id)
    {
        $project = Project::findOrFail($project_id);

        $task = new Task([
            'title' => $request->input('title'),
            'description' => $request->input('description'),
            'deadline' => $request->input('deadline'),
            'status' => $request->input('status', 'new'),
            'created_by' => auth()->id(),
            'project_id' => $project->id,
        ]);

        $task->save();

        if ($request->has('assignees')) {
            $task->assignees()->sync($request->input('assignees'));
        }

        return response()->json([
            'message' => 'Задача успешно создана',
            'task' => $task
        ], 201);

    }

    public function update(Request $request, $project_id, $task_id)
    {
        try {
            // Валидация входных данных
            $validatedData = $request->validate([
                'title' => 'sometimes|string|max:255',
                'description' => 'sometimes|string',
                'deadline' => 'sometimes|date',
                'status' => 'sometimes|string|in:pending,in_progress,completed,archived',
                'assignees' => 'sometimes|array',
                'assignees.*' => 'exists:users,id',
            ]);

            // Поиск задачи по ID и project_id
            $task = Task::where('project_id', $project_id)->findOrFail($task_id);

            if ($request->has('title')) {
                $task->title = $validatedData['title'];
            }
            if ($request->has('description')) {
                $task->description = $validatedData['description'];
            }
            if ($request->has('deadline')) {
                $task->deadline = $validatedData['deadline'];
            }
            if ($request->has('status')) {
                $task->status = $validatedData['status'];
            }

            // Сохранение изменений
            $task->save();

            // Обновление ответственных, если переданы
            if ($request->has('assignees')) {
                $task->assignees()->sync($validatedData['assignees']);
            }


            return response()->json([
                'message' => 'Задача успешно обновлена',
                'task' => $task
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Ошибка валидации',
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Произошла ошибка при обновлении задачи',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * @param $project_id
     * @param $task_id
     * @return JsonResponse
     * Обновление статуса задачи
     */
    public function updateStatus(Request $request, $project_id, $task_id)
    {
        $task = Task::where('project_id', $project_id)->findOrFail($task_id);
        $task->status = $request->input('status');
        $task->save();

        return response()->json([
            'message' => 'Статус задачи успешно обновлен',
            'task' => $task
        ]);
    }

    /**
     * Получение списка задач с фильтрацией, сортировкой и подгрузкой связанных данных
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function filter(Request $request)
    {
        try {
            // Фильтрация по проекту (если передан project_id)
            $query = Task::with(['project', 'assignees']);

            if ($request->has('project_id')) {
                $query->where('project_id', $request->input('project_id'));
            }


            if ($request->has('user_id')) {
                $query->whereHas('assignees', function ($q) use ($request) {
                    $q->where('user_id', $request->input('user_id'));
                });
            }


            if ($request->has('deadline')) {
                $query->where('deadline', $request->input('deadline'));
            }


            if ($request->has('sort_by')) {
                $sortField = $request->input('sort_by');
                $sortDirection = $request->input('sort_dir', 'asc'); // По умолчанию сортировка по возрастанию

                $allowedSortFields = ['title', 'deadline', 'created_at', 'status'];
                if (in_array($sortField, $allowedSortFields)) {
                    $query->orderBy($sortField, $sortDirection);
                }
            }

            $tasks = $query->get();

            return response()->json([
                'message' => 'Задачи успешно получены',
                'tasks' => $tasks
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Произошла ошибка при получении задач',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}
