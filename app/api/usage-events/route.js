import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const rawBody = await request.text();

if (!rawBody.trim()) {
  return Response.json(
    {
      success: false,
      message: "Request body is empty.",
    },
    { status: 400 }
  );
}

const body = JSON.parse(rawBody);

    const {
      eventType,
      activityId,
      activityType,
      durationMs,
      success,
      details,
    } = body;

    if (!eventType || typeof eventType !== "string") {
      return Response.json(
        {
          success: false,
          message: "eventType is required.",
        },
        { status: 400 }
      );
    }

    const usageEvent = await prisma.usageEvent.create({
      data: {
        eventType,
        activityId:
          activityId !== undefined && activityId !== null
            ? Number(activityId)
            : null,
        activityType: activityType || null,
        durationMs:
          durationMs !== undefined && durationMs !== null
            ? Number(durationMs)
            : null,
        success:
          success !== undefined
            ? Boolean(success)
            : null,
        details: details || null,
      },
    });

    return Response.json(
      {
        success: true,
        usageEvent,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create usage event:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to create usage event.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}