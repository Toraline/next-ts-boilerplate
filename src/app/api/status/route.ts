import { NextResponse } from "next/server";
import prisma from "infra/database";
import { RowVersion, RowMaxConnections } from "./status.types";

export async function GET() {
  try {
    const [{ server_version }] = await prisma.$queryRaw<RowVersion[]>`SHOW server_version;`;

    const [{ max_connections }] = await prisma.$queryRaw<
      RowMaxConnections[]
    >`SHOW max_connections;`;

    return NextResponse.json(
      {
        dependencies: {
          database: {
            server_version,
            max_connections: Number(max_connections),
          },
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching stats:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Failed to fetch status",
      },
      { status: 500 },
    );
  }
}
