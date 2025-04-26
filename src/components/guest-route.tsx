import { useNavigate } from "@solidjs/router";
import { createEffect, JSX, Show } from "solid-js";
import { useMe } from "~/hooks/useMe";
import AppLoader from "./common/AppLoader";

type GuestRouteProps = {
  children: JSX.Element;
};

export default function GuestRoute(props: GuestRouteProps) {
  const user = useMe();
  const navigate = useNavigate();

  createEffect(() => {
    if (user.data) {
      navigate("/", { replace: true });
    }
  });

  return (
    <Show when={!user.isLoading && !user.data} fallback={<AppLoader />}>
      {props.children}
    </Show>
  );
}
