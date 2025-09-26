import { dbConnect } from "@/lib/db/db";
import Product from "@/models/product.model";
import { NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const userId = await getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get("q") || "").trim();

    const results = await Product.find({
      name: { $regex: query, $options: "i" },
      createdBy: userId,
    }).limit(10);
    Product.createIndexes({ name: "text" });
    return NextResponse.json(results);
  } catch (error: unknown) {
    console.error("Error fetching search results: ", error);
    return NextResponse.json(
      { message: "Error fetching search results: " + (error as Error).message },
      { status: 500 }
    );
  }
}
