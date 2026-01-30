import { Routes } from "@angular/router";
import { AuthGuard } from "./core/guard/guard.routes";

export const routes: Routes = [
    {
        path: "",
        redirectTo: "/login",
        pathMatch: "full"
    },
    {
        path: "login",
        loadComponent: () => import("../app/features/auth/login/login.component").then((m) => m.LoginComponent)
    },
    {
        path: "task",
        canActivate: [AuthGuard],
        loadComponent: () => import("../app/features/tasks/card-tasks/card-tasks.component").then((m) => m.CardTasksComponent)
    },
    {
        path: "**",
        redirectTo: "login"
    }
];
