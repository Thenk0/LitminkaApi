import { CreateUser, LoginUser } from "../ts";
import { prisma } from "../db";

export default class RefreshToken {
    public static async create(refreshToken: string, id: number) {
        prisma.refreshToken.create({
            data: {
                token: refreshToken,
                user_id: id
            }
        });
    }
}