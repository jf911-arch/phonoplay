-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Activity" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "hintsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "gridSize" INTEGER NOT NULL DEFAULT 10,
    "maxGuesses" INTEGER NOT NULL DEFAULT 6,
    "outputFilename" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Activity" ("createdAt", "difficulty", "hintsEnabled", "id", "title", "type", "updatedAt") SELECT "createdAt", "difficulty", "hintsEnabled", "id", "title", "type", "updatedAt" FROM "Activity";
DROP TABLE "Activity";
ALTER TABLE "new_Activity" RENAME TO "Activity";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
