import { translateCode } from "../services/translation.service.js";
import { analyzeComplexity } from "../services/complexity.service.js";
import { optimizeCode } from "../services/optimization.service.js";
import { explainCode } from "../services/explanation.service.js";
import { createHistoryEntry } from "../services/history.service.js";

// 🔧 Helper
const handleError = (res, error, label) => {
  console.error(`${label} Error:`, error.message);

  return res.status(500).json({
    success: false,
    message: error.message || `${label} failed`,
  });
};

// ✅ TRANSLATE
export const translate = async (req, res) => {
  try {
    const { code, sourceLanguage, targetLanguage } = req.body;

    if (!code || !sourceLanguage || !targetLanguage) {
      return res.status(400).json({
        success: false,
        message: "code, sourceLanguage, and targetLanguage are required.",
      });
    }

    const result = await translateCode(code, sourceLanguage, targetLanguage);

    if (!result) {
      return res.status(500).json({
        success: false,
        message: "AI returned empty response",
      });
    }

    createHistoryEntry({
      userId: req.user._id,
      type: "translate",
      inputCode: code,
      sourceLanguage,
      targetLanguage,
      output: result,
    }).catch((err) =>
      console.error("History save failed:", err.message)
    );

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return handleError(res, error, "Translate");
  }
};

// ✅ ANALYZE
export const analyze = async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({
        success: false,
        message: "code and language are required.",
      });
    }

    const result = await analyzeComplexity(code, language);

    if (!result) {
      return res.status(500).json({
        success: false,
        message: "AI returned empty response",
      });
    }

    createHistoryEntry({
      userId: req.user._id,
      type: "analyze",
      inputCode: code,
      sourceLanguage: language,
      output: result,
    }).catch((err) =>
      console.error("History save failed:", err.message)
    );

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return handleError(res, error, "Analyze");
  }
};

// ✅ OPTIMIZE
export const optimize = async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({
        success: false,
        message: "code and language are required.",
      });
    }

    const result = await optimizeCode(code, language);

    if (!result) {
      return res.status(500).json({
        success: false,
        message: "AI returned empty response",
      });
    }

    createHistoryEntry({
      userId: req.user._id,
      type: "optimize",
      inputCode: code,
      sourceLanguage: language,
      output: result,
    }).catch((err) =>
      console.error("History save failed:", err.message)
    );

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return handleError(res, error, "Optimize");
  }
};

// ✅ EXPLAIN
export const explain = async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({
        success: false,
        message: "code and language are required.",
      });
    }

    const result = await explainCode(code, language);

    if (!result) {
      return res.status(500).json({
        success: false,
        message: "AI returned empty response",
      });
    }

    createHistoryEntry({
      userId: req.user._id,
      type: "explain",
      inputCode: code,
      sourceLanguage: language,
      output: result,
    }).catch((err) =>
      console.error("History save failed:", err.message)
    );

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return handleError(res, error, "Explain");
  }
};