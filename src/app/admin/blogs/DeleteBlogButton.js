"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import api from '@/core/Api/index.js';
import Button from '@/components/ui/Button.js';
import { useToast } from '@/components/ui/ToastContext.js';

export default function DeleteBlogButton({ blogId, onDeleteSuccess }) {
    const router = useRouter();
    const toast = useToast();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this publication?')) return;
        setIsDeleting(true);
        try {
            const res = await api.admin.blogs.delete(blogId);
            if (res && (res.success || res.status === 200 || !res.error)) {
                toast('Blog deleted successfully', 'success');
                if (onDeleteSuccess) {
                    onDeleteSuccess(blogId);
                } else {
                    router.refresh();
                }
            } else {
                toast(res?.error || res?.message || 'Failed to delete blog', 'error');
            }
        } catch (error) {
            toast(error?.message || 'Failed to delete blog', 'error');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Button 
            variant="danger" 
            size="icon" 
            onClick={handleDelete} 
            icon={Trash2}
            isLoading={isDeleting}
            title="Delete Blog"
        />
    );
}
