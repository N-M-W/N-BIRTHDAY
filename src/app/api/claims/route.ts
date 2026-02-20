import { NextRequest, NextResponse } from "next/server";
import { getAllClaims, claimGift, unclaimGift } from "@/lib/db";

// GET /api/claims — get all claims
export async function GET() {
  try {
    const claims = await getAllClaims();
    return NextResponse.json({ claims });
  } catch (error) {
    console.error("DB error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST /api/claims — claim a gift
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { giftId, name } = body;

    if (!giftId || !name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "giftId et name sont requis" },
        { status: 400 }
      );
    }

    const cleanName = name.trim().slice(0, 30);
    const success = await claimGift(giftId, cleanName);

    if (!success) {
      return NextResponse.json(
        { error: "Ce cadeau est déjà réservé" },
        { status: 409 }
      );
    }

    const claims = await getAllClaims();
    return NextResponse.json({ success: true, claims });
  } catch (error) {
    console.error("DB error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// DELETE /api/claims — unclaim a gift
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { giftId } = body;

    if (!giftId) {
      return NextResponse.json(
        { error: "giftId est requis" },
        { status: 400 }
      );
    }

    await unclaimGift(giftId);
    const claims = await getAllClaims();
    return NextResponse.json({ success: true, claims });
  } catch (error) {
    console.error("DB error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
