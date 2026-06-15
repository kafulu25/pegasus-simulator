import React, { useState } from 'react';
import { TargetList } from './TargetList';
import { TargetDetail } from './TargetDetail';
import { AddTargetModal } from './AddTargetModal';
import { useTargetStore } from '@/stores/targetStore';
import './TargetsPanel.css';

export const TargetsPanel: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const { selectedTargetId } = useTargetStore();
  
  return (
    <div className="targets-panel">
      <div className="panel-header">
        <div>
          <div className="panel-title">
            <span className="icon">🎯</span> Target Management
          </div>
          <div className="panel-subtitle">Manage and configure surveillance targets</div>
        </div>
        <button className="btn-add-target" onClick={() => setShowAddModal(true)}>
  + Add Target
</button>
      </div>
      <div className="two-pane">
        <div className="left-pane">
          <TargetList />
        </div>
        <div className="right-pane">
          {selectedTargetId ? (
            <TargetDetail targetId={selectedTargetId} />
          ) : (
            <div className="no-selection">
              <div className="no-selection-icon">🎯</div>
              <div>Select a target to view details</div>
              <div className="no-selection-sub">Click on any target from the list</div>
            </div>
          )}
        </div>
      </div>
      {showAddModal && <AddTargetModal onClose={() => setShowAddModal(false)} />}
    </div>
	
  );
};