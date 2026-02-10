import { Button } from "global/ui";
import UsersListView from "modules/users/components/views/UsersListView";

export default function Page() {
  return (
    <div>
      <h1>Users</h1>
      <UsersListView />
      <Button href="/admin/users/new"> Create User</Button>
    </div>
  );
}
