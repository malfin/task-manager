<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description', 'crated_by'];

    public function creator()
    {
        return $this->belongsTo(User::class, 'crated_by');
    }

    public function members()
    {
        return $this->hasMany(ProjectMember::class);
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }
}
