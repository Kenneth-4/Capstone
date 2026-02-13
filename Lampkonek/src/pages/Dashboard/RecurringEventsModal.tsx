import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import './RecurringEventsModal.css';

interface RecurringEventsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpdate: () => void;
}

interface RecurringEventConfig {
    key: string;
    title: string;
    dayOfWeek: number; // 0=Sunday, 1=Monday, ...
    time: string;
    endTime: string;
    enabled: boolean;
    venue: string;
}

const DEFAULT_CONFIG: RecurringEventConfig[] = [
    { key: 'sunday_service', title: 'Sunday Service', dayOfWeek: 0, time: '09:00', endTime: '11:00', enabled: true, venue: 'Main Sanctuary' },
    { key: 'prayer_meeting', title: 'Prayer Meeting', dayOfWeek: 1, time: '19:00', endTime: '20:30', enabled: true, venue: 'Prayer Room' },
    { key: 'bible_study', title: 'Bible Study', dayOfWeek: 5, time: '18:00', endTime: '19:30', enabled: true, venue: 'Community Hall' },
];

export const RecurringEventsModal: React.FC<RecurringEventsModalProps> = ({ isOpen, onClose, onUpdate }) => {
    const [config, setConfig] = useState<RecurringEventConfig[]>(DEFAULT_CONFIG);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchConfig();
        }
    }, [isOpen]);

    const fetchConfig = async () => {
        try {
            setLoading(true);
            const { data } = await supabase
                .from('app_settings')
                .select('value')
                .eq('key', 'recurring_events')
                .single();

            if (data && data.value) {
                // Merge loaded config with default to ensure structure
                const loaded: RecurringEventConfig[] = JSON.parse(data.value);
                const merged = DEFAULT_CONFIG.map(def => {
                    const found = loaded.find(l => l.key === def.key);
                    return found ? { ...def, ...found } : def;
                });
                setConfig(merged);
            }
        } catch (error) {
            // If not found, use default
            console.log('No recurring settings found, using defaults');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            const { error } = await supabase
                .from('app_settings')
                .upsert({
                    key: 'recurring_events',
                    value: JSON.stringify(config)
                });

            if (error) throw error;
            toast.success('Recurring events updated');
            onUpdate();
            onClose();
        } catch (error: any) {
            console.error('Error saving settings:', error);
            toast.error('Failed to save settings');
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = (key: string) => {
        setConfig(prev => prev.map(item =>
            item.key === key ? { ...item, enabled: !item.enabled } : item
        ));
    };

    if (!isOpen) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal-container recurring-modal">
                <div className="modal-header">
                    <h2>Manage Recurring Events</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="modal-body">
                    <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
                        Enable automatic events that repeat weekly. These will appear in the calendar automatically.
                    </p>

                    <div className="recurring-list">
                        {config.map(item => (
                            <div key={item.key} className={`recurring-item ${item.enabled ? 'active' : ''}`}>
                                <div className="recurring-info">
                                    <h4 className="recurring-title">{item.title}</h4>
                                    <div className="recurring-meta">
                                        <div className="meta-row">
                                            <Calendar size={14} />
                                            <span>
                                                Every {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][item.dayOfWeek]}
                                            </span>
                                        </div>
                                        <div className="meta-row">
                                            <Clock size={14} />
                                            <span>{item.time} - {item.endTime}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="toggle-switch">
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            checked={item.enabled}
                                            onChange={() => handleToggle(item.key)}
                                        />
                                        <span className="slider round"></span>
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn-cancel" onClick={onClose}>Cancel</button>
                    <button className="btn-save" onClick={handleSave} disabled={loading}>
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};
