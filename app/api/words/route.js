import { prisma } from "@/lib/prisma";
import { validatePhonemes } from "@/lib/validation";

export async function GET() {
  try {
    const words = await prisma.word.findMany({
      include: {
        activity: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    return Response.json({
      success: true,
      words,
    });
  } catch (error) {
    console.error("Failed to fetch words:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch words.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      english,
      phonemes,
      activityId,
    } = body;

    // Validate English word
    if (!english || typeof english !== "string" || !english.trim()) {
      return Response.json(
        {
          success: false,
          message: "English word is required.",
        },
        { status: 400 }
      );
    }

    // Validate phonemes
    const phonemeValidation = validatePhonemes(phonemes);

    if (!phonemeValidation.valid) {
      return Response.json(
        {
          success: false,
          message: phonemeValidation.message,
        },
        { status: 400 }
      );
    }

    // Validate activity ID
    const parsedActivityId = Number(activityId);

    if (!Number.isInteger(parsedActivityId) || parsedActivityId <= 0) {
      return Response.json(
        {
          success: false,
          message: "A valid activityId is required.",
        },
        { status: 400 }
      );
    }

    // Make sure the activity exists
    const activity = await prisma.activity.findUnique({
      where: {
        id: parsedActivityId,
      },
    });

    if (!activity) {
      return Response.json(
        {
          success: false,
          message: "Activity not found.",
        },
        { status: 404 }
      );
    }

    // Create the word
    const word = await prisma.word.create({
      data: {
        english: english.trim(),
        phonemes: phonemes.trim(),
        activityId: parsedActivityId,
      },
      include: {
        activity: true,
      },
    });

    return Response.json(
      {
        success: true,
        message: "Word created successfully.",
        word,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create word:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to create word.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}