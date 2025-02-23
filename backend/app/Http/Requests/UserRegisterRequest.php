<?php
/**
 * @author aleksejpuhov
 * File: UserRegisterRequest.php
 * Date: 23.02.2025
 * Time: 17:22
 */

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserRegisterRequest extends FormRequest
{
    public function rules()
    {
        return [

        ];
    }

    public function authorize()
    {
        return true;
    }
}
