<?php

namespace App\Http\Controllers;

use App\Http\Requests\Task\TaskRequest;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;


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

}
