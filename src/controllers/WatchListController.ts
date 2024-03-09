import { Response } from "express";
import { AddToList, RequestWithAuth } from "../ts/index";
import User from "../models/User";
import WatchListService from "../services/WatchListService";
import { importWatchListQueue } from "../queues/watchListImporter";

export default class WatchListController {
    // FIXME: get out in middleware
    public static async getWatchList(req: RequestWithAuth, res: Response): Promise<Object> {
        const { id } = req.auth!;

        const user = await User.getUserByIdAnimeList(id);

        return res.json(user.anime_list);
    }

    public static async importList(req: RequestWithAuth, res: Response): Promise<any> {
        const { id } = req.auth!;

        importWatchListQueue.add("importWatchListImport", { id }, {
            removeOnComplete: 10,
            removeOnFail: 100
        })

        return res.json({
            message: 'List imported successfully'
        });
    }

    public static async addToList(req: RequestWithAuth, res: Response) {
        const addingParameters = req.body as AddToList
        const { id } = req.auth!;
        const anime_id: number = req.params.anime_id as unknown as number;
        const anime_list = await WatchListService.addAnimeToListByIdWithParams(id, anime_id, addingParameters);
        return res.json({
            data: anime_list
        });
    }

    public static async editList(req: RequestWithAuth, res: Response) {
        const editParameters = req.body as AddToList
        const { id } = req.auth!;
        const anime_id: number = req.params.anime_id as unknown as number;
        const anime_list = await WatchListService.editAnimeListByIdWithParams(id, anime_id, editParameters);;
        return res.json({
            data: anime_list
        });
    }

    public static async deleteFromList(req: RequestWithAuth, res: Response) {
        const { id } = req.auth!;
        const anime_id = req.params.anime_id as unknown as number;
        await WatchListService.removeAnimeFromList(id, anime_id);
        return res.json({
            message: "Entry deleted successfully"
        });
    }
}