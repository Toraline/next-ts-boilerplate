import { NextResponse } from "next/server";
import db from "infra/database";

export async function GET() {
  const client = await db.getNewClient();

  try {
    const databaseVersionResult = await client.query("SHOW server_version");
    const { server_version } = databaseVersionResult.rows[0];

    const databaseMaxConnectionsResult = await client.query(
      "SHOW max_connections;"
    );
    const { max_connections } = databaseMaxConnectionsResult.rows[0];

    const databaseName = process.env.POSTGRES_DB;
    const databaseConnectionsResult = await client.query({
      text: `SELECT count(*)::int FROM pg_stat_activity WHERE datname=$1;`,
      values: [databaseName],
    });
    const connections = databaseConnectionsResult.rows[0].count;

    return NextResponse.json(
      {
        dependencies: {
          database: {
            server_version,
            max_connections: Number(max_connections),
            connections,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({
      ok: false,
      error: "Failed to fetch status",
    });
  } finally {
    await client.end();
  }
}

export async function POST(request: Request) {
  const newCategory = await request.json();

  return Response.json(newCategory, { status: 201 });
}
