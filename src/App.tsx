import './App.css'
import { Routes, Route } from "react-router";
import { RegisterPage } from '@/pages/register-page';
import { LoginPage } from '@/pages/login-page';
import { ConfirmEmail } from '@/pages/confirm-email';
import { VerifyEmailPage } from '@/pages/verify-email-page';
import { ProtectedRoute } from '@/components/guards/protected-route';
import { GuestRoute } from '@/components/guards/guest-route';
import { GoalsPage } from '@/pages/goals-page';
import { appRoutes } from '@/lib/constants/routes';
import { ProjectsPage } from '@/pages/projects/projects-page'
import { SystemsPage } from '@/pages/systems-page'
import { HabitsPage } from '@/pages/habits-page'
import { CreateProjectPage } from '@/pages/projects/create-project-page';
import { SidebarLayoutRoute } from '@/components/layouts/sidebar-layout/sidebar-layout-route';

function App() {

  return (
    <Routes>
      {/** Guest-only routes (redirects to / if authenticated) **/}
      <Route element={<GuestRoute />}>
        <Route path={appRoutes.REGISTER} element={<RegisterPage />} />
        <Route path={appRoutes.LOGIN} element={<LoginPage />} />
        <Route path={appRoutes.CONFIRM_EMAIL} element={<ConfirmEmail />} />
        <Route path={appRoutes.VERIFY_EMAIL} element={<VerifyEmailPage />} />
      </Route>

      {/** Protected routes **/}
      <Route element={<ProtectedRoute />}>
        <Route element={<SidebarLayoutRoute />}>
          <Route path={appRoutes.DASHBOARD} element={<p>Hello world</p>} />

          <Route path={appRoutes.GOALS.ROOT}>
            <Route index element={<GoalsPage />} />
          </Route>

          <Route path={appRoutes.PROJECTS.ROOT}>
            <Route index element={<ProjectsPage />} />
            <Route path={appRoutes.PROJECTS.CREATE} element={<CreateProjectPage />} />
          </Route>

          <Route path={appRoutes.SYSTEMS.ROOT}>
            <Route index element={<SystemsPage />} />
          </Route>

          <Route path={appRoutes.HABITS.ROOT}>
            <Route index element={<HabitsPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}

export default App
