'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import api from '@/core/Api/index.js';
import DynamicModal from '@/components/admin/DynamicModal.js';
import CyberTable from '@/components/admin/CyberTable.js';
import Loading from '@/components/admin/Loading.js';
import { useToast } from '@/components/ui/ToastContext.js';
import { Search, Plus, FileText, CheckCircle2, XCircle, RefreshCw, Layers, Edit2, Trash2 } from 'lucide-react';

export default function CategoryDocClientWrapper() {
    const toast = useToast();

    const [documents, setDocuments] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDoc, setEditingDoc] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        category_slug: '',
        isMandatory: true,
        isActive: true
    });

    // Fetch documents and categories via Api client
    useEffect(() => {
        let isMounted = true;
        const loadData = async () => {
            try {
                const [docRes, catRes] = await Promise.all([
                    api.admin.documents.getAll({ limit: 100 }),
                    api.admin.categories.getAll()
                ]);
                if (!isMounted) return;

                const docList = docRes?.data?.docs || docRes?.data || [];
                const catList = catRes?.data?.categories || catRes?.data || [];

                setDocuments(Array.isArray(docList) ? docList : []);
                setCategories(Array.isArray(catList) ? catList : []);
            } catch (err) {
                if (isMounted) toast(err?.message || 'Failed to load category documents', 'error');
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        loadData();
        return () => {
            isMounted = false;
        };
    }, [refreshKey, toast]);

    // Modal Fields Configuration
    const modalFields = useMemo(() => [
        {
            name: 'category_slug',
            label: 'Target Category',
            type: 'select',
            required: true,
            options: categories.map(cat => ({ value: cat.slug, label: cat.name }))
        },
        {
            name: 'name',
            label: 'Packet Name',
            type: 'text',
            required: true,
            placeholder: 'e.g. Mountaineering License',
            onChange: (e) => {
                const name = e.target.value;
                const autoSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                setFormData(prev => ({
                    ...prev,
                    name,
                    slug: editingDoc ? prev.slug : autoSlug
                }));
            }
        },
        {
            name: 'slug',
            label: 'Identifier (Slug)',
            type: 'text',
            required: true,
            placeholder: 'e.g. mountaineering-license'
        },
        {
            name: 'isMandatory',
            label: 'Is Mandatory Requirement?',
            type: 'checkbox'
        },
        {
            name: 'isActive',
            label: 'Is Active?',
            type: 'checkbox'
        }
    ], [categories, editingDoc]);

    // Filtered documents by category & search
    const filteredDocuments = useMemo(() => {
        return documents.filter(doc => {
            if (selectedCategory !== 'all' && doc.category_slug !== selectedCategory) {
                return false;
            }
            return true;
        });
    }, [documents, selectedCategory]);

    const openModal = (doc = null) => {
        setEditingDoc(doc);
        if (doc) {
            setFormData({
                name: doc.name || '',
                slug: doc.slug || '',
                category_slug: doc.category_slug || (categories[0]?.slug || ''),
                isMandatory: doc.isMandatory !== false,
                isActive: doc.isActive !== false
            });
        } else {
            setFormData({
                name: '',
                slug: '',
                category_slug: selectedCategory !== 'all' ? selectedCategory : (categories[0]?.slug || ''),
                isMandatory: true,
                isActive: true
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingDoc(null);
        setFormData({ name: '', slug: '', category_slug: '', isMandatory: true, isActive: true });
    };

    const handleSubmit = async (e) => {
        if (e?.preventDefault) e.preventDefault();
        setModalLoading(true);
        try {
            if (editingDoc) {
                await api.admin.documents.update(editingDoc._id, formData);
                toast('Document updated successfully', 'success');
            } else {
                await api.admin.documents.create(formData);
                toast('Document created successfully', 'success');
            }
            closeModal();
            setRefreshKey(k => k + 1);
        } catch (err) {
            toast(err?.message || 'Error saving document', 'error');
        } finally {
            setModalLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this document protocol? This action is irreversible.')) return;
        try {
            await api.admin.documents.delete(id);
            toast('Document protocol deleted', 'success');
            setRefreshKey(k => k + 1);
        } catch (err) {
            toast(err?.message || 'Error deleting document', 'error');
        }
    };

    const handleToggleField = async (doc, field) => {
        try {
            const nextValue = !doc[field];
            await api.admin.documents.update(doc._id, { [field]: nextValue });
            toast(`${field === 'isActive' ? 'Status' : 'Requirement'} updated`, 'success');
            setRefreshKey(k => k + 1);
        } catch (err) {
            toast(err?.message || 'Failed to update field', 'error');
        }
    };

    const columns = [
        {
            header: 'S.No',
            className: 'w-[5%]',
            tdClassName: 'text-center font-mono text-[11px] text-slate-500',
            render: (_, i) => i + 1
        },
        {
            header: 'Status',
            render: (doc) => (
                <button
                    onClick={() => handleToggleField(doc, 'isActive')}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-mono tracking-widest uppercase transition-all cursor-pointer font-bold ${doc.isActive !== false
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20'
                        }`}
                >
                    {doc.isActive !== false ? 'Active' : 'Inactive'}
                </button>
            )
        },
        {
            header: 'Name',
            render: (doc) => (
                <div className="font-bold text-slate-200 hover:text-white transition-colors">
                    {doc.name}
                </div>
            )
        },
        {
            header: 'Slug / Identifier',
            tdClassName: 'font-mono text-xs text-slate-400',
            render: (doc) => doc.slug
        },
        {
            header: 'Category',
            render: (doc) => {
                const cat = categories.find(c => c.slug === doc.category_slug);
                return (
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-mono tracking-widest uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">
                        {cat?.name || doc.category_slug}
                    </span>
                );
            }
        },
        {
            header: 'Requirement',
            render: (doc) => (
                <button
                    onClick={() => handleToggleField(doc, 'isMandatory')}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-mono tracking-widest uppercase transition-all cursor-pointer font-bold ${doc.isMandatory
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20'
                        : 'bg-slate-800 text-slate-400 border border-white/10 hover:text-slate-200'
                        }`}
                >
                    {doc.isMandatory ? 'Required' : 'Optional'}
                </button>
            )
        },
        {
            header: 'Actions',
            className: 'text-right',
            tdClassName: 'text-right',
            render: (doc) => (
                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => openModal(doc)}
                        className="text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 p-2 rounded-lg border border-transparent hover:border-indigo-500/20 transition-colors cursor-pointer"
                        title="Edit Document Protocol"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDelete(doc._id)}
                        className="text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 p-2 rounded-lg border border-transparent hover:border-rose-500/20 transition-colors cursor-pointer"
                        title="Delete Document Protocol"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    if (loading && documents.length === 0) {
        return <Loading message="Syncing Category Document Protocols..." />;
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                        <FileText className="w-7 h-7 text-indigo-400" /> Data Packets
                    </h1>
                    <p className="text-xs font-mono text-slate-500 uppercase mt-1 tracking-widest">
                        Category Compliance & Verification Documents
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative group hidden md:block">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Scan protocols..."
                            className="bg-[#0a0a0c]/80 backdrop-blur-xl pl-10 pr-4 py-2 border border-white/10 rounded-lg outline-none text-sm text-slate-200 w-64 focus:border-indigo-500/50 transition-colors"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="flex items-center gap-2 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 px-4 py-2 rounded-lg hover:bg-indigo-600/40 hover:text-white transition-all font-medium text-sm cursor-pointer shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                    >
                        <Plus className="w-4 h-4" /> Add Doc
                    </button>
                </div>
            </div>

            {/* Category Filter Bar */}
            {categories.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-3 cyber-scrollbar scrollbar-none mb-0">
                    <button
                        onClick={() => setSelectedCategory('all')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer whitespace-nowrap ${selectedCategory === 'all'
                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-[0_0_10px_rgba(99,102,241,0.2)]'
                            : 'bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10 hover:text-slate-200'
                            }`}
                    >
                        All Categories ({documents.length})
                    </button>
                    {categories.map(cat => {
                        const count = documents.filter(d => d.category_slug === cat.slug).length;
                        const isSelected = selectedCategory === cat.slug;
                        return (
                            <button
                                key={cat.slug}
                                onClick={() => setSelectedCategory(cat.slug)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer whitespace-nowrap ${isSelected
                                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-[0_0_10px_rgba(99,102,241,0.2)]'
                                    : 'bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10 hover:text-slate-200'
                                    }`}
                            >
                                {cat.name} ({count})
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Main Table */}
            <CyberTable
                data={filteredDocuments}
                columns={columns}
                itemsPerPage={15}
                searchTerm={searchQuery}
                searchKeys={['name', 'slug', 'category_slug']}
                emptyText="NULL OUTPUT: No validation documents found."
            />

            {/* Add / Edit Modal */}
            <DynamicModal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={editingDoc ? 'Edit Validation Doc' : 'Add Validation Doc'}
                fields={modalFields}
                formData={formData}
                onChange={setFormData}
                onSubmit={handleSubmit}
                loading={modalLoading}
                submitText={editingDoc ? 'Update Protocol' : 'Deploy Protocol'}
            />
        </div>
    );
}
