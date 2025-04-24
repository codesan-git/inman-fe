import { A } from "@solidjs/router";

const menuItems = [
  { title: "Dashboard", url: "/" },
  { title: "Users", url: "/users" },
  { title: "Settings", url: "/settings" },
];

export default function CustomSidebar() {
  return (
    <aside class="w-64 h-screen bg-sidebar text-sidebar-foreground flex flex-col shadow-lg">
      <div class="px-6 py-4 font-bold text-xl border-b border-sidebar-border">
        InMan
      </div>
      <nav class="flex-1 px-4 py-6 flex flex-col gap-2">
        {menuItems.map(item => (
          <A
            href={item.url}
            activeClass="bg-sidebar-accent text-sidebar-accent-foreground"
            class="block rounded-md px-3 py-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          >
            {item.title}
          </A>
        ))}
      </nav>
      <div class="px-6 py-4 border-t border-sidebar-border text-xs text-sidebar-foreground/70">
        &copy; {new Date().getFullYear()} InMan
      </div>
    </aside>
  );
}
