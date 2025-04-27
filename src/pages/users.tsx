import { Switch, Match, Show } from "solid-js";
import { useGetUser } from "../hooks/useUser";
import UsersDataTable from "../components/users/data-table";
import UserInput from "../components/UserInput";

function Users() {
  const query = useGetUser();

  return (
    <div class="p-8">
      <h1 class="text-2xl font-bold mb-6 text-sidebar">Manajemen User</h1>
      <div class="flex flex-col md:flex-row gap-8">
        <div class="md:w-1/3">
          <div class="bg-white rounded-xl shadow p-6 border border-gray-100 mb-6">
            <h2 class="text-lg font-semibold mb-4 text-sidebar">Tambah User</h2>
            <UserInput />
          </div>
        </div>
        <div class="flex-1">
          <div class="bg-white rounded-xl shadow p-6 border border-gray-100">
            <h2 class="text-lg font-semibold mb-4 text-sidebar">Daftar User</h2>
            <Switch>
              <Match when={query.isPending}>
                <div>Loading...</div>
              </Match>
              <Match when={query.isError}>
                <div class="text-red-600">{query.error?.message}</div>
              </Match>
              <Match when={query.isSuccess}>
                <Show when={query.data}>
                  {(users) => <UsersDataTable users={users()} />}
                </Show>
              </Match>
            </Switch>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Users;
