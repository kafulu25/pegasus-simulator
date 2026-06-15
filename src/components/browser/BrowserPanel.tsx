import React, { useState } from 'react';
import { useBrowserStore } from '@/stores/browserStore';
import './BrowserPanel.css';

export const BrowserPanel: React.FC = () => {
  const { history } = useBrowserStore();
  const [browserFilter, setBrowserFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const browsers = ['all', ...new Set(history.map(h => h.browser))];
  
  const filteredHistory = history.filter(item => {
    const matchesBrowser = browserFilter === 'all' || item.browser === browserFilter;
    const matchesSearch = item.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBrowser && matchesSearch;
  });
  
  const getBrowserIcon = (browser: string) => {
    const icons: Record<string, string> = {
      chrome: '🟡',
      safari: '🧭',
      firefox: '🦊',
      edge: '🔷',
    };
    return icons[browser] || '🌐';
  };
  
  return (
    <div className="browser-panel">
      <div className="panel-header">
        <div>
          <div className="panel-title">
            <span className="icon">🌐</span> Browser History
          </div>
          <div className="panel-subtitle">Web activity across all browsers</div>
        </div>
      </div>
      <div className="two-pane">
        <div className="left-pane">
          <div className="browser-filters">
            <div className="filter-title">Filter by browser</div>
            {browsers.map(browser => (
              <div
                key={browser}
                className={`filter-option ${browserFilter === browser ? 'active' : ''}`}
                onClick={() => setBrowserFilter(browser)}
              >
                <span className="filter-icon">{getBrowserIcon(browser)}</span>
                <span>{browser === 'all' ? 'All Browsers' : browser}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="right-pane">
          <div className="search-bar">
            <input
              type="text"
              className="search-input"
              placeholder="🔍 Search history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="history-list">
            {filteredHistory.map((item) => (
              <div key={item.id} className="history-item">
                <div className="history-icon">{getBrowserIcon(item.browser)}</div>
                <div className="history-details">
                  <div className="history-title">{item.title}</div>
                  <div className="history-url">{item.url}</div>
                  <div className="history-meta">
                    <span>{item.browser}</span>
                    <span>•</span>
                    <span>{new Date(item.timestamp).toLocaleString()}</span>
                    <span>•</span>
                    <span>{item.visitCount} visits</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};