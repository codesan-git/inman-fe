/* @refresh reload */
import { render } from 'solid-js/web'
import { lazy, type ParentProps } from 'solid-js';
import { Router, Route } from "@solidjs/router";
import './app.css'

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/solid-query';
import { SidebarProvider, SidebarTrigger } from '~/components/ui/sidebar';
import { AppSidebar } from '~/components/common/app-sidebar';
import CustomSidebar from './components/common/custom-sidebar';

const root = document.getElementById('root')
const queryClient = new QueryClient()

const Home = lazy(() => import("./pages/home"));
const Users = lazy(() => import("./pages/users"));

function Layout(props: ParentProps) {
  return (
    <SidebarProvider>
      <div class="flex h-screen w-full">
        <CustomSidebar />
        <main class="flex-1 overflow-auto">
          {props.children}
        </main>
      </div>
    </SidebarProvider>
  )
}

const routes = {
  path: "/",
  component: Layout,
  children: [
    {
      path: "/",
      component: Home
    },
    {
      path: "/users",
      component: Users
    }
  ]
}

render(
  () =>
    <QueryClientProvider client={queryClient}>
      <Router>{routes}</Router>
    </QueryClientProvider>,
  root!
)
