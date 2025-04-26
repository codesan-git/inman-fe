import { createSignal, Show } from "solid-js";
import { A, useLocation } from "@solidjs/router";
import { useMe } from "~/hooks/useMe";
import { useLogout } from "~/hooks/useAuth";

const menuItems = [
  { title: "Dashboard", url: "/" },
  { title: "Users", url: "/users" },
  { title: "Items", url: "/items" },
  { title: "Settings", url: "/settings" },
];

export default function CustomSidebar() {
  const [open, setOpen] = createSignal(false);
  const location = useLocation();
  const user = useMe();
  const { logout } = useLogout();

  return (
    <>
      {/* Hamburger button for mobile */}
      <button
        class="fixed top-4 left-4 z-50 md:hidden bg-sidebar text-sidebar-foreground rounded p-2 shadow"
        onClick={() => setOpen(true)}
        aria-label="Open sidebar"
      >
        {/* Hamburger Icon */}
        <svg width="24" height="24" fill="none" stroke="currentColor">
          <path stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay for mobile - PAGE overlay, not drawer */}
      <Show when={open()}>
        <div
          class="fixed inset-0 bg-gray-500/20 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setOpen(false)}
        />
      </Show>

      {/* Sidebar */}
      <aside
        class={`
          fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-primary via-primary/80 via-40% to-primary/60 md:bg-sidebar text-sidebar-foreground flex flex-col shadow-lg z-50 overflow-hidden
          transition-transform duration-300
          ${open() ? "translate-x-0" : "-translate-x-full"}
          md:static md:translate-x-0 md:block after:content-[''] after:absolute after:inset-0 after:bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] after:from-white/10 after:to-transparent after:pointer-events-none after:z-0
          ${open() ? 'after:md:hidden after:bg-gray-200/50 after:mix-blend-multiply' : ''}
          ${open() ? 'backdrop-blur-lg bg-white/40 md:bg-sidebar/100' : ''}
        `}
        style="will-change: transform;"
      >
        <div class="px-6 py-4 font-bold text-xl border-b border-sidebar-border flex justify-between items-center text-neutral-50">
          <Show when={user.data}>
            {user.data?.name}
          </Show>
          {/* Close button for mobile */}
          <button
            class="md:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close sidebar"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor">
              <path stroke-width="2" d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
        </div>
        <nav class="flex-1 px-4 py-6 flex flex-col gap-2 text-neutral-50">
          {menuItems.map(item => {
            const isActive = location.pathname === item.url;
            return (
              <A
                href={item.url}
                activeClass="bg-sidebar-accent text-sidebar-accent-foreground"
                class={`block rounded-md px-3 py-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors text-neutral-50 ${isActive ? "font-bold text-lg drop-shadow-[0_1px_6px_rgba(255,255,255,0.12)]" : ""}`}
                onClick={() => setOpen(false)} // close on mobile nav
              >
                {item.title}
              </A>
            );
          })}

          {/* Logout button */}
          <button
            onClick={() => logout()}
            class="mt-auto block rounded-md px-3 py-2 hover:bg-red-500 hover:text-white transition-colors text-neutral-50 border border-red-400/30 cursor-pointer"
          >
            <div class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Logout
            </div>
          </button>
        </nav>
        <div class="px-6 py-4 border-t border-sidebar-border text-xs text-neutral-50/80">
          &copy; {new Date().getFullYear()} InMan
        </div>
      </aside>
    </>
  );
}
