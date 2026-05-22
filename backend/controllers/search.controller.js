import * as searchService from "../services/search.service.js";

export const searchAll = async (req, res) => {
    const result = await searchService.searchAll(req.query.query);
    res.json(result);
};
