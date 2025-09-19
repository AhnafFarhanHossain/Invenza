import { dbConnect } from "@/lib/db/db";
import Business from "@/models/business.model";
import { getUserIdFromRequest } from "@/lib/auth";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const business = await Business.findOne({ createdBy: userId });

    if (!business) {
      // Return default settings if no business record exists
      return NextResponse.json({
        exists: false,
        businessName: "",
        address: "",
        phone: "",
        email: "",
        currency: "USD",
        weightUnit: "kg",
        lowStockThreshold: 5,
      });
    }

    return NextResponse.json({
      exists: true,
      businessName: business.businessName,
      address: business.address,
      phone: business.phone,
      email: business.email,
      currency: business.currency,
      weightUnit: business.weightUnit,
      lowStockThreshold: business.lowStockThreshold,
    });
  } catch (error: any) {
    console.error("Error fetching business settings:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch business settings" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();
    const userId = await getUserIdFromRequest(req);

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      businessName,
      address,
      phone,
      email,
      currency,
      weightUnit,
      lowStockThreshold,
    } = body;

    // Validate required fields
    if (!businessName.trim()) {
      return NextResponse.json(
        { message: "Business name is required" },
        { status: 400 }
      );
    }

    const business = await Business.findOneAndUpdate(
      {
        createdBy: userId,
      },
      {
        businessName: businessName.trim(),
        address: address?.trim(),
        phone: phone?.trim(),
        email: email?.trim(),
        currency,
        weightUnit,
        lowStockThreshold,
      },
      {
        new: true, // Return updated document
        upsert: true, // Create if doesn't exist
        runValidators: true, // Validate against schema
      }
    );

    return NextResponse.json({
      success: true,
      message: "Business settings updated successfully",
      data: {
        businessName: business.businessName,
        address: business.address,
        phone: business.phone,
        email: business.email,
        currency: business.currency,
        weightUnit: business.weightUnit,
        lowStockThreshold: business.lowStockThreshold,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error updating / creating business data: " + error.message },
      { status: 500 }
    );
  }
}
