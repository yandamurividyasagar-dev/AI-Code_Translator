import axios from "axios";

const API = "https://ai-code-translator-server.onrender.com/api/code";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const translateCode = async (code, sourceLanguage, targetLanguage) => {
  const res = await axios.post(
    `${API}/translate`,
    { code, sourceLanguage, targetLanguage },
    getAuthHeader()
  );
  return res.data.data;
};

export const analyzeComplexity = async (code, language) => {
  const res = await axios.post(
    `${API}/analyze`,
    { code, language },
    getAuthHeader()
  );
  return res.data.data;
};

export const optimizeCode = async (code, language) => {
  const res = await axios.post(
    `${API}/optimize`,
    { code, language },
    getAuthHeader()
  );
  return res.data.data;
};

export const explainCode = async (code, language) => {
  const res = await axios.post(
    `${API}/explain`,
    { code, language },
    getAuthHeader()
  );
  return res.data.data;
};
