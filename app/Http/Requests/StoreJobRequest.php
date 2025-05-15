<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreJobRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // You may want to adjust authorization logic based on your app's requirements
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'min:50'],
            'responsibilities' => ['required', 'string', 'min:30'],
            'skills' => ['required', 'string'],
            'technologies' => ['required', 'string'],
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'location' => ['required', 'string', 'max:255'],
            'experience_level' => ['required', 'string'],
            'work_type' => ['required', 'string', Rule::in(['remote', 'onsite', 'hybrid'])],
            'salary_range' => ['required', 'string', 'max:255'],
            'benefits' => ['required', 'string'],
            'deadline' => ['required', 'date', 'after:today'],
            'status' => ['required', 'string', Rule::in(['draft', 'published', 'closed'])],
            'employer_id' => ['required', 'integer', 'exists:users,id'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            
            'title.required' => 'The job title is required',
            'title.string' => 'The job title must be a text value',
            'title.max' => 'The job title cannot exceed 255 characters',
            

            'description.required' => 'The job description is required',
            'description.string' => 'The job description must be a text value',
            'description.min' => 'The job description should be at least 50 characters',
            
            
            'responsibilities.required' => 'The job responsibilities are required',
            'responsibilities.string' => 'The job responsibilities must be a text value',
            'responsibilities.min' => 'The job responsibilities should be at least 30 characters',
            
           
            'skills.required' => 'The required skills are required',
            'skills.string' => 'The skills must be a text value',
            
            
            'technologies.required' => 'The required technologies are required',
            'technologies.string' => 'The technologies must be a text value',
            
            
            'category_id.required' => 'The job category is required',
            'category_id.integer' => 'The category ID must be a number',
            'category_id.exists' => 'The selected category does not exist',
            
            
            'location.required' => 'The job location is required',
            'location.string' => 'The location must be a text value',
            'location.max' => 'The location cannot exceed 255 characters',
            
            
            'experience_level.required' => 'The experience level is required',
            'experience_level.string' => 'The experience level must be a text value',
            
            
            'work_type.required' => 'The work type is required',
            'work_type.string' => 'The work type must be a text value',
            'work_type.in' => 'The work type must be one of: remote, onsite, hybrid',
            
            
            'salary_range.required' => 'The salary range is required',
            'salary_range.string' => 'The salary range must be a text value',
            'salary_range.max' => 'The salary range cannot exceed 255 characters',
            
            
            'benefits.required' => 'The job benefits are required',
            'benefits.string' => 'The benefits must be a text value',
            
            
            'deadline.required' => 'The application deadline is required',
            'deadline.date' => 'The deadline must be a valid date',
            'deadline.after' => 'The deadline must be a date after today',
            
            
            'status.required' => 'The job status is required',
            'status.string' => 'The status must be a text value',
            'status.in' => 'The status must be one of: draft, published, closed',
            
            
            'employer_id.required' => 'The employer ID is required',
            'employer_id.integer' => 'The employer ID must be a number',
            'employer_id.exists' => 'The selected employer does not exist',
        ];
    }
}