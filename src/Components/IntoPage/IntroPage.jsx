import React from 'react';
import { useNavigate } from 'react-router-dom';
import './IntroPage.css';

const IntroPage = () => {
    const navigate = useNavigate(); 

    const handleImplementClick = () => {
        navigate('/implement'); 
    };

    return (
        <div className="intro-container">
            <h1 className="intro-heading">Power Aware Process Scheduling</h1>
            
            <p className="intro-paragraph">
                <strong>Why This Project?</strong><br />
                This Project-Based Learning (PBL) initiative bridges the gap between textbook knowledge and
                real-world applications. By building a simulator, we demonstrate how <em>Power Aware Process Scheduling</em> works in practice.
                This approach helps users understand the importance of power efficiency in modern operating systems.
            </p>

            <p className="intro-paragraph">
                <strong>What is Power Aware Process Scheduling?</strong><br />
                Unlike traditional scheduling that focuses only on speed or fairness, power-aware scheduling
                considers energy consumption. It is especially beneficial for mobile phones, embedded systems,
                and IoT devices where battery life is critical.
                <a href="https://www.diva-portal.org/smash/get/diva2:542867/FULLTEXT01.pdf" target="_blank" rel="noopener noreferrer">
                    Learn more ↗
                </a>
            </p>

            <p className="intro-paragraph">
                <strong>What is Deadlock and Why It Matters?</strong><br />
                Deadlock is a state where processes cannot proceed because each is waiting for a resource held by another.
                It causes the system to freeze and negatively impacts performance, making its study crucial in OS design.
                 <a href="https://www.geeksforgeeks.org/introduction-of-deadlock-in-operating-system/" target="_blank" rel="noopener noreferrer">
                    Learn more ↗
                </a>
            </p>

            <p className="intro-paragraph">
                <strong>Deadlock Detection and Solutions:</strong><br />
                - Detection algorithms like <em>Resource Allocation Graph (RAG)</em> and <em>Banker's Algorithm</em> help identify deadlocks.<br />
                - Common solutions include:
                <ul>
                    <li><strong>Prevention:</strong> Designing the system so that deadlock is impossible.</li>
                    <li><strong>Avoidance:</strong> Allocating resources carefully to avoid circular waits.</li>
                    <li><strong>Detection & Recovery:</strong> Allowing deadlocks to happen and then handling them smartly.</li>
                </ul>
                <a href="https://www.geeksforgeeks.org/deadlock-detection-recovery/" target="_blank" rel="noopener noreferrer">
                    Learn more ↗
                </a>
            </p>

            <button className="implement-button" onClick={handleImplementClick}>
                Implement
            </button>
        </div>
    );
};

export default IntroPage;
