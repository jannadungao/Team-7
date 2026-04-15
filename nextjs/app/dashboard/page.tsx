import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

export default async function DashboardPage() {


  return (
    <h1>Dashboard</h1>
  );
}
