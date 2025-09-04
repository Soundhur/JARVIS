import React, { useState, useEffect } from 'react';

const statusOptions = {
    firewall: ['ACTIVE | ENCRYPTED', 'MAINTENANCE', 'MONITORING'],
    network: ['STABLE | 99.8% UPTIME', 'OPTIMIZING ROUTES', 'UNDER DURESS'],
};
const threatLevels = ['NONE DETECTED', 'LOW', 'ELEVATED', 'CRITICAL'];
const threatColors = {
    'NONE DETECTED': 'text-green-400',
    'LOW': 'text-yellow-400',
    'ELEVATED': 'text-orange-500',
    'CRITICAL': 'text-red-500 animate-pulse',
};

const SecurityItem: React.FC<{ label: string; value: string; valueColor?: string }> = ({ label, value, valueColor = 'text-cyan-300' }) => (
    <div className="flex justify-between items-center py-2 border-b border-cyan-800/30 last:border-b-0">
        <span className="text-cyan-400 text-sm">{label}</span>
        <span className={`text-sm tracking-wider ${valueColor}`}>{value}</span>
    </div>
);


const SecurityModule: React.FC = () => {
    const [firewallStatus, setFirewallStatus] = useState(statusOptions.firewall[0]);
    const [networkStatus, setNetworkStatus] = useState(statusOptions.network[0]);
    const [threatLevel, setThreatLevel] = useState(threatLevels[0]);

    useEffect(() => {
        const interval = setInterval(() => {
            // Occasionally change status to something more dramatic
            if (Math.random() > 0.95) {
                setFirewallStatus(statusOptions.firewall[1]);
                setNetworkStatus(statusOptions.network[2]);
                setThreatLevel(threatLevels[Math.floor(Math.random() * 2) + 1]); // Low or Elevated
            } else {
                setFirewallStatus(statusOptions.firewall[0]);
                setNetworkStatus(statusOptions.network[0]);
                setThreatLevel(threatLevels[0]);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="font-mono">
            <SecurityItem label="FIREWALL INTEGRITY" value={firewallStatus} />
            <SecurityItem label="GLOBAL NETWORK" value={networkStatus} />
            <SecurityItem 
                label="THREAT ANALYSIS" 
                value={threatLevel} 
                valueColor={threatColors[threatLevel as keyof typeof threatColors]} 
            />
            <div className="mt-4 text-center text-green-400 font-mono text-xs">
                <p>PROTOCOL 7-G ACTIVE | ALL CHANNELS SECURE</p>
            </div>
        </div>
    );
};

export default SecurityModule;
