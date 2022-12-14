import fetch, { Headers } from "node-fetch";
import { KodikAnimeFullRequest, KodikGenresRequest, ServerError } from "../ts/custom";

export default class KodikApi {
    baseurl = "https://kodikapi.com"

    async getAnime(shikimori_id: number): Promise<KodikAnimeFullRequest | ServerError> {
        const params = new URLSearchParams({
            "token": process.env.kodik_api_key!,
            "shikimori_id": shikimori_id.toString(),
        });
        const response = await fetch(`${this.baseurl}/search`, {
            method: "POST",
            body: params
        })
        if (response.status !== 200) return { reqStatus: 500, message: "Server error" };
        return await response.json();
    }

    async getFullAnime(shikimori_id: number): Promise<KodikAnimeFullRequest | ServerError> {
        const params = new URLSearchParams({
            "token": process.env.kodik_api_key!,
            "shikimori_id": shikimori_id.toString(),
            "with_material_data": "true"
        });
        const response = await fetch(`${this.baseurl}/search`, {
            method: "POST",
            body: params
        })
        if (response.status !== 200) return { reqStatus: 500, message: "Server error" };
        const res = await response.json();
        res.shikimori_request = shikimori_id;
        return res;
    }

    async getGenres(): Promise<KodikGenresRequest | ServerError> {
        const params = new URLSearchParams({
            "token": process.env.kodik_api_key!,
            "genres_type": "shikimori",
        });
        const response = await fetch(`${this.baseurl}/genres`, {
            method: "POST",
            body: params
        })
        if (response.status !== 200) return { reqStatus: 500, message: "Server error" };
        return await response.json();
    }
}