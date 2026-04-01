import * as historyService from "../services/history.service.js";

export const getHistory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await historyService.getUserHistory(
      req.user._id,
      page,
      limit
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getHistoryItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    const item = await historyService.getHistoryById(id, req.user._id);

    return res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteHistoryItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    await historyService.deleteHistoryById(id, req.user._id);

    return res.status(200).json({
      success: true,
      message: "History item deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const clearHistory = async (req, res, next) => {
  try {
    await historyService.clearUserHistory(req.user._id);

    return res.status(200).json({
      success: true,
      message: "All history cleared successfully",
    });
  } catch (error) {
    next(error);
  }
};