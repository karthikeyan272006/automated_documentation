import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { FileText, Download, Wand2, Zap, Calendar, ArrowRight } from 'lucide-react';

const Reports = () => {
    const [reports, setReports] = useState([]);
    const [generating, setGenerating] = useState(false);

    const fetchReports = async () => {
        try {
            const { data } = await api.get('/reports');
            setReports(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const generateReport = async (type) => {
        setGenerating(true);
        try {
            await api.post('/reports', { type });
            fetchReports();
        } catch (error) {
            console.error('Error generating report:', error);
            alert('Failed to generate report');
        } finally {
            setGenerating(false);
        }
    };

    const handlePrint = (report) => {
        const printWindow = window.open('', '', 'width=800,height=600');
        printWindow.document.write(`
            <html>
                <head>
                    <title>${report.type.toUpperCase()} Report - ${new Date(report.generatedAt).toLocaleDateString()}</title>
                    <style>
                        body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; line-height: 1.6; color: #1e293b; }
                        h1 { color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 30px; }
                        .meta { color: #64748b; font-size: 14px; margin-bottom: 30px; }
                        pre { white-space: pre-wrap; background: #f8fafc; padding: 25px; border-radius: 12px; border: 1px solid #e2e8f0; font-family: inherit; }
                        .footer { margin-top: 50px; font-size: 12px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; }
                    </style>
                </head>
                <body>
                    <h1>${report.type.charAt(0).toUpperCase() + report.type.slice(1)} Performance Report</h1>
                    <div class="meta">
                        <p><strong>Date Generated:</strong> ${new Date(report.generatedAt).toLocaleString()}</p>
                        <p><strong>Organization:</strong> Hubstaff Clone Enterprise</p>
                    </div>
                    <h3>Activity Summary</h3>
                    <pre>${report.summaryText}</pre>
                    <div class="footer">
                        &copy; ${new Date().getFullYear()} Hubstaff Clone. All rights reserved.
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    };

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-1">Reports & Analytics</h1>
                    <p className="text-slate-500">Generate and export detailed productivity reports.</p>
                </div>
                <div className="flex gap-4">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium">
                        <Calendar size={18} />
                        Custom Range
                    </button>
                    <button className="btn-hubstaff">
                        New Schedule
                    </button>
                </div>
            </div>

            {/* Generators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {['daily', 'weekly', 'monthly'].map((type) => (
                    <div key={type} className="bg-white p-8 rounded-3xl border border-slate-200 hover:border-indigo-300 transition-all duration-300 group">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl w-fit mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                            <Wand2 size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 capitalize mb-2">{type} Productivity</h3>
                        <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                            A complete breakdown of time, activity levels, and app usage for the {type} period.
                        </p>
                        <button
                            onClick={() => generateReport(type)}
                            disabled={generating}
                            className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-50"
                        >
                            {generating ? 'Processing...' : <><Zap size={16} /> Generate Report</>}
                        </button>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="font-bold text-slate-900">Recently Generated</h2>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{reports.length} Reports</span>
                </div>
                <div className="divide-y divide-slate-50">
                    {reports.length > 0 ? (
                        reports.map((report) => (
                            <div key={report._id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-slate-100 rounded-xl text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 capitalize">
                                            {report.type} Performance Summary
                                        </h4>
                                        <p className="text-xs text-slate-400 font-medium">
                                            {new Date(report.generatedAt).toLocaleDateString()} at {new Date(report.generatedAt).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => handlePrint(report)}
                                        className="p-2 text-slate-400 hover:text-indigo-600 transition-all"
                                        title="Download PDF"
                                    >
                                        <Download size={20} />
                                    </button>
                                    <button className="p-2 text-slate-400 hover:text-slate-600 transition-all">
                                        <ArrowRight size={20} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-20 text-center">
                            <FileText size={48} className="mx-auto text-slate-200 mb-4" />
                            <p className="text-slate-400 font-medium">No reports generated yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Reports;

