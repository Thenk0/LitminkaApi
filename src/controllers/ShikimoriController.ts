import { User, Integration, Shikimori_Link_Token } from "@prisma/client";
import { Request, Response } from "express";
import crypto from "crypto";
import { RequestWithAuth, ServerError, ShikimoriWhoAmI } from "../ts/custom";
import ShikimoriApi from "../helper/shikimoriapi";
import { prisma } from '../db';
export default class ShikimoriController {
    static async generateLink(req: RequestWithAuth, res: Response): Promise<Object> {
        const { id }: { id: number } = req.auth!;
        const token: string = crypto.randomBytes(24).toString('hex');
        await prisma.shikimori_Link_Token.upsert({
            where: { user_id: id },
            update: {
                token: token,
            },
            create: {
                user_id: id,
                token: token,
            }
        })
        const link = `https://api.litminka.ru/shikimori/link?token=${token}`;
        return res.status(200).json({
            link: `https://shikimori.one/oauth/authorize?client_id=${process.env.shikimori_client_id}&redirect_uri=${link}&response_type=code&scope=user_rates`
        });
    }

    static async link(req: Request, res: Response): Promise<Object> {
        const { token, code } = req.query;
        if (typeof token !== "string") return res.status(401).json({
            message: "Query param token must be string",
        });
        if (typeof code !== "string") return res.status(401).json({
            message: "Query param code must be string",
        });
        try {
            await prisma.shikimori_Link_Token.update({
                where: { token },
                data: {
                    user: {
                        update: {
                            integration: {
                                upsert: {
                                    create: {
                                        shikimori_code: code
                                    },
                                    update: {
                                        shikimori_code: code
                                    }
                                }
                            }
                        }
                    }
                }
            })
        } catch (error) {
            return res.status(401).json({
                message: "Query param code must be string",
            });
        }
        let user: null | User & {
            integration: Integration | null;
            shikimori_link: Shikimori_Link_Token | null;
        };
        try {
            user = await prisma.user.findFirstOrThrow({
                where: {
                    shikimori_link: {
                        token
                    }
                },
                include: {
                    integration: true,
                    shikimori_link: true
                }
            });
        } catch (error) {
            console.log(error);
            return res.status(403).json({
                message: "User does not exist"
            });
        }

        const shikimoriapi = new ShikimoriApi(user);
        const profile = await shikimoriapi.getProfile();
        if (!profile) return res.status(401).json({
            message: 'User does not have shikimori integration'
        });
        if (profile.reqStatus === 500) return res.status(500).json({ message: "Server error" });
        await prisma.integration.update({
            where: {
                user_id: user.id
            },
            data: {
                shikimori_id: (<ShikimoriWhoAmI>profile).id
            }
        });
        return res.status(200).json({
            message: "Account linked!"
        })
    }

    static async getProfile(req: RequestWithAuth, res: Response): Promise<Object> {
        const { id } = req.auth!;
        let user: null | User & {
            integration: Integration | null;
            shikimori_link: Shikimori_Link_Token | null;
        };
        try {
            user = await prisma.user.findFirstOrThrow({
                where: {
                    id
                },
                include: {
                    integration: true,
                    shikimori_link: true
                },
            });
        } catch (error) {
            console.log(error);
            return res.status(403).json({
                message: "User does not exist"
            });
        }
        const shikimori = new ShikimoriApi(user);
        const result: ShikimoriWhoAmI | ServerError | false = await shikimori.getProfile();
        if (!result) return res.status(401).json({
            message: 'User does not have shikimori integration'
        });
        if (result.reqStatus === 500) return res.status(500).json({ message: "Server error" });
        (<ShikimoriWhoAmI>result).avatar;
        return res.status(200).json(result);
    }
}