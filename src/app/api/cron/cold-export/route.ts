import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const admin = createAdminClient();
  const { data: images, error } = await admin
    .from("listing_images")
    .select("id,listing_id,url,created_at")
    .order("created_at", { ascending: false })
    .limit(10000);
  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 },
    );
  }

  const snapshot = {
    exported_at: new Date().toISOString(),
    count: images?.length ?? 0,
    images: images ?? [],
  };

  const filePath = `cold-exports/listing-images-${Date.now()}.json`;
  const upload = await admin.storage
    .from("invoices")
    .upload(filePath, JSON.stringify(snapshot), {
      contentType: "application/json",
      upsert: false,
    });
  if (upload.error) {
    return NextResponse.json(
      { ok: false, error: upload.error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, filePath, exported: snapshot.count });
}
