import '../styles/history.css';

const ACTION_COLORS = {
  translate: { bg: '#dbeafe', color: '#1d4ed8' },
  analyze:   { bg: '#dcfce7', color: '#15803d' },
  optimize:  { bg: '#fef9c3', color: '#a16207' },
  explain:   { bg: '#f3e8ff', color: '#7e22ce' },
};

function HistoryList({ entries, onSelect, onDelete, selectedId }) {
  if (!entries || entries.length === 0) {
    return (
      <div className="history-empty">
        <div className="history-empty-icon">📭</div>
        <p>No history yet</p>
        <span>Your translations will appear here</span>
      </div>
    );
  }

  return (
    <div className="history-list">
      {entries.map((entry) => {
        const action = entry.type || entry.action || 'translate';
        const colors = ACTION_COLORS[action] || ACTION_COLORS.translate;
        const isSelected = selectedId === entry._id;

        return (
          <div
            key={entry._id}
            className={`history-item ${isSelected ? 'selected' : ''}`}
            onClick={() => onSelect(entry)}
          >
            <div className="history-item-left">
              <span
                className="history-item-badge"
                style={{ background: colors.bg, color: colors.color }}
              >
                {action}
              </span>
              <span className="history-item-langs">
                {entry.sourceLanguage}
                {entry.targetLanguage && (
                  <span className="history-item-arrow"> → {entry.targetLanguage}</span>
                )}
              </span>
            </div>

            <div className="history-item-right">
              <span className="history-item-date">
                {new Date(entry.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
              <button
                className="history-delete-btn"
                title="Delete"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(entry._id);
                }}
              >
                🗑
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default HistoryList;