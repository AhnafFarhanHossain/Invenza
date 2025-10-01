import { dbConnect } from "@/lib/db/db";
import User from "@/models/user.model";

const addVerificationFields = async () => {
  await dbConnect();

  try {
    const result = await User.updateMany(
      {
        isVerified: { $exists: false },
      },
      {
        $set: {
          isVerified: true,
          verificationToken: null,
          verificationTokenExpires: null,
        },
      }
    );

    console.log("Migration successful!");
    console.log(`Matched ${result.matchedCount} documents.`);
    console.log(`Modified ${result.modifiedCount} documents.`);
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    process.exit(0);
  }
};

addVerificationFields();