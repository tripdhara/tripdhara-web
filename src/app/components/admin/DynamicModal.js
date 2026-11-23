'use client';
import { useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';

export default function DynamicModal({
    isOpen,
    onClose,
    title,
    fields = [],
    formData = {},
    onChange,
    onSubmit,
    loading = false,
    submitText = 'Deploy',
    maxWidth = 'max-w-md'
}) {
    // Escape key press handler
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // Lock body scroll when modal is active
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 isolate animate-in fade-in duration-200"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dynamic-modal-title"
        >
            {/* Backdrop with click-to-close */}
            <div
                className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal Dialog Container */}
            <div
                className={`relative w-full ${maxWidth} max-h-[90vh] bg-[#0a0a0c] border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.9)] text-slate-200 flex flex-col overflow-hidden z-10 scale-100 animate-in zoom-in-95 duration-200`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Gradient Line */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>

                {/* Header */}
                <div className="p-5 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <h2 id="dynamic-modal-title" className="text-sm font-mono text-indigo-400 uppercase tracking-widest font-bold">
                        {title}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close modal dialog"
                        className="text-slate-500 hover:text-rose-400 transition-colors p-1.5 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body / Form */}
                <div className="overflow-y-auto flex-1">
                    <form onSubmit={onSubmit} className="p-6 space-y-4">
                        {fields.map((field) => (
                            <div key={field.name}>
                                {field.type === 'checkbox' ? (
                                    <label className="flex items-center gap-2 cursor-pointer group py-1">
                                        <input
                                            type="checkbox"
                                            checked={Boolean(formData[field.name])}
                                            onChange={(e) => onChange({ ...formData, [field.name]: e.target.checked })}
                                            className="form-checkbox bg-black border-white/20 text-indigo-500 rounded ring-offset-0 focus:ring-0"
                                        />
                                        <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 group-hover:text-slate-200 transition-colors">{field.label}</span>
                                    </label>
                                ) : field.type === 'select' ? (
                                    <>
                                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">{field.label}</label>
                                        <select
                                            value={formData[field.name] || ''}
                                            onChange={(e) => onChange({ ...formData, [field.name]: e.target.value })}
                                            className="w-full bg-black/40 px-4 py-2.5 border border-white/10 rounded-lg text-sm text-slate-200 outline-none focus:border-indigo-500/50 appearance-none"
                                            required={field.required}
                                        >
                                            <option value="" className="bg-black">Select {field.label}</option>
                                            {field.options?.map(opt => (<option key={opt.value} value={opt.value} className="bg-black">{opt.label}</option>))}
                                        </select>
                                    </>
                                ) : field.type === 'textarea' ? (
                                    <>
                                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">{field.label}</label>
                                        <textarea
                                            value={formData[field.name] || ''}
                                            onChange={(e) => onChange({ ...formData, [field.name]: e.target.value })}
                                            className="w-full bg-black/40 px-4 py-2.5 border border-white/10 rounded-lg text-sm text-slate-200 outline-none focus:border-indigo-500/50 min-h-[100px]"
                                            required={field.required}
                                            placeholder={field.placeholder}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">{field.label}</label>
                                        <input
                                            type={field.type || 'text'}
                                            value={formData[field.name] ?? ''}
                                            onChange={(e) => { if (field.onChange) field.onChange(e); else onChange({ ...formData, [field.name]: e.target.value }); }}
                                            className="w-full bg-black/40 px-4 py-2.5 border border-white/10 rounded-lg text-sm text-slate-200 outline-none focus:border-indigo-500/50 transition-all"
                                            required={field.required}
                                            placeholder={field.placeholder}
                                        />
                                    </>
                                )}
                            </div>
                        ))}

                        {/* Footer Actions */}
                        <div className="pt-4 flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 text-slate-300 font-mono text-xs uppercase tracking-wider rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                            >
                                Abort
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600/20 text-indigo-100 border border-indigo-500/40 hover:bg-indigo-600/40 font-mono text-xs uppercase tracking-wider rounded-lg transition-all shadow-[0_0_15px_rgba(99,102,241,0.2)] hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                {submitText}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
