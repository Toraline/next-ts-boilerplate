import { Button } from "global/ui";

export default function Page() {
  return (
    <div>
      <h1>Users</h1>
      <Button href="/admin/users/new"> Create User</Button>
    </div>
  );
}
