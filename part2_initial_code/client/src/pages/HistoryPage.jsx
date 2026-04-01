import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import HistoryList from "../components/HistoryList.jsx";
import CodeEditor from "../components/CodeEditor.jsx";

import {
  getHistory,
  deleteHistoryItem,
  clearHistory,
} from "../services/historyService.js";

import "../styles/history.css";

function HistoryPage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);

  const [selectedEntry, setSelectedEntry] = useState(null);

  const ITEMS_PER_PAGE = 8;

  useEffect(() => {
    fetchHistory();
  }, [currentPage]);

  // Fetch history
  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await getHistory(currentPage, ITEMS_PER_PAGE);

      setEntries(data.entries || []);
      setTotalPages(data.totalPages || 1);
      setTotalEntries(data.totalEntries || 0);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  // Delete one
  const handleDelete = async (id) => {
    try {
      await deleteHistoryItem(id);
      toast.success("Deleted");

      if (selectedEntry?._id === id) setSelectedEntry(null);

      fetchHistory();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete");
    }
  };

  // Clear all
  const handleClearAll = async () => {
    if (!window.confirm("Delete all history?")) return;

    try {
      const r = await clearHistory();

      toast.success("History cleared");

      setEntries([]);
      setTotalEntries(0);
      setTotalPages(1);
      setSelectedEntry(null);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      toast.error("Failed to clear");
    }
  };

  return (
    <div className="history-page">
      {/* Header */}
      <div className="history-header">
        <h2>History ({totalEntries})</h2>

        <button className="clear-btn" onClick={handleClearAll}>
          Clear All
        </button>
      </div>

      {/* Layout */}
      <div className="history-layout">
        {/* LEFT */}
        <div className="history-list-panel">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <HistoryList
              entries={entries}
              onSelect={(entry) => {
                console.log("Selected:", entry); // debug
                setSelectedEntry(entry);
              }}
              onDelete={handleDelete}
              selectedId={selectedEntry?._id}
            />
          )}
        </div>

        {/* RIGHT */}
        <div className="history-detail-panel">
          {!selectedEntry || !selectedEntry.output ? (
            <p className="empty-state">
              Select an item to view details
            </p>
          ) : (
            <>
              {/* Input */}
              <h4>Input Code</h4>
              <div className="detail-editor">
                <CodeEditor
                  code={selectedEntry.inputCode}
                  language={selectedEntry.sourceLanguage}
                  readonly
                />
              </div>

              {/* Output */}
              <h4>Output</h4>

              <div className="detail-output-box">
                {/* TRANSLATE */}
                {(selectedEntry.type || selectedEntry.action) ===
                  "translate" && (
                  <>
                    <span className="detail-lang-badge">
                      Target: {selectedEntry.targetLanguage}
                    </span>
                    <pre className="detail-code-block">
                      {selectedEntry.output?.translatedCode}
                    </pre>
                  </>
                )}

                {/* ANALYZE */}
                {(selectedEntry.type || selectedEntry.action) ===
                  "analyze" && (
                  <>
                    <div className="detail-complexity-row">
                      <div className="detail-complexity-card">
                        <div className="detail-complexity-label">
                          Time
                        </div>
                        <div className="detail-complexity-value">
                          {selectedEntry.output?.timeComplexity}
                        </div>
                      </div>

                      <div className="detail-complexity-card">
                        <div className="detail-complexity-label">
                          Space
                        </div>
                        <div className="detail-complexity-value">
                          {selectedEntry.output?.spaceComplexity}
                        </div>
                      </div>
                    </div>

                    {selectedEntry.output?.explanation && (
                      <p className="detail-text">
                        {selectedEntry.output.explanation}
                      </p>
                    )}
                  </>
                )}

                {/* OPTIMIZE */}
                {(selectedEntry.type || selectedEntry.action) ===
                  "optimize" && (
                  <>
                    <pre className="detail-code-block">
                      {selectedEntry.output?.optimizedCode}
                    </pre>

                    {selectedEntry.output?.suggestions && (
                      <p className="detail-text">
                        {selectedEntry.output.suggestions}
                      </p>
                    )}
                  </>
                )}

                {/* EXPLAIN */}
                {(selectedEntry.type || selectedEntry.action) ===
                  "explain" && (
                  <p className="detail-text">
                    {selectedEntry.output?.explanation}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="history-pagination">
          <button
            className="page-btn"
            onClick={() =>
              setCurrentPage((p) => Math.max(1, p - 1))
            }
            disabled={currentPage === 1}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (p) => (
              <button
                key={p}
                className={`page-btn ${
                  currentPage === p ? "active" : ""
                }`}
                onClick={() => setCurrentPage(p)}
              >
                {p}
              </button>
            )
          )}

          <button
            className="page-btn"
            onClick={() =>
              setCurrentPage((p) =>
                Math.min(totalPages, p + 1)
              )
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default HistoryPage;