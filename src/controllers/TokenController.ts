import { Request, Response } from "express";
import { RequestStatuses } from "@/ts/enums";
import TokenService from "@services/TokenService";
import { RequestWithTokens, RequestWithUser } from "@/ts";

export default class TokenController {

    public static async refreshToken(req: Request, res: Response) {
        const token = req.get("authorization");

        const tokens = await TokenService.refreshToken(token)

        return res.status(RequestStatuses.OK).json({ data: tokens });
    }

    public static async getTokens(req: RequestWithTokens, res: Response) {
        const user = req.auth.user;

        const tokens = await TokenService.getTokens(user.id);

        const result = [];

        for (const userToken of tokens) {
            const { id, token } = userToken;
            result.push({
                id,
                token,
                isCurrent: req.auth.token === token,
            });
        }

        return res.status(RequestStatuses.OK).json({ data: result });
    }

    public static async deleteTokens(req: RequestWithTokens, res: Response) {
        const user = req.auth.user;

        const tokens = await TokenService.deleteTokens(user.id, req.auth.token, req.body.sessions);

        return res.status(RequestStatuses.OK).json({ message: "sessions_ended" });
    }
}