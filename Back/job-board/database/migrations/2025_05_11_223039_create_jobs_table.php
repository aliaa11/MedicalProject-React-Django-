<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('jobs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employer_id')->constrained('users')->onDelete('cascade');
            $table->string('title');
            $table->text('description');
            $table->text('responsibilities');
            $table->text('skills');
            $table->text('technologies');
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
            $table->string('location');
            $table->string('experience_level');
            $table->string('work_type');
            $table->string('salary_range');
            $table->text('benefits')->nullable();
            $table->date('deadline');
            $table->string('status')->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jobs');
    }
};
