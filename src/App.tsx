import { AppSidebar } from "~/components/common/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar"
import { ParentProps } from "solid-js";

export default function Layout(props: ParentProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {props.children}
      </main>
    </SidebarProvider>
  )
}