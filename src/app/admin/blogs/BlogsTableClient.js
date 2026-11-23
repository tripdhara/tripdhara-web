'use client';

import { useState, useEffect, useCallback, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
    FileText, Plus, CheckCircle2, Clock, Edit2, 
    ExternalLink, RefreshCw, Image as ImageIcon, Tag
} from 'lucide-react';
import PageHeader from '@/components/admin/PageHeader.js';
import CyberTable from '@/components/admin/CyberTable.js';
import DeleteBlogButton from './DeleteBlogButton.js';
import api from '@/core/Api/index.js';

export default function BlogsTableClient({ 
    initialBlogs = [], 
    totalItems = 0, 
    initialPage = 1, 
    initialSearch = '' 
}) {
    const router = useRouter();
    const [blogs, setBlogs] = useState(initialBlogs);
    const [total, setTotal] = useState(totalItems);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'published' | 'draft'
    const [loading, setLoading] = useState(initialBlogs.length === 0);

    // Fetch blogs from API Client (Decoupled from Server DB calls)
    const fetchBlogs = useCallback(async (page = 1, search = '', status = 'all') => {
        setLoading(true);
        try {
            const params = { page, limit: 10 };
            if (search && search.trim()) params.search = search.trim();
            if (status && status !== 'all') params.status = status;

            const res = await api.admin.blogs.getAll(params);
            const payload = res?.data || res;
            setBlogs(payload?.docs || []);
            setTotal(payload?.total || 0);
            setCurrentPage(page);
        } catch (error) {
            console.error('[BlogsTableClient] Failed to fetch blogs:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial fetch if no initialBlogs passed
    useEffect(() => {
        if (initialBlogs.length === 0) {
            fetchBlogs(1, searchQuery, statusFilter);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchBlogs(1, searchQuery, statusFilter);
        }, 350);
        return () => clearTimeout(timer);
    }, [searchQuery, statusFilter, fetchBlogs]);

    const handlePageChange = (newPage) => {
        fetchBlogs(newPage, searchQuery, statusFilter);
    };

    const handleDeleteSuccess = (deletedId) => {
        setBlogs(prev => prev.filter(blog => blog._id?.toString() !== deletedId?.toString()));
        setTotal(t => Math.max(0, t - 1));
    };

    const columns = [
        {
            header: 'Publication',
            accessor: 'title',
            className: 'w-2/5 min-w-[280px]',
            render: (blog) => (
                <div className="flex items-center gap-3.5">
                    {blog.coverImage ? (
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-black/40 border border-white/10 shrink-0">
                            <img 
                                src={blog.coverImage} 
                                alt={blog.title} 
                                className="w-full h-full object-cover" 
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                        </div>
                    ) : (
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 text-indigo-400">
                            <ImageIcon size={18} />
                        </div>
                    )}
                    <div className="flex flex-col items-start gap-1 overflow-hidden">
                        <Link 
                            href={`/admin/blogs/${blog._id}/edit`} 
                            className="font-bold text-slate-200 hover:text-indigo-400 transition-colors line-clamp-1 text-sm text-left"
                            title={blog.title}
                        >
                            {blog.title}
                        </Link>
                        <div className="text-[11px] font-mono text-slate-500 truncate max-w-[220px]">
                            /{blog.slug}
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: 'Author',
            accessor: 'author.name',
            tdClassName: 'text-xs text-slate-300 font-mono',
            render: (blog) => blog.author?.name || 'Tripdhara Editorial'
        },
        {
            header: 'Tags',
            accessor: 'tags',
            render: (blog) => {
                const tags = Array.isArray(blog.tags) ? blog.tags : [];
                if (tags.length === 0) return <span className="text-slate-600 text-xs font-mono">—</span>;
                return (
                    <div className="flex flex-wrap gap-1 max-w-[180px]">
                        {tags.slice(0, 2).map((tag, idx) => (
                            <span key={idx} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                                {tag}
                            </span>
                        ))}
                        {tags.length > 2 && (
                            <span className="text-[10px] font-mono px-1 py-0.5 text-slate-500">
                                +{tags.length - 2}
                            </span>
                        )}
                    </div>
                );
            }
        },
        {
            header: 'Status',
            accessor: 'status',
            render: (blog) => {
                if (blog.status === 'published') {
                    return (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                            <CheckCircle2 className="w-3 h-3" /> Published
                        </span>
                    );
                }
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                        <Clock className="w-3 h-3" /> Draft
                    </span>
                );
            }
        },
        {
            header: 'Published / Date',
            accessor: 'publishedAt',
            tdClassName: 'text-xs text-slate-400 font-mono',
            render: (blog) => {
                const dateVal = blog.publishedAt || blog.createdAt;
                return dateVal ? new Date(dateVal).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
            }
        },
        {
            header: 'Actions',
            className: 'text-right',
            tdClassName: 'text-right',
            render: (blog) => (
                <div className="flex items-center justify-end gap-2">
                    {/* Public Preview Link */}
                    {blog.slug && (
                        <a 
                            href={`/blogs/${blog.slug}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-1.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg transition-colors border border-white/10"
                            title="View Public Post"
                        >
                            <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                    )}
                    {/* Edit Publication */}
                    <Link 
                        href={`/admin/blogs/${blog._id}/edit`} 
                        className="p-1.5 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 rounded-lg transition-colors border border-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.1)]"
                        title="Edit Publication"
                    >
                        <Edit2 className="w-3.5 h-3.5" />
                    </Link>
                    {/* Delete Publication */}
                    <DeleteBlogButton 
                        blogId={blog._id.toString()} 
                        onDeleteSuccess={handleDeleteSuccess}
                    />
                </div>
            )
        }
    ];

    return (
        <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
            <PageHeader 
                title="Blog Management" 
                subtitle="Create, curate, and manage your platform's editorial publications" 
                icon={FileText} 
                searchQuery={searchQuery} 
                onSearchChange={setSearchQuery} 
                actionLabel="New Post" 
                actionIcon={Plus} 
                onAction={() => router.push('/admin/blogs/create')} 
            />

            {/* Status Filter Tabs & Refresh Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white/[0.02] p-2.5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-1.5 text-xs font-mono">
                    {[
                        { key: 'all', label: 'All Posts' },
                        { key: 'published', label: 'Published' },
                        { key: 'draft', label: 'Drafts' }
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setStatusFilter(tab.key)}
                            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                                statusFilter === tab.key
                                    ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-slate-500">
                        Total: <strong className="text-slate-200">{total}</strong> publication(s)
                    </span>
                    <button
                        onClick={() => fetchBlogs(currentPage, searchQuery, statusFilter)}
                        disabled={loading}
                        className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors disabled:opacity-40"
                        title="Refresh publications"
                    >
                        <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            <CyberTable 
                data={blogs} 
                columns={columns} 
                itemsPerPage={10} 
                loading={loading}
                loadingText="Querying Editorial Core..."
                emptyText={searchQuery ? 'No blogs match your search query.' : 'No publications found in this vector.'}
                exportFilename="tripdhara_blogs_export"
                
                // Server-side Pagination
                totalItems={total}
                externalCurrentPage={currentPage}
                onPageChange={handlePageChange}
                
                // Handled via external search state
                searchable={false} 
            />
        </div>
    );
}