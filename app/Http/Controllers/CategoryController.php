<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Models\Category;
use Illuminate\Http\Response;
use Illuminate\Http\Request;
class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        
        $categories = Category::with('jobs')->get();

        if($categories->count() == 0) {
            return response()->json([
                'message' => 'No categories at the time!'
            ]);
        }
        return response()->json([
            "success" => true,
            'data' => $categories
        ]);
        
        
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCategoryRequest $request)
    {
        //
        $category = Category::create($request->all());

        return response()->json([
            "success" => true,
            'message' => 'Category created successfully',
            'data' => $category,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $category = Category::with('jobs')->find($id);
        if(!$category) {
            return response()->json([
                "success" => false,
                'message' => 'Category not found',
            ], 404);
        }

        return response()->json([
            "success" => true,
            'data' => $category,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCategoryRequest $request, string $id)
    {   
        $category = Category::with('jobs')->find($id);
        if(!$category) {
            return response()->json([
                "success" => false,
                'message' => 'Category not found',
            ], 404);
        }
        

        $category->update($request->validated());

        return response()->json([
            "success" => true,
            'message' => 'Category updated successfully',
            'data' => $category,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $category = Category::find($id);
        if(!$category) {
            return response()->json([
                'message' => 'Category not found',
            ], 404);
        }

        $category->delete();

        return response()->json([
            'message' => 'Category deleted successfully',
        ]);
    }
}
