import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const response = await fetch(`${API_URL}/api/contacts/${id}`, {
      method: "DELETE",
      headers: { Accept: "application/json" },
    });

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[API] Error deleting contact:", error);
    return NextResponse.json(
      { message: "Failed to delete contact" },
      { status: 500 }
    );
  }
}