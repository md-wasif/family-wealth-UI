"use server";

import { prisma } from "@/lib/prisma";

export async function createAuditLog(action: string, detail: string) {
  try {
    const log = await prisma.auditLog.create({
      data: {
        action,
        detail,
      },
    });
    return { success: true, log };
  } catch (error) {
    console.error("Failed to create audit log:", error);
    return { success: false, error: "Failed to create audit log" };
  }
}

export async function getAuditLogs(limit: number = 500) {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: {
        timestamp: "desc",
      },
      take: limit,
    });
    return { success: true, logs };
  } catch (error) {
    console.error("Failed to fetch audit logs:", error);
    return { success: false, error: "Failed to fetch audit logs" };
  }
}
