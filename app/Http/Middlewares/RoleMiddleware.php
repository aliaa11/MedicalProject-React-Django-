<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RoleMiddleware
{

    public function handle(Request $request, Closure $next, ...$roles)
    {

        if (Auth::check()) {

            $userRole = Auth::user()->role;


            if (in_array($userRole, $roles)) {
                return $next($request); 
            }
        }


        return redirect('/home')->with('error', 'You do not have access to this page.');
    }
}