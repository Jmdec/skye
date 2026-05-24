import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Context = {
  params: Promise<{ id: string }> | { id: string };
};

async function resolveParams(
  params: Context["params"]
): Promise<{ id: string }> {
  return await Promise.resolve(params);
}

export async function PUT(
  req: NextRequest,
  { params }: Context
) {
  try {
    const { id } = await resolveParams(params);

    const body = await req.json();

    const res = await fetch(`${API_URL}/api/announcements/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { message: "Failed to update announcement" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: Context
) {
  try {
    const { id } = await resolveParams(params);

    const res = await fetch(`${API_URL}/api/announcements/${id}`, {
      method: "DELETE",
      headers: { Accept: "application/json" },
    });

    if (res.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { message: "Failed to delete announcement" },
      { status: 500 }
    );
  }
}