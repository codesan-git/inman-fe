import { useNavigate } from "@solidjs/router";
import { createEffect, JSX } from "solid-js";
import { Show } from "solid-js";
import { useMe } from "~/hooks/useMe";

type ProtectedRouteProps = {
  children: JSX.Element;
};


export default function ProtectedRoute(props: ProtectedRouteProps) {
  const user = useMe();
  const navigate = useNavigate();

  createEffect(() => {
    if (!user.isLoading && !user.data) {
      navigate("/login", { replace: true });
    }
  });

  return (
    <Show when={!user.isLoading && user.data} fallback={<div>Loading...</div>}>
      {props.children}
    </Show>
  );
}
