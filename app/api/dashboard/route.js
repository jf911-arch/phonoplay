import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get all activities for activity counts
    const activities = await prisma.activity.findMany({
      select: {
        type: true,
      },
    });

    // Get all usage events for reporting metrics
    const usageEvents = await prisma.usageEvent.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    // Activity counts
    const wordleActivities = activities.filter(
      (activity) => activity.type === "WORDLE"
    ).length;

    const wordSearchActivities = activities.filter(
      (activity) => activity.type === "WORD_SEARCH"
    ).length;

    // Generation counts
    const successfulGenerations = usageEvents.filter(
      (event) =>
        event.eventType === "GENERATION_SUCCESS" &&
        event.success === true
    ).length;

    const failedGenerations = usageEvents.filter(
      (event) =>
        event.eventType === "GENERATION_FAILED" ||
        (event.eventType === "GENERATION" && event.success === false)
    ).length;

    const invalidDataEvents = usageEvents.filter(
      (event) => event.eventType === "INVALID_ACTIVITY_DATA"
    ).length;

    // Average time on page
    const timeEvents = usageEvents.filter(
      (event) =>
        event.eventType === "TIME_ON_PAGE" &&
        typeof event.durationMs === "number" &&
        event.durationMs >= 0
    );

    const averageTimeOnPageMs =
      timeEvents.length > 0
        ? timeEvents.reduce(
            (total, event) => total + event.durationMs,
            0
          ) / timeEvents.length
        : 0;

    const averageTimeOnPageSeconds = Math.round(
      averageTimeOnPageMs / 1000
    );

    // Most-used activity type
    const activityTypeUsage = {};

    usageEvents.forEach((event) => {
      if (event.activityType) {
        activityTypeUsage[event.activityType] =
          (activityTypeUsage[event.activityType] || 0) + 1;
      }
    });

    let mostUsedActivityType = null;
    let highestUsage = 0;

    Object.entries(activityTypeUsage).forEach(
      ([activityType, count]) => {
        if (count > highestUsage) {
          highestUsage = count;
          mostUsedActivityType = activityType;
        }
      }
    );

    // Check database health
    await prisma.activity.count();

    return Response.json({
      success: true,

      health: {
        status: "healthy",
        database: "connected",
      },

      activities: {
        total: activities.length,
        wordle: wordleActivities,
        wordSearch: wordSearchActivities,
      },

      generations: {
        successful: successfulGenerations,
        failed: failedGenerations,
        total: successfulGenerations + failedGenerations,
      },
      observability: {
        invalidDataEvents,
      },

      usage: {
        averageTimeOnPageSeconds,
        mostUsedActivityType,
        mostUsedActivityCount: highestUsage,
        totalEvents: usageEvents.length,
      },
    });
  } catch (error) {
    console.error("Failed to load dashboard metrics:", error);

    return Response.json(
      {
        success: false,
        health: {
          status: "unhealthy",
          database: "disconnected",
        },
        message: "Failed to load dashboard metrics.",
      },
      { status: 500 }
    );
  }
}