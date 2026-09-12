import { prisma } from "@/lib/prisma";
import { validatePhonemes } from "@/lib/validation";

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
        {
          success: false,
          message: "Invalid word ID.",
        },
        { status: 400 }
      );
    }

    const word = await prisma.word.findUnique({
      where: {
        id,
      },
      include: {
        activity: true,
      },
    });

    if (!word) {
      return Response.json(
        {
          success: false,
          message: "Word not found.",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      word,
    });
  } catch (error) {
    console.error("Failed to fetch word:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch word.",
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
        {
          success: false,
          message: "Invalid word ID.",
        },
        { status: 400 }
      );
    }

    const existingWord = await prisma.word.findUnique({
      where: {
        id,
      },
    });

    if (!existingWord) {
      return Response.json(
        {
          success: false,
          message: "Word not found.",
        },
        { status: 404 }
      );
    }

    const body = await request.json();

    const {
      english,
      phonemes,
      activityId,
    } = body;

    const updateData = {};

    if (english !== undefined) {
      if (
        typeof english !== "string" ||
        !english.trim()
      ) {
        return Response.json(
          {
            success: false,
            message: "English word must be a non-empty string.",
          },
          { status: 400 }
        );
      }

      updateData.english = english.trim();
    }

    if (phonemes !== undefined) {
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

      updateData.phonemes = phonemes.trim();
    }

    if (activityId !== undefined) {
      const parsedActivityId = Number(activityId);

      if (
        !Number.isInteger(parsedActivityId) ||
        parsedActivityId <= 0
      ) {
        return Response.json(
          {
            success: false,
            message: "Invalid activityId.",
          },
          { status: 400 }
        );
      }

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

      updateData.activityId = parsedActivityId;
    }

    if (Object.keys(updateData).length === 0) {
      return Response.json(
        {
          success: false,
          message: "No valid fields were provided for update.",
        },
        { status: 400 }
      );
    }

        const word = await prisma.word.update({
      where: {
        id,
      },
      data: updateData,
      include: {
        activity: true,
      },
    });

    return Response.json({
      success: true,
      message: "Word updated successfully.",
      word,
    });
  } catch (error) {
    console.error("Failed to update word:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to update word.",
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
        {
          success: false,
          message: "Invalid word ID.",
        },
        { status: 400 }
      );
    }

    const existingWord = await prisma.word.findUnique({
      where: {
        id,
      },
    });

    if (!existingWord) {
      return Response.json(
        {
          success: false,
          message: "Word not found.",
        },
        { status: 404 }
      );
    }

    await prisma.word.delete({
      where: {
        id,
      },
    });

    return Response.json({
      success: true,
      message: "Word deleted successfully.",
    });
  } catch (error) {
    console.error("Failed to delete word:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to delete word.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}