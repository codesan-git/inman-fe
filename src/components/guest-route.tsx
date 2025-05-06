import { useNavigate } from "@solidjs/router";
import { createEffect, JSX, Show, Switch, Match } from "solid-js";
import { useUser } from '../UserContext';
import AppLoader from "./common/AppLoader";

type GuestRouteProps = {
  children: JSX.Element;
};

export default function GuestRoute(props: GuestRouteProps) {
  const user = useUser();
  const navigate = useNavigate();

  createEffect(() => {
    if (user.data) {
      navigate("/", { replace: true });
    }
  });

  return (
    <Switch>
      <Match when={user.isLoading}>
        <AppLoader />
      </Match>
      <Match when={user.data}>
        {/* Sudah login, redirect pakai navigate (side effect) */}
        <></>
      </Match>
      <Match when={!user.data && !user.isLoading}>
        {props.children}
      </Match>
    </Switch>
  );
}
