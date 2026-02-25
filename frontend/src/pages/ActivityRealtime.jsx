import React, { useState, useEffect } from 'react';
import { Camera, MousePointer2, Keyboard, ExternalLink, ShieldCheck } from 'lucide-react';
import api from '../utils/api';

const ActivityRealtime = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const { data } = await api.get('/activities/today');
                setActivities(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchActivities();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-1">Real-time Activity</h1>
                    <p className="text-slate-500">Monitor active sessions and productivity metrics.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100 font-medium">
                    <ShieldCheck size={18} />
                    Tracking Active
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {activities.map((activity, idx) => (
                    <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                        <div className="aspect-video bg-slate-900 relative flex items-center justify-center">
                            {activity.screenshot ? (
                                <img src={activity.screenshot} alt="Screenshot" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                            ) : (
                                <Camera size={48} className="text-slate-700" />
                            )}
                            <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] text-white font-bold uppercase tracking-wider">
                                {new Date(activity.startTime).toLocaleTimeString()}
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-slate-900 truncate flex-1">{activity.appName || 'Unknown App'}</h3>
                                <ExternalLink size={14} className="text-slate-400" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2 text-slate-500">
                                    <Keyboard size={14} />
                                    <span className="text-xs font-semibold">{activity.keyboardCount || 0} keys</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-500">
                                    <MousePointer2 size={14} />
                                    <span className="text-xs font-semibold">{activity.mouseCount || 0} clicks</span>
                                </div>
                            </div>
                            <div className="mt-6">
                                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                                    <span>Activity Level</span>
                                    <span>{activity.activityLevel || 0}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-indigo-600 rounded-full"
                                        style={{ width: `${activity.activityLevel || 0}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActivityRealtime;
