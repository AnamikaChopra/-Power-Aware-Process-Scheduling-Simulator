import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './TakeInput.css';

const TakeInput = () => {
  const navigate = useNavigate();
  const [powerLimit, setPowerLimit] = useState('');
  const [numProcesses, setNumProcesses] = useState('');
  const [available, setAvailable] = useState([0, 0, 0]);
  const [showTable, setShowTable] = useState(false);
  const [processes, setProcesses] = useState([]);
  const [deadlock, setDeadlock] = useState(null);

  const handleInitialSubmit = (e) => {
    e.preventDefault();
    if (powerLimit >= 1 && powerLimit <= 100 && numProcesses > 0) {
      const initialProcesses = Array.from({ length: Number(numProcesses) }, () => ({
        allocation: [0, 0, 0],
        request: [0, 0, 0],
        power: 0,
      }));
      setProcesses(initialProcesses);
      setShowTable(true);
    } else {
      alert('Enter valid power (1-100) and number of processes > 0');
    }
  };

  const updateCell = (i, type, index, value) => {
    const updated = [...processes];
    updated[i][type][index] = Number(value);
    setProcesses(updated);
  };

  const updatePower = (i, value) => {
    const updated = [...processes];
    updated[i].power = Number(value);
    setProcesses(updated);
  };

  const handleAvailableChange = (index, value) => {
    const updated = [...available];
    updated[index] = Number(value);
    setAvailable(updated);
  };

  const checkDeadlock = () => {
    const n = processes.length;
    const allocation = processes.map(p => p.allocation);
    const request = processes.map(p => p.request);
    const work = [...available];
    const finish = Array(n).fill(false);
    const safeSequence = [];

    let changed = true;
    while (changed) {
      changed = false;
      for (let i = 0; i < n; i++) {
        if (!finish[i]) {
          if (request[i].every((r, j) => r <= work[j])) {
            for (let j = 0; j < 3; j++) work[j] += allocation[i][j];
            finish[i] = true;
            safeSequence.push(i);
            changed = true;
          }
        }
      }
    }

    const isSafe = finish.every(f => f);
    if (isSafe) {
      setDeadlock(false);
      alert('✅ No Deadlock. Safe Sequence: ' + safeSequence.join(', '));
    } else {
      setDeadlock(true);
      alert('❌ Deadlock detected!');
    }
  };

  return (
    <div className="take-input-container">
      <h1>Power-Aware Process Input</h1>
      <form onSubmit={handleInitialSubmit} className="input-form">
        <label>Power Limit (1-100 W):</label>
        <input
          type="number"
          value={powerLimit}
          onChange={e => setPowerLimit(e.target.value)}
          min="1"
          max="100"
          required
        />

        <label>Number of Processes:</label>
        <input
          type="number"
          value={numProcesses}
          onChange={e => setNumProcesses(e.target.value)}
          min="1"
          required
        />

        <button type="submit">Generate Table</button>
      </form>

      {showTable && (
        <div className="table-section">
          <h2>Enter Allocation, Request, and Power per Process</h2>

          <div className="available-inputs">
            <label>Available Resources [A, B, C]: </label>
            {[0, 1, 2].map(i => (
              <input
                key={i}
                type="number"
                value={available[i]}
                onChange={e => handleAvailableChange(i, e.target.value)}
              />
            ))}
          </div>

          <table>
            <thead>
              <tr>
                <th>Process</th>
                <th colSpan="3">Allocation [A B C]</th>
                <th colSpan="3">Request [A B C]</th>
                <th>Power (W)</th>
              </tr>
            </thead>
            <tbody>
              {processes.map((proc, i) => (
                <tr key={i}>
                  <td>P{i}</td>
                  {proc.allocation.map((val, j) => (
                    <td key={`a${j}`}><input type="number" value={val} onChange={e => updateCell(i, 'allocation', j, e.target.value)} /></td>
                  ))}
                  {proc.request.map((val, j) => (
                    <td key={`r${j}`}><input type="number" value={val} onChange={e => updateCell(i, 'request', j, e.target.value)} /></td>
                  ))}
                  <td><input type="number" value={proc.power} onChange={e => updatePower(i, e.target.value)} /></td>
                </tr>
              ))}
            </tbody>
          </table>

          <button className="submit-table" onClick={checkDeadlock}>Submit</button>

         {deadlock === false && (
  <div className="post-check-buttons">
    <button
      className="mode-button performance"
      onClick={() => navigate("/PowSav", { state: { powerLimit, processes, mode: "performance" } })}
    >
      Performance Mode
    </button>
    <button
      className="mode-button power-saving"
      onClick={() => navigate("/PowSav", { state: { powerLimit, processes, mode: "powerSaving" } })}
    >
      Power Saving Mode
    </button>
  </div>
)}
        </div>
      )}
    </div>
  );
};

export default TakeInput;