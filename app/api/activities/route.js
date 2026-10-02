import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const activities = await prisma.activity.findMany({
      include: {
        words: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json({
      success: true,
      activities,
    });
  } catch (error) {
    console.error("Failed to fetch activities:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch activities",
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
      title,
      type,
      difficulty,
      hintsEnabled,
      gridSize,
      maxGuesses,
      outputFilename,
      words,
    } = body;

    // Basic validation
    if (!title || typeof title !== "string" || !title.trim()) {
      return Response.json(
        {
          success: false,
          message: "Title is required.",
        },
        { status: 400 }
      );
    }

    if (!["WORDLE", "WORD_SEARCH"].includes(type)) {
      return Response.json(
        {
          success: false,
          message: "Type must be WORDLE or WORD_SEARCH.",
        },
        { status: 400 }
      );
    }

    if (!["easy", "medium", "hard"].includes(difficulty)) {
      return Response.json(
        {
          success: false,
          message: "Difficulty must be easy, medium, or hard.",
        },
        { status: 400 }
      );
    }

    if (!Array.isArray(words)) {
      return Response.json(
        {
          success: false,
          message: "Words must be provided as an array.",
        },
        { status: 400 }
      );
    }

    // Validate grid size
    const parsedGridSize = gridSize === undefined ? 10 : Number(gridSize);

    if (
      !Number.isInteger(parsedGridSize) ||
      parsedGridSize < 5 ||
      parsedGridSize > 20
    ) {
      return Response.json(
        {
          success: false,
          message: "Grid size must be an integer between 5 and 20.",
        },
        { status: 400 }
      );
    }

    // Validate maximum guesses
    const parsedMaxGuesses =
      maxGuesses === undefined ? 6 : Number(maxGuesses);

    if (
      !Number.isInteger(parsedMaxGuesses) ||
      parsedMaxGuesses < 1 ||
      parsedMaxGuesses > 10
    ) {
      return Response.json(
        {
          success: false,
          message: "Maximum guesses must be an integer between 1 and 10.",
        },
        { status: 400 }
      );
    }

    // Validate output filename
    let validatedOutputFilename = null;

    if (outputFilename !== undefined && outputFilename !== null) {
      if (
        typeof outputFilename !== "string" ||
        !outputFilename.trim()
      ) {
        return Response.json(
          {
            success: false,
            message: "Output filename must be a non-empty string.",
          },
          { status: 400 }
        );
      }

      validatedOutputFilename = outputFilename.trim();

      if (!validatedOutputFilename.toLowerCase().endsWith(".html")) {
        return Response.json(
          {
            success: false,
            message: "Output filename must end with .html.",
          },
          { status: 400 }
        );
      }
    }

    // Validate every word
    for (const word of words) {
      if (
        !word ||
        !word.english ||
        typeof word.english !== "string" ||
        !word.english.trim()
      ) {
        return Response.json(
          {
            success: false,
            message: "Every word must have an English word.",
          },
          { status: 400 }
        );
      }

      if (
        !word.phonemes ||
        typeof word.phonemes !== "string" ||
        !word.phonemes.trim()
      ) {
        return Response.json(
          {
            success: false,
            message: `Missing phonemes for "${word.english}".`,
          },
          { status: 400 }
        );
      }
    }

    // Wordle should have exactly one target word
    if (type === "WORDLE" && words.length !== 1) {
      return Response.json(
        {
          success: false,
          message: "A Wordle activity must contain exactly one word.",
        },
        { status: 400 }
      );
    }

    // Word Search needs at least one word
    if (type === "WORD_SEARCH" && words.length === 0) {
      await prisma.usageEvent.create({
        data: {
          eventType: "INVALID_ACTIVITY_DATA",
          activityType: "WORD_SEARCH",
          success: false,
          details: "Word Search activity was submitted with an empty word list.",
        },
      });

      return Response.json(
        {
          success: false,
          message: "A Word Search activity must contain at least one word.",
        },
        { status: 400 }
      );
    }

    const activity = await prisma.activity.create({
      data: {
        title: title.trim(),
        type,
        difficulty,
        hintsEnabled: Boolean(hintsEnabled),
        gridSize: parsedGridSize,
        maxGuesses: parsedMaxGuesses,
        outputFilename: validatedOutputFilename,
        words: {
          create: words.map((word) => ({
            english: word.english.trim(),
            phonemes: word.phonemes.trim(),
          })),
        },
      },
      include: {
        words: true,
      },
    });

    await prisma.usageEvent.create({
      data: {
        eventType: "ACTIVITY_CREATED",
        activityId: activity.id,
        activityType: activity.type,
        success: true,
        details: `Created ${activity.type} activity: ${activity.title}`,
      },
    });

    return Response.json(
      {
        success: true,
        message: "Activity created successfully.",
        activity,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create activity:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to create activity",
        error: error.message,
      },
      { status: 500 }
    );
  }
}