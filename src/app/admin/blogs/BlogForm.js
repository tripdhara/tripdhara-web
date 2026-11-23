"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    ArrowLeft, Save, Loader2, Image as ImageIcon, FileText,
    Settings, Tag, Eye, Type, AlignLeft, CalendarClock, Globe,
    CheckCircle2, Clock, Bold, Italic, Heading2, Heading3,
    List, ListOrdered, Quote, Code, Link2, Minus, Sparkles
} from 'lucide-react';
import api from '@/core/Api/index.js';
import { useToast } from '@/components/ui/ToastContext.js';
import Button from '@/components/ui/Button.js';

export default function BlogForm({ initialData = null, blogId = null }) {
    const router = useRouter();
    const textareaRef = useRef(null);
    const toast = useToast();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(Boolean(blogId && !initialData));
    const [activeTab, setActiveTab] = useState('write'); // 'write' | 'preview'

    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        excerpt: initialData?.excerpt || '',
        content: initialData?.content || '',
        coverImage: initialData?.coverImage || '',
        tags: Array.isArray(initialData?.tags) ? initialData.tags.join(', ') : (initialData?.tags || ''),
        status: initialData?.status || 'draft'
    });

    const isEditMode = Boolean(initialData?._id || blogId);

    // Fetch blog details when blogId is passed (Clean Architecture, no DB calls in page.js)
    useEffect(() => {
        if (blogId && !initialData) {
            setIsLoading(true);
            api.admin.blogs.getById(blogId)
                .then(res => {
                    const data = res?.data || res;
                    if (data) {
                        setFormData({
                            title: data.title || '',
                            excerpt: data.excerpt || '',
                            content: data.content || '',
                            coverImage: data.coverImage || '',
                            tags: Array.isArray(data.tags) ? data.tags.join(', ') : (data.tags || ''),
                            status: data.status || 'draft'
                        });
                    }
                })
                .catch(() => {
                    toast('Failed to load blog publication', 'error');
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [blogId, initialData, toast]);

    // Live slug generation preview
    const generatedSlug = useMemo(() => {
        return (formData.title || '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '') || 'your-publication-slug';
    }, [formData.title]);

    // Word count & reading time estimation
    const stats = useMemo(() => {
        const text = (formData.content || '').trim();
        const words = text ? text.split(/\s+/).length : 0;
        const readTime = Math.max(1, Math.ceil(words / 200));
        return { words, readTime };
    }, [formData.content]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Markdown insertion helper for toolbar
    const insertMarkdown = useCallback((before, after = '') => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selected = formData.content.substring(start, end);
        const replacement = before + (selected || 'text') + after;

        const newContent = formData.content.substring(0, start) + replacement + formData.content.substring(end);
        setFormData(prev => ({ ...prev, content: newContent }));

        setTimeout(() => {
            textarea.focus();
            const cursorPos = start + before.length + (selected ? selected.length : 4);
            textarea.setSelectionRange(cursorPos, cursorPos);
        }, 50);
    }, [formData.content]);

    const handleSubmit = async (e, forcedStatus = null) => {
        if (e) e.preventDefault();
        setIsSubmitting(true);

        const statusToApply = forcedStatus || formData.status;

        const payload = {
            ...formData,
            status: statusToApply,
            tags: typeof formData.tags === 'string'
                ? formData.tags.split(',').map(t => t.trim()).filter(Boolean)
                : (formData.tags || [])
        };

        try {
            const targetId = initialData?._id || blogId;
            let res;
            if (targetId) {
                res = await api.admin.blogs.update(targetId, payload);
            } else {
                res = await api.admin.blogs.create(payload);
            }

            if (res && (res.success || res.data)) {
                toast(`Publication ${statusToApply === 'published' ? 'published' : 'saved as draft'} successfully!`, 'success');
                setTimeout(() => router.push('/admin/blogs'), 800);
            } else {
                toast(res?.error || res?.message || 'Operation failed', 'error');
                setIsSubmitting(false);
            }
        } catch (error) {
            toast(error?.message || 'An error occurred. Please try again.', 'error');
            setIsSubmitting(false);
        }
    };

    // Safe, styled markdown preview parser
    const renderMarkdownPreview = (text) => {
        if (!text || !text.trim()) {
            return (
                <div className="flex flex-col items-center justify-center h-full min-h-[350px] text-slate-500 font-mono text-xs space-y-2">
                    <FileText className="w-8 h-8 opacity-30 text-indigo-400" />
                    <p>No content written yet. Switch to the Write tab to begin composition.</p>
                </div>
            );
        }

        const html = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-slate-100 mt-5 mb-2">$1</h3>')
            .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-white mt-6 mb-3 border-b border-white/10 pb-1.5">$1</h2>')
            .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-extrabold text-white mt-8 mb-4 border-b border-white/10 pb-2">$1</h1>')
            .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-bold text-white">$1</strong>')
            .replace(/\*(.*?)\*/gim, '<em class="italic text-slate-200">$1</em>')
            .replace(/`([^`]+)`/gim, '<code class="px-1.5 py-0.5 bg-black/60 border border-white/10 rounded text-amber-300 font-mono text-xs">$1</code>')
            .replace(/!\[(.*?)\]\((.*?)\)/gim, '<img src="$2" alt="$1" class="rounded-xl my-4 max-h-96 object-cover w-full border border-white/10 shadow-lg" />')
            .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-indigo-400 underline hover:text-indigo-300 font-medium">$1</a>')
            .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-indigo-500 pl-4 py-1.5 text-slate-300 italic my-3 bg-white/[0.03] rounded-r-lg">$1</blockquote>')
            .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc text-slate-300 my-1">$1</li>')
            .replace(/\n\n+/g, '</p><p class="my-3 leading-relaxed text-slate-300 text-sm">')
            .replace(/\n/g, '<br/>');

        return (
            <div 
                className="max-w-none text-slate-300 text-sm leading-relaxed p-6" 
                dangerouslySetInnerHTML={{ __html: `<p class="my-3 leading-relaxed text-slate-300 text-sm">${html}</p>` }} 
            />
        );
    };

    if (isLoading) {
        return (
            <div className="p-8 max-w-4xl mx-auto min-h-[500px] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                <p className="text-sm font-mono text-slate-400">Loading publication details...</p>
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-8 min-h-screen font-sans"
        >
            {/* Header Toolbar */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/5 pb-6">
                <div className="flex items-center gap-4">
                    <Link 
                        href="/admin/blogs" 
                        className="p-2.5 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 hover:text-white transition-colors border border-white/10 shadow-lg group"
                        title="Back to Blog Management"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </Link>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                            <FileText className="w-7 h-7 text-indigo-400 opacity-90" />
                            {isEditMode ? 'Edit Publication' : 'Compose Publication'}
                        </h1>
                        <p className="text-xs font-mono text-slate-500 tracking-wider uppercase mt-1 flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full animate-pulse ${formData.status === 'published' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-amber-500 shadow-[0_0_8px_#f59e0b]'}`}></span>
                            Status: <span className={formData.status === 'published' ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>{formData.status.toUpperCase()}</span>
                            &bull; <span className="text-slate-400">{stats.words} words</span>
                            &bull; <span className="text-slate-400">~{stats.readTime} min read</span>
                        </p>
                    </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push('/admin/blogs')}
                    >
                        Cancel
                    </Button>
                    <button
                        type="button"
                        onClick={(e) => handleSubmit(e, 'draft')}
                        disabled={isSubmitting || !formData.title.trim() || !formData.content.trim()}
                        className="flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-mono text-slate-300 hover:text-white transition-all disabled:opacity-40 cursor-pointer"
                    >
                        <Save size={13} className="text-amber-400" />
                        <span>Save as Draft</span>
                    </button>
                    <button
                        type="button"
                        onClick={(e) => handleSubmit(e, 'published')}
                        disabled={isSubmitting || !formData.title.trim() || !formData.content.trim()}
                        className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-mono font-bold transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-40 cursor-pointer"
                    >
                        <CheckCircle2 size={13} className="text-emerald-300" />
                        <span>{isEditMode ? 'Update & Publish' : 'Publish Live'}</span>
                    </button>
                </div>
            </div>

            <form onSubmit={(e) => handleSubmit(e, formData.status)} className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Main Content Column */}
                <div className="xl:col-span-2 space-y-6">
                    {/* Core Details (Title, Slug & Excerpt) */}
                    <div className="bg-[#111116] border border-white/5 rounded-2xl shadow-xl overflow-hidden">
                        <div className="p-5 border-b border-white/5 bg-white/[0.01]">
                            <h2 className="text-xs font-mono tracking-widest text-slate-300 uppercase flex items-center gap-2">
                                <Type className="w-3.5 h-3.5 text-indigo-400" /> Article Metadata
                            </h2>
                        </div>
                        <div className="p-6 space-y-5">
                            <div>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full px-0 py-2 bg-transparent border-0 border-b-2 border-white/10 focus:border-indigo-500 text-2xl md:text-3xl font-extrabold text-white placeholder-slate-600 focus:ring-0 transition-colors"
                                    placeholder="Enter publication title..."
                                />
                            </div>

                            {/* Live Slug Preview */}
                            <div className="flex items-center gap-2 text-xs font-mono bg-black/40 px-3 py-2 rounded-xl border border-white/5">
                                <Globe size={13} className="text-indigo-400 shrink-0" />
                                <span className="text-slate-500">Live URL Slug:</span>
                                <span className="text-indigo-300 font-semibold truncate select-all">
                                    /blogs/{generatedSlug}
                                </span>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-widest mb-2">
                                    <AlignLeft className="w-3 h-3" /> Excerpt Summary (SEO Meta Description)
                                </label>
                                <textarea
                                    name="excerpt"
                                    rows="2"
                                    value={formData.excerpt}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-[#0a0a0c] border border-white/10 rounded-xl text-slate-300 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none text-xs"
                                    placeholder="Brief summary used in cards, social shares, and search previews..."
                                />
                                <div className="text-right mt-1 text-[10px] font-mono text-slate-500">
                                    {formData.excerpt.length} / 160 characters recommended
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Editor & Markdown Toolbar */}
                    <div className="bg-[#111116] border border-white/5 rounded-2xl shadow-xl overflow-hidden flex flex-col min-h-[620px]">
                        <div className="p-4 border-b border-white/5 bg-white/[0.01] flex flex-wrap justify-between items-center gap-3">
                            <h2 className="text-xs font-mono tracking-widest text-slate-300 uppercase flex items-center gap-2">
                                <FileText className="w-3.5 h-3.5 text-emerald-400" /> Content Editor
                            </h2>

                            {/* Write vs Preview Mode Toggle */}
                            <div className="flex bg-white/5 rounded-xl p-1 border border-white/5">
                                <button 
                                    type="button" 
                                    onClick={() => setActiveTab('write')} 
                                    className={`px-3.5 py-1 text-xs font-mono tracking-wider uppercase rounded-lg transition-all ${
                                        activeTab === 'write' 
                                            ? 'bg-indigo-600 text-white font-bold shadow-md' 
                                            : 'text-slate-400 hover:text-white'
                                    }`}
                                >
                                    Write
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setActiveTab('preview')} 
                                    className={`px-3.5 py-1 text-xs font-mono tracking-wider uppercase rounded-lg transition-all flex items-center gap-1.5 ${
                                        activeTab === 'preview' 
                                            ? 'bg-indigo-600 text-white font-bold shadow-md' 
                                            : 'text-slate-400 hover:text-white'
                                    }`}
                                >
                                    <Eye className="w-3 h-3" />
                                    <span>Preview</span>
                                </button>
                            </div>
                        </div>

                        {/* Markdown Formatting Action Toolbar */}
                        {activeTab === 'write' && (
                            <div className="px-4 py-2 border-b border-white/5 bg-black/40 flex flex-wrap items-center gap-1">
                                {[
                                    { icon: Bold, label: 'Bold', action: () => insertMarkdown('**', '**'), title: 'Bold (**text**)' },
                                    { icon: Italic, label: 'Italic', action: () => insertMarkdown('*', '*'), title: 'Italic (*text*)' },
                                    { icon: Heading2, label: 'H2', action: () => insertMarkdown('## ', '\n'), title: 'Heading 2 (## Title)' },
                                    { icon: Heading3, label: 'H3', action: () => insertMarkdown('### ', '\n'), title: 'Heading 3 (### Subtitle)' },
                                    { icon: List, label: 'Bullet List', action: () => insertMarkdown('- ', '\n'), title: 'Bullet list (- item)' },
                                    { icon: ListOrdered, label: 'Numbered List', action: () => insertMarkdown('1. ', '\n'), title: 'Numbered list (1. item)' },
                                    { icon: Quote, label: 'Quote', action: () => insertMarkdown('> ', '\n'), title: 'Blockquote (> quote)' },
                                    { icon: Code, label: 'Code', action: () => insertMarkdown('`', '`'), title: 'Inline code (`code`)' },
                                    { icon: Link2, label: 'Link', action: () => insertMarkdown('[Link text](', ')'), title: 'Link ([text](url))' },
                                    { icon: ImageIcon, label: 'Image', action: () => insertMarkdown('![Image description](', ')'), title: 'Image (![alt](url))' },
                                    { icon: Minus, label: 'Divider', action: () => insertMarkdown('\n---\n'), title: 'Horizontal rule (---)' }
                                ].map((tool, idx) => {
                                    const IconComponent = tool.icon;
                                    return (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={tool.action}
                                            title={tool.title}
                                            className="p-1.5 hover:bg-white/10 text-slate-400 hover:text-indigo-300 rounded-lg transition-colors"
                                        >
                                            <IconComponent size={14} />
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        <div className="flex-1 p-0 relative">
                            {activeTab === 'write' ? (
                                <textarea
                                    ref={textareaRef}
                                    name="content"
                                    required
                                    value={formData.content}
                                    onChange={handleChange}
                                    className="w-full h-full min-h-[480px] p-6 bg-[#0a0a0c] border-0 text-slate-300 outline-none resize-none font-mono text-xs leading-loose custom-scrollbar focus:ring-0"
                                    placeholder="# Compose your travel story or editorial publication...&#10;&#10;Use standard Markdown or HTML. Use the toolbar above for quick formatting.&#10;&#10;## Key Highlights&#10;- Best season to visit&#10;- Local homestays and hidden trails&#10;- Transportation and cab route tips"
                                />
                            ) : (
                                <div className="w-full h-full min-h-[480px] bg-[#07070a] overflow-y-auto custom-scrollbar border-0">
                                    {renderMarkdownPreview(formData.content)}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-6">
                    {/* Media & Cover Image Card */}
                    <div className="bg-[#111116] border border-white/5 rounded-2xl shadow-xl overflow-hidden group">
                        <div className="p-5 border-b border-white/5">
                            <h2 className="text-xs font-mono tracking-widest text-slate-300 uppercase flex items-center gap-2">
                                <ImageIcon className="w-3.5 h-3.5 text-pink-400" /> Featured Cover Image
                            </h2>
                        </div>
                        <div className="p-5 space-y-4">
                            {formData.coverImage ? (
                                <div className="relative w-full h-44 rounded-xl overflow-hidden border border-white/10 group/img shadow-inner">
                                    <img 
                                        src={formData.coverImage} 
                                        alt="Cover Preview" 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105" 
                                        onError={() => toast('Invalid cover image URL', 'error')}
                                    />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                        <button 
                                            type="button" 
                                            onClick={() => setFormData(p => ({ ...p, coverImage: '' }))}
                                            className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 rounded-lg text-xs font-mono transition-colors"
                                        >
                                            Remove Image
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full h-44 border-2 border-dashed border-white/10 rounded-xl bg-[#0a0a0c] flex flex-col items-center justify-center text-slate-500">
                                    <ImageIcon className="w-8 h-8 mb-2 opacity-30 text-pink-400" />
                                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">No Cover Image</span>
                                    <span className="text-[9px] text-slate-500 mt-0.5">Paste a valid image URL below</span>
                                </div>
                            )}
                            <div>
                                <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Cover Image URL</label>
                                <input
                                    type="url"
                                    name="coverImage"
                                    value={formData.coverImage}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 bg-[#0a0a0c] border border-white/10 rounded-xl text-slate-300 focus:ring-1 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all text-xs font-mono"
                                    placeholder="https://images.unsplash.com/... or Cloudinary URL"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Google Search Snippet Card (SEO Preview) */}
                    <div className="bg-[#111116] border border-white/5 rounded-2xl p-5 space-y-3 shadow-xl">
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                                <Globe size={12} className="text-sky-400" /> Google Search Preview
                            </span>
                            <span className="text-[9px] font-mono text-slate-500">Live SEO</span>
                        </div>
                        <div className="space-y-1">
                            <div className="text-[11px] font-mono text-emerald-400 truncate">
                                https://tripdhara.in &gt; blogs &gt; {generatedSlug}
                            </div>
                            <div className="text-sm font-semibold text-sky-400 hover:underline line-clamp-1 cursor-pointer">
                                {formData.title || 'Enter a publication title to preview search snippet'}
                            </div>
                            <div className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                                {formData.excerpt || formData.content.slice(0, 140) || 'Discover authentic travel itineraries, verified homestays, and adventure packages across India with Tripdhara...'}
                            </div>
                        </div>
                    </div>

                    {/* Publishing & Tag Settings */}
                    <div className="bg-[#111116] border border-white/5 rounded-2xl shadow-xl overflow-hidden">
                        <div className="p-5 border-b border-white/5 bg-white/[0.01]">
                            <h2 className="text-xs font-mono tracking-widest text-slate-300 uppercase flex items-center gap-2">
                                <Settings className="w-3.5 h-3.5 text-indigo-400" /> Publishing Configurations
                            </h2>
                        </div>
                        <div className="p-5 space-y-5">
                            <div>
                                <label className="flex items-center gap-2 text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">
                                    <Globe className="w-3 h-3 text-indigo-400" /> Visibility Status
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 bg-[#0a0a0c] border border-white/10 rounded-xl text-slate-300 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-xs font-mono cursor-pointer"
                                >
                                    <option value="draft">Draft - Private / Unpublished</option>
                                    <option value="published">Published - Live on Platform</option>
                                </select>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">
                                    <Tag className="w-3 h-3 text-indigo-400" /> Categorization Tags
                                </label>
                                <input
                                    type="text"
                                    name="tags"
                                    value={formData.tags}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 bg-[#0a0a0c] border border-white/10 rounded-xl text-slate-300 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-xs font-mono"
                                    placeholder="Himachal, Trekking, Budget, Tips"
                                />
                                <p className="text-[9px] text-slate-500 mt-1 font-mono">Separate multiple tags with commas.</p>
                            </div>
                        </div>
                    </div>

                    {/* Meta Status Footer */}
                    <div className="bg-[#111116] border border-white/5 rounded-2xl p-4 text-center shadow-lg">
                        <div className="flex justify-center mb-1.5"><CalendarClock className="w-4 h-4 text-slate-500" /></div>
                        <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
                            {initialData ? `Last synchronized: ${new Date().toLocaleDateString()}` : 'Ready for publication'}
                        </p>
                    </div>
                </div>
            </form>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </motion.div>
    );
}