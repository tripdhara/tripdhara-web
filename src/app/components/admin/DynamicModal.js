'use client';
import { useEffect, useRef } from 'react';
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
    submitText = 'Deploy'
}) {
    const dialogRef = useRef(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (isOpen) {
            if (!dialog.open) {
                dialog.showModal();
            }
        } else {
            if (dialog.open) {
                dialog.close();
            }
        }
    }, [isOpen]);

    // Native Esc key handling
    const handleCancel = (e) => {
        e.preventDefault();
        onClose();
    };

    // Light-dismiss: close when clicking on the backdrop
    const handlePointerDown = (e) => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        const rect = dialog.getBoundingClientRect();
        const isOutside = (
            e.clientX < rect.left ||
            e.clientX > rect.right ||
            e.clientY < rect.top ||
            e.clientY > rect.bottom
        );
        if (isOutside) {
            onClose();
        }
    };

    return (
        <dialog
            ref={dialogRef}
            onCancel={handleCancel}
            onPointerDown={handlePointerDown}
            aria-labelledby="dynamic-modal-title"
            className="m-auto bg-[#0a0a0c] border border-white/10 rounded-2xl w-full max-w-sm overflow-hidden flex flex-col relative shadow-[0_0_40px_rgba(0,0,0,1)] text-slate-200 outline-none p-0 backdrop:bg-black/60 backdrop:backdrop-blur-md overscroll-contain backdrop:overscroll-contain backdrop:overflow-hidden open:flex"
        >
            {/* Gradient Line */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>

            {/* Header */}
            <div className="p-5 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <h2 id="dynamic-modal-title" className="text-sm font-mono text-indigo-400 uppercase tracking-widest">{title}</h2>
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close modal dialog"
                    className="text-slate-500 hover:text-rose-400 transition-colors p-1 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Body / Form */}
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
        </dialog>
    );
}
