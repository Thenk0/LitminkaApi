import { UserNotify } from "@/ts";
import prisma from "@/db";
import { Prisma } from "@prisma/client";
import { getUserNotifications } from "@services/NotificationService";

const extention = Prisma.defineExtension({
    name: "UserNotificationModel",
    model: {
        userAnimeNotifications: {
            async createUserAnimeNotifications({ userId, animeId, status, groupId, episode }: UserNotify) {
                return prisma.userAnimeNotifications.create({
                    data: {
                        userId,
                        animeId,
                        status,
                        groupId,
                        episode,
                    }
                })
            },
            async readNotifications(ids: number[], userId: number) {
                let query: Prisma.UserAnimeNotificationsUpdateManyArgs = {
                    where: {
                        userId,
                    },
                    data: { isRead: true }
                }

                if (ids.length === 0) query.where = {
                    userId,
                    id: { in: ids }
                }
                return prisma.userAnimeNotifications.updateMany(query)
            },
            async getUserNotifications({ isRead = false, userId, period }: getUserNotifications) {
                return prisma.userAnimeNotifications.findMany({
                    where: {
                        isRead,
                        userId,
                        createdAt: {
                            lte: period[1],
                            gte: period[0]
                        }
                    }
                })
            }
        }
    }
})

export { extention as UserNotificationExt }