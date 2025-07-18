import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import './PowSav.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28EFF', '#FF6E6E'];

export default function PowSav() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { powerLimit, processes = [], mode } = state || {};

  const [burstTimes, setBurstTimes] = useState(
    processes.reduce((acc, p, i) => ({ ...acc, [p.id || `P${i}`]: p.burst || '' }), {})
  );
  const [entered, setEntered] = useState(
    !processes.some((p, i) => !p.burst)
  );

  const handleBurstChange = (id, val) => {
    setBurstTimes({ ...burstTimes, [id]: val });
  };

  const submitBursts = () => {
    processes.forEach((p, i) => {
      const id = p.id || `P${i}`;
      p.burst = burstTimes[id];
    });
    setEntered(true);
  };

  const altMode = mode === 'performance' ? 'powerSaving' : 'performance';
  const [showAlt, setShowAlt] = useState(false);

  const computeSchedule = useMemo(() => {
    return (targetMode) => {
      const list = processes.map((p, i) => ({ ...p, __id: p.id || `P${i}` }));
      if (targetMode === 'powerSaving') {
        list.sort((a, b) => parseFloat(a.power) - parseFloat(b.power));
      }
      let battery = parseFloat(powerLimit) || 0;
      let consumed = 0;
      let timeline = 0;
      const gantt = [];
      const pie = [];
      list.forEach((p) => {
        const id = p.__id;
        let powerReq = parseFloat(p.power) || 0;
        if (targetMode === 'powerSaving' && powerReq > 20) {
          powerReq = parseFloat((powerReq * 0.8).toFixed(2));
        }
        if (battery < powerReq) return;
        battery -= powerReq;
        consumed += powerReq;
        const duration = parseFloat(p.burst) || 0;
        gantt.push({ name: id, start: timeline, duration, power: powerReq });
        timeline += duration;
        pie.push({ name: id, value: powerReq });
      });
      return {
        pieData: pie,
        ganttData: gantt,
        total: parseFloat(consumed.toFixed(2)),
        left: parseFloat(battery.toFixed(2)),
      };
    };
  }, [processes, powerLimit]);

  if (!state) return <p className="error">No data provided.</p>;

  if (!entered) {
    return (
      <div className="burst-input">
        <h2>Enter Burst Times (ms) for each process</h2>
        {processes.map((p, i) => {
          const id = p.id || `P${i}`;
          return (
            <div key={id} className="burst-row">
              <label>{id}:</label>
              <input
                type="number"
                value={burstTimes[id]}
                onChange={e => handleBurstChange(id, e.target.value)}
                placeholder="ms"
              />
            </div>
          );
        })}
        <button className="submit-burst" onClick={submitBursts}>Submit</button>
      </div>
    );
  }

  const orig = computeSchedule(mode);
  const alt = computeSchedule(altMode);

  return (
    <div className="pow-sav-page">
      <h1>Power-Aware Scheduling</h1>
      <button className="back-button" onClick={() => navigate(-1)}>Back</button>
      <section className="original-info">
        <h2>Original Powers</h2>
        <ul>
          {processes.map((p, i) => {
            const id = p.id || `P${i}`;
            return <li key={id}>{id}: {parseFloat(p.power).toFixed(2)} W</li>;
          })}
        </ul>
      </section>
      {[{ data: orig, title: mode }, showAlt && { data: alt, title: altMode }]
        .filter(Boolean)
        .map(({ data, title }, idx) => (
          <div key={idx} className="mode-section">
            <h2>{title === 'performance' ? 'Performance Mode' : 'Power Saving Mode'}</h2>
            <div className="charts-container">
              <div className="chart pie-chart">
                <h3>Power Consumption</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={data.pieData} dataKey="value" nameKey="name" outerRadius={80} label>
                      {data.pieData.map((e, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={val => `${val} W`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="chart gantt-chart">
                <h3>Gantt Chart (ms)</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart layout="vertical" data={data.ganttData}>
                    <XAxis type="number" domain={[0, 'dataMax']} />
                    <YAxis type="category" dataKey="name" />
                    <Tooltip formatter={val => `${val} ms`} />
                    <Bar dataKey="duration" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="summary">
              <p><strong>Total Consumed:</strong> {data.total} W</p>
              <p><strong>Battery Left:</strong> {data.left} W</p>
            </div>
            {idx === 0 && (
              <button className="toggle-button" onClick={() => setShowAlt(!showAlt)}>
                View {altMode === 'performance' ? 'Performance' : 'Power Saving'} Mode
              </button>
            )}
          </div>
        ))}
    </div>
  );
}
