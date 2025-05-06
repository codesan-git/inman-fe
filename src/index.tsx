/* @refresh reload */
import { render } from 'solid-js/web'
import { JSX, lazy, Show, Suspense, type ParentProps } from 'solid-js';
import { Router } from "@solidjs/router";
import './app.css'

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/solid-query';
import { ToastProvider } from "~/components/common/ToastContext";
import { SidebarProvider } from '~/components/ui/sidebar';
import CustomSidebar from './components/common/custom-sidebar';

import { useLocation } from "@solidjs/router";
import { useUser } from './UserContext';
import GuestRoute from './components/guest-route';
import ProtectedRoute from './components/protected-route';
import AppLoader from './components/common/AppLoader';

const root = document.getElementById('root')
const queryClient = new QueryClient()

const Home = lazy(() => import("./pages/home"));
const Users = lazy(() => import("./pages/users"));
const Auth = lazy(() => import("./pages/auth"));
const Items = lazy(() => import("./pages/items"));
const ItemDetail = lazy(() => import("./pages/items-detail"));
const AboutPage = lazy(() => import("./pages/about"));
const Register = lazy(() => import("./pages/register"));
const Dashboard = lazy(() => import("./pages/dashboard"));
const Settings = lazy(() => import("./pages/settings"));
const Logs = lazy(() => import("./pages/logs"));
const LookupsConfig = lazy(() => import("./pages/lookups-config"));

function Layout(props: ParentProps) {
  const location = useLocation();
  const user = useUser();
  return (
    <SidebarProvider>
      <div class="flex h-screen w-full">
        <Show when={location.pathname !== "/login" && user.data}>
          <CustomSidebar />
        </Show>
        <main class="flex-1 overflow-auto">
          {props.children}
        </main>
      </div>
    </SidebarProvider>
  )
}

// Komponen wrapper untuk Layout dengan children yang dipass langsung
function LayoutWrapper(props: { Component: JSX.Element }) {
  return (
    <Layout>
      {props.Component}
    </Layout>
  );
}

const routes = [
  // Public route
  {
    path: "/about",
    component: AboutPage
  },
  // Guest-only routes
  {
    path: "/login",
    component: () => <GuestRoute><Auth /></GuestRoute>
  },
  {
    path: "/register",
    component: () => <GuestRoute><Register /></GuestRoute>
  },
  // Protected routes - menggunakan wrapper untuk memastikan children dirender dengan benar
  {
    path: "/",
    component: () => <ProtectedRoute><LayoutWrapper Component={<Home />} /></ProtectedRoute>
  },
  {
    path: "/dashboard",
    component: () => <ProtectedRoute><LayoutWrapper Component={<Dashboard />} /></ProtectedRoute>
  },
  {
    path: "/settings",
    component: () => <ProtectedRoute><LayoutWrapper Component={<Settings />} /></ProtectedRoute>
  },
  {
    path: "/lookups-config",
    component: () => <ProtectedRoute><LayoutWrapper Component={<LookupsConfig />} /></ProtectedRoute>
  },
  {
    path: "/users",
    component: () => <ProtectedRoute><LayoutWrapper Component={<Users />} /></ProtectedRoute>
  },
  {
    path: "/items",
    component: () => <ProtectedRoute><LayoutWrapper Component={<Items />} /></ProtectedRoute>
  },
  {
    path: "/items/:id",
    component: () => <ProtectedRoute><LayoutWrapper Component={<ItemDetail />} /></ProtectedRoute>
  },
  {
    path: "/logs",
    component: () => <ProtectedRoute><LayoutWrapper Component={<Logs />} /></ProtectedRoute>
  }
]

import { UserProvider } from './UserContext';

render(
  () => <QueryClientProvider client={queryClient}>
    <UserProvider>
      <ToastProvider>
        <Suspense fallback={<AppLoader />}>
          <Router>{routes}</Router>
        </Suspense>
      </ToastProvider>
    </UserProvider>
  </QueryClientProvider>,
  root!
)


// Register service worker (only on HTTPS or localhost)
if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').catch(console.error);
  });
}
