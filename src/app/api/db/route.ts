import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import {
  defaultGallery,
  defaultPlayers,
  defaultAchievements,
  defaultClubDetails,
} from "@/utils/db";

const getSeedData = () => ({
  gallery: defaultGallery,
  players: defaultPlayers,
  achievements: defaultAchievements,
  overrides: {},
  clubDetails: defaultClubDetails,
});

export async function GET() {
  try {
    const context = getCloudflareContext();
    const bucket = context.env.PGBROTHERS_BUCKET;

    if (!bucket) {
      console.warn("PGBROTHERS_BUCKET binding not found. Falling back to default seed data.");
      return NextResponse.json(getSeedData());
    }

    const object = await bucket.get("db.json");
    if (!object) {
      return NextResponse.json(getSeedData());
    }

    const dataText = await object.text();
    const data = JSON.parse(dataText);
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Failed to read from R2:", err);
    return NextResponse.json(getSeedData());
  }
}

export async function POST(request: Request) {
  try {
    const passcodeHeader = request.headers.get("x-admin-passcode");
    if (passcodeHeader !== "Target*Sports") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const context = getCloudflareContext();
    const bucket = context.env.PGBROTHERS_BUCKET;

    if (!bucket) {
      return new NextResponse("R2 Bucket Binding Missing", { status: 500 });
    }

    const body = await request.json();
    
    await bucket.put("db.json", JSON.stringify(body, null, 2), {
      httpMetadata: {
        contentType: "application/json",
      },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Failed to write to R2:", err);
    return new NextResponse(err.message || "Internal Server Error", { status: 500 });
  }
}
