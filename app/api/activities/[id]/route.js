import { prisma } from "@/lib/prisma";

function getId(params) {
  const id = Number(params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const id = getId(resolvedParams);

    if (!id) {
      return Response.json(
        { success: false, message: "Invalid activity ID." },
        { status: 400 }
      );
    }

    const activity = await prisma.activity.findUnique({
      where: { id },
      include: { words: true },
    });

    if (!activity) {
      return Response.json(
        { success: false, message: "Activity not found." },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      activity,
    });
  } catch (error) {
    console.error("Failed to fetch activity:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch activity.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const resolvedParams = await params;
    const id = getId(resolvedParams);

    if (!id) {
      return Response.json(
        { success: false, message: "Invalid activity ID." },
        { status: 400 }
      );
    }

    const existingActivity = await prisma.activity.findUnique({
      where: { id },
    });

    if (!existingActivity) {
      return Response.json(
        { success: false, message: "Activity not found." },
        { status: 404 }
      );
    }

    const body = await request.json();

    const {
      title,
      type,
      difficulty,
      hintsEnabled,
      gridSize,
      maxGuesses,
      outputFilename,
    } = body;

    const updateData = {};

    // Validate title
    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return Response.json(
          {
            success: false,
            message: "Title must be a non-empty string.",
          },
          { status: 400 }
        );
      }

      updateData.title = title.trim();
    }

    // Validate activity type
    if (type !== undefined) {
      if (!["WORDLE", "WORD_SEARCH"].includes(type)) {
        return Response.json(
          {
            success: false,
            message: "Type must be WORDLE or WORD_SEARCH.",
          },
          { status: 400 }
        );
      }

      updateData.type = type;
    }

    // Validate difficulty
    if (difficulty !== undefined) {
      if (!["easy", "medium", "hard"].includes(difficulty)) {
        return Response.json(
          {
            success: false,
            message: "Difficulty must be easy, medium, or hard.",
          },
          { status: 400 }
        );
      }

      updateData.difficulty = difficulty;
    }

    // Validate hints
    if (hintsEnabled !== undefined) {
      if (typeof hintsEnabled !== "boolean") {
        return Response.json(
          {
            success: false,
            message: "hintsEnabled must be true or false.",
          },
          { status: 400 }
        );
      }

      updateData.hintsEnabled = hintsEnabled;
    }

    // Validate grid size
    if (gridSize !== undefined) {
      const parsedGridSize = Number(gridSize);

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

      updateData.gridSize = parsedGridSize;
    }

    // Validate maximum guesses
    if (maxGuesses !== undefined) {
      const parsedMaxGuesses = Number(maxGuesses);

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

      updateData.maxGuesses = parsedMaxGuesses;
    }

    // Validate generated HTML filename
    if (outputFilename !== undefined) {
      if (
        outputFilename !== null &&
        (typeof outputFilename !== "string" ||
          !outputFilename.trim())
      ) {
        return Response.json(
          {
            success: false,
            message: "Output filename must be a non-empty string.",
          },
          { status: 400 }
        );
      }

      if (
        typeof outputFilename === "string" &&
        !outputFilename.toLowerCase().endsWith(".html")
      ) {
        return Response.json(
          {
            success: false,
            message: "Output filename must end with .html.",
          },
          { status: 400 }
        );
      }

      updateData.outputFilename =
        outputFilename === null ? null : outputFilename.trim();
    }

    // Make sure something was actually supplied for updating
    if (Object.keys(updateData).length === 0) {
      return Response.json(
        {
          success: false,
          message: "No valid fields were provided for update.",
        },
        { status: 400 }
      );
    }

    const activity = await prisma.activity.update({
      where: { id },
      data: updateData,
      include: { words: true },
    });

    return Response.json({
      success: true,
      message: "Activity updated successfully.",
      activity,
    });
  } catch (error) {
    console.error("Failed to update activity:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to update activity.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const resolvedParams = await params;
    const id = getId(resolvedParams);

    if (!id) {
      return Response.json(
        { success: false, message: "Invalid activity ID." },
        { status: 400 }
      );
    }

    const existingActivity = await prisma.activity.findUnique({
      where: { id },
    });

    if (!existingActivity) {
      return Response.json(
        { success: false, message: "Activity not found." },
        { status: 404 }
      );
    }

    await prisma.activity.delete({
      where: { id },
    });

    return Response.json({
      success: true,
      message: "Activity deleted successfully.",
    });
  } catch (error) {
    console.error("Failed to delete activity:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to delete activity.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}