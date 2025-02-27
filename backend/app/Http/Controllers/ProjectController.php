<?php

namespace App\Http\Controllers;

use App\Http\Requests\Project\AddMemberRequest;
use App\Http\Requests\Project\CreateProjectRequest;
use App\Models\Project;
use App\Models\ProjectMember;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }


    /**
     * Получить список всех проектов.
     */
    public function index(Request $request)
    {
        $projects = Project::all();

        $data = $projects->map(function ($project) {
            return [
                'id' => $project->id,
                'name' => $project->name,
                'description' => $project->description,
                'crated_by' => $project->creator->username,
                'created_at' => $project->created_at,
                'updated_at' => $project->updated_at,
            ];
        });

        return response()->json([
            'message' => 'Проекты успешно получены!',
            'projects' => $data,
        ]);
    }

    /**
     * Создать новый проект.
     */
    public function create(CreateProjectRequest $request)
    {
        $data = $request->validated();
        $project = Project::create([
            'name' => $data['name'],
            'description' => $data['description'],
            'crated_by' => auth()->id(),
        ]);

        ProjectMember::create([
            'project_id' => $project->id,
            'user_id' => auth()->id(),
            'role' => 'Администратор'
        ]);

        return response()->json([
            'message' => 'Проект успешно создан!',
            'project' => $project,
        ], 201);
    }

    /**
     * Добавить пользователя в проект.
     */

    public function addMember(AddMemberRequest $request, $projectId)
    {
        $data = $request->validated();

        $project = Project::findOrFail($projectId);
        if (!$project) {
            return response()->json(['error' => 'Проект не найден.'], 404);
        }
        $isAdmin = ProjectMember::where('project_id', $projectId)
            ->where('user_id', auth()->id())
            ->where('role', 'Администратор')
            ->exists();

        if (!$isAdmin) {
            return response()->json(['error' => 'У вас нет прав для добавления участников в этот проект.'], 403);
        }

        $existingMember = ProjectMember::where('project_id', $projectId)
            ->where('user_id', $data['user_id'])
            ->exists();

        if ($existingMember) {
            return response()->json(['error' => 'Этот пользователь уже является участником проекта.'], 409);
        }

        ProjectMember::create([
            'project_id' => $projectId,
            'user_id' => $data['user_id'],
            'role' => $data['role'],
        ]);

        return response()->json([
            'message' => 'Пользователь успешно добавлен в проект!',
        ], 201);
    }
}
