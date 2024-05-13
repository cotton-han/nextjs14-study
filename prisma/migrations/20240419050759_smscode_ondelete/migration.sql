-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SMSCode" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "SMSCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_SMSCode" ("code", "created_at", "id", "updated_at", "userId") SELECT "code", "created_at", "id", "updated_at", "userId" FROM "SMSCode";
DROP TABLE "SMSCode";
ALTER TABLE "new_SMSCode" RENAME TO "SMSCode";
CREATE UNIQUE INDEX "SMSCode_code_key" ON "SMSCode"("code");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
