import React, { useState } from 'react';
import { X, Camera } from 'lucide-react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface ScanQRModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
}

export const ScanQRModal: React.FC<ScanQRModalProps> = ({ isOpen, onClose, userId }) => {
    const [scanned, setScanned] = useState(false);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleScan = async (detectedCodes: any[]) => {
        if (!detectedCodes || detectedCodes.length === 0 || scanned || loading) return;
        
        try {
            const resultText = detectedCodes[0].rawValue;
            const data = JSON.parse(resultText);

            if (data.type !== 'attendance_qr' || !data.event || !data.date) {
                toast.error('Invalid QR Code format.');
                return;
            }

            setScanned(true);
            setLoading(true);

            const { error } = await supabase
                .from('attendance')
                .upsert({
                    user_id: userId,
                    date: data.date,
                    event: data.event,
                    status: 'Present',
                    remarks: 'QR Scanned'
                }, {
                    onConflict: 'user_id,date,event'
                });

            if (error) throw error;

            toast.success('Attendance successfully recorded!');
            setTimeout(() => {
                onClose();
                setScanned(false);
            }, 1500);
        } catch (error: any) {
            console.error('QR Scan error:', error);
            toast.error('Failed to log attendance from QR Code. ' + (error.message || ''));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-container attendance-modal">
                <div className="modal-header">
                    <h2>Scan Attendance QR</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body">
                    {scanned ? (
                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                            <h3 style={{ color: '#10b981' }}>Processing attendance...</h3>
                        </div>
                    ) : (
                        <div style={{ position: 'relative', width: '100%', maxWidth: '400px', margin: '0 auto', overflow: 'hidden', borderRadius: '12px' }}>
                            <Scanner
                                onScan={handleScan}
                                styles={{ container: { width: '100%' } }}
                                components={{ finder: true }}
                            />
                            <div style={{ textAlign: 'center', marginTop: '1rem', color: '#6b7280' }}>
                                <Camera size={24} style={{ display: 'inline-block', marginBottom: '8px' }} />
                                <p>Point your camera at the QR code</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
