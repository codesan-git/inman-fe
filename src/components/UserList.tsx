import { Switch, Match, For } from "solid-js";
import { useGetUser } from "../hooks/useUser";
import UserEditDelete from "./UserEditDelete";
import { Card, CardHeader, CardTitle } from "./ui/card";

export default function UserList() {
  const query = useGetUser();

  return (
    <div class="flex flex-col gap-3">
      <Switch>
        <Match when={query.isPending}>
          <p>Loading...</p>
        </Match>
        <Match when={query.isError}>
          <p>Error: {query.isError.valueOf()}</p>
        </Match>
        <Match when={query.isSuccess}>
          <For each={query.data}>
            {(user) => (
              <Card>
                <CardHeader>
                  <CardTitle>{user.name} ({user.role})</CardTitle>
                </CardHeader>
                <UserEditDelete user={user} />
              </Card>
            )}
          </For>
        </Match>
      </Switch>
    </div>
  );
}
