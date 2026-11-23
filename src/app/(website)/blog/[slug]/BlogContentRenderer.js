import React from 'react';
import { Info, Sparkles, AlertTriangle, CheckCircle, ChevronRight } from 'lucide-react';

/**
 * Helper to slugify a heading title for anchor links
 */
export function slugifyHeading(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
}

/**
 * Extract H2 and H3 headings for Table of Contents
 */
export function extractHeadings(markdown) {
    if (!markdown) return [];
    const headings = [];
    const lines = markdown.split('\n');

    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('## ')) {
            const title = trimmed.replace(/^##\s+/, '').trim();
            headings.push({ id: slugifyHeading(title), title, level: 2 });
        } else if (trimmed.startsWith('### ')) {
            const title = trimmed.replace(/^###\s+/, '').trim();
            headings.push({ id: slugifyHeading(title), title, level: 3 });
        }
    }
    return headings;
}

/**
 * Helper to parse inline markdown (bold, italic, code, links)
 */
function parseInlineMarkdown(text) {
    if (!text) return '';

    // Replace bold **text**
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>');
    
    // Replace italic *text*
    formatted = formatted.replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, '<em class="italic text-gray-800">$1</em>');
    
    // Replace inline code `code`
    formatted = formatted.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded-md bg-gray-100 text-primary-700 font-mono text-xs font-semibold border border-gray-200/60">$1</code>');
    
    // Replace links [text](url)
    formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary-600 font-bold hover:text-primary-700 underline decoration-primary-300 hover:decoration-primary-600 transition-colors" target="_blank" rel="noopener noreferrer">$1</a>');

    return formatted;
}

/**
 * Main Markdown to JSX Content Renderer
 */
export default function BlogContentRenderer({ content }) {
    if (!content) return null;

    const lines = content.split('\n');
    const elements = [];
    let inTable = false;
    let tableRows = [];
    let inList = false;
    let listItems = [];
    let listType = 'ul'; // 'ul' or 'ol'
    let inCallout = false;
    let calloutType = 'note';
    let calloutLines = [];

    const flushTable = (key) => {
        if (!inTable || tableRows.length === 0) return null;
        inTable = false;
        const currentRows = [...tableRows];
        tableRows = [];

        // Check for header row and separator
        const headerRow = currentRows[0];
        const bodyRows = currentRows.slice(2); // row 1 is separator | :--- | :--- |

        return (
            <div key={`table-${key}`} className="my-8 overflow-x-auto rounded-2xl border border-gray-200/90 shadow-sm bg-white">
                <table className="w-full text-left text-sm border-collapse">
                    <thead className="bg-gray-50/90 border-b border-gray-200 text-xs font-bold text-gray-900 uppercase tracking-wider font-display">
                        <tr>
                            {headerRow.map((cell, cIdx) => (
                                <th key={cIdx} className="px-5 py-3.5" dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(cell) }} />
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                        {bodyRows.map((row, rIdx) => (
                            <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40 hover:bg-primary-50/20 transition-colors'}>
                                {row.map((cell, cIdx) => (
                                    <td key={cIdx} className="px-5 py-3.5 leading-relaxed" dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(cell) }} />
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const flushList = (key) => {
        if (!inList || listItems.length === 0) return null;
        inList = false;
        const currentItems = [...listItems];
        listItems = [];

        if (listType === 'ol') {
            return (
                <ol key={`ol-${key}`} className="my-6 space-y-3 pl-0 list-none">
                    {currentItems.map((item, iIdx) => (
                        <li key={iIdx} className="flex items-start gap-3.5 text-base text-gray-800 leading-relaxed">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 text-primary-700 font-bold text-xs flex items-center justify-center mt-0.5 shadow-sm font-mono">
                                {iIdx + 1}
                            </span>
                            <span className="flex-1" dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(item) }} />
                        </li>
                    ))}
                </ol>
            );
        }

        return (
            <ul key={`ul-${key}`} className="my-6 space-y-2.5 pl-0 list-none">
                {currentItems.map((item, iIdx) => (
                    <li key={iIdx} className="flex items-start gap-3 text-base text-gray-800 leading-relaxed">
                        <span className="w-2 h-2 rounded-full bg-primary-500 mt-2.5 shrink-0 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
                        <span className="flex-1" dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(item) }} />
                    </li>
                ))}
            </ul>
        );
    };

    const flushCallout = (key) => {
        if (!inCallout || calloutLines.length === 0) return null;
        inCallout = false;
        const text = calloutLines.join(' ');
        calloutLines = [];

        const calloutStyles = {
            note: {
                bg: 'bg-cyan-50/80 border-cyan-300 text-cyan-950',
                icon: <Info className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />,
                label: 'Field Advisory'
            },
            tip: {
                bg: 'bg-emerald-50/80 border-emerald-300 text-emerald-950',
                icon: <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />,
                label: 'Pro Trekker Tip'
            },
            warning: {
                bg: 'bg-amber-50/80 border-amber-300 text-amber-950',
                icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />,
                label: 'High-Altitude Safety Warning'
            }
        };

        const currentStyle = calloutStyles[calloutType] || calloutStyles.note;

        return (
            <div key={`callout-${key}`} className={`my-8 p-5 sm:p-6 rounded-2xl border-l-4 shadow-sm flex items-start gap-4 ${currentStyle.bg}`}>
                {currentStyle.icon}
                <div className="flex-1">
                    <span className="block text-[11px] font-black uppercase tracking-wider mb-1 font-display opacity-80">
                        {currentStyle.label}
                    </span>
                    <p className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(text) }} />
                </div>
            </div>
        );
    };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        // Check Table Row
        if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
            if (inList) elements.push(flushList(i));
            if (inCallout) elements.push(flushCallout(i));
            inTable = true;
            const cells = trimmed
                .slice(1, -1)
                .split('|')
                .map(c => c.trim());
            tableRows.push(cells);
            continue;
        } else if (inTable) {
            elements.push(flushTable(i));
        }

        // Check Callout Block (> [!NOTE], > [!TIP], > [!WARNING])
        if (trimmed.startsWith('> [!NOTE]')) {
            if (inList) elements.push(flushList(i));
            if (inTable) elements.push(flushTable(i));
            inCallout = true;
            calloutType = 'note';
            continue;
        } else if (trimmed.startsWith('> [!TIP]')) {
            if (inList) elements.push(flushList(i));
            if (inTable) elements.push(flushTable(i));
            inCallout = true;
            calloutType = 'tip';
            continue;
        } else if (trimmed.startsWith('> [!WARNING]')) {
            if (inList) elements.push(flushList(i));
            if (inTable) elements.push(flushTable(i));
            inCallout = true;
            calloutType = 'warning';
            continue;
        } else if (inCallout && trimmed.startsWith('>')) {
            calloutLines.push(trimmed.replace(/^>\s*/, ''));
            continue;
        } else if (inCallout) {
            elements.push(flushCallout(i));
        }

        // Standard Blockquote (> quote)
        if (trimmed.startsWith('>')) {
            if (inList) elements.push(flushList(i));
            if (inTable) elements.push(flushTable(i));
            const quoteText = trimmed.replace(/^>\s*/, '');
            elements.push(
                <blockquote key={`quote-${i}`} className="my-6 pl-5 py-2 border-l-4 border-primary-500 bg-gray-50/80 rounded-r-2xl italic text-gray-700 text-base leading-relaxed">
                    <p dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(quoteText) }} />
                </blockquote>
            );
            continue;
        }

        // Check Unordered List (- item or * item)
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            if (inTable) elements.push(flushTable(i));
            if (!inList || listType !== 'ul') {
                if (inList) elements.push(flushList(i));
                inList = true;
                listType = 'ul';
            }
            listItems.push(trimmed.slice(2));
            continue;
        }

        // Check Ordered List (1. item)
        if (/^\d+\.\s+/.test(trimmed)) {
            if (inTable) elements.push(flushTable(i));
            if (!inList || listType !== 'ol') {
                if (inList) elements.push(flushList(i));
                inList = true;
                listType = 'ol';
            }
            listItems.push(trimmed.replace(/^\d+\.\s+/, ''));
            continue;
        }

        if (inList) {
            elements.push(flushList(i));
        }

        // Horizontal Divider (---)
        if (trimmed === '---' || trimmed === '***') {
            elements.push(<hr key={`hr-${i}`} className="my-10 border-t border-gray-200/80" />);
            continue;
        }

        // Headings
        if (trimmed.startsWith('# ')) {
            const headingText = trimmed.replace(/^#\s+/, '').trim();
            // Skip H1 if it repeats the article title, or render as styled title
            elements.push(
                <h1 key={`h1-${i}`} className="text-3xl sm:text-4xl font-black text-gray-950 font-display tracking-tight mt-10 mb-6">
                    {headingText}
                </h1>
            );
            continue;
        }

        if (trimmed.startsWith('## ')) {
            const headingText = trimmed.replace(/^##\s+/, '').trim();
            const id = slugifyHeading(headingText);
            elements.push(
                <h2 
                    key={`h2-${i}`} 
                    id={id} 
                    className="text-2xl sm:text-3xl font-black text-gray-900 font-display tracking-tight mt-12 mb-5 pt-4 border-b border-gray-100 flex items-center justify-between group"
                >
                    <span className="flex items-center gap-3">
                        <span className="w-2.5 h-6 rounded-full bg-primary-600 shrink-0" />
                        <span>{headingText}</span>
                    </span>
                    <a href={`#${id}`} className="text-gray-300 hover:text-primary-600 text-sm opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                        #
                    </a>
                </h2>
            );
            continue;
        }

        if (trimmed.startsWith('### ')) {
            const headingText = trimmed.replace(/^###\s+/, '').trim();
            const id = slugifyHeading(headingText);
            elements.push(
                <h3 
                    key={`h3-${i}`} 
                    id={id} 
                    className="text-xl sm:text-2xl font-bold text-gray-900 font-display tracking-tight mt-8 mb-4 flex items-center gap-2"
                >
                    <ChevronRight className="w-5 h-5 text-primary-500" />
                    <span>{headingText}</span>
                </h3>
            );
            continue;
        }

        // Regular Paragraphs
        if (trimmed.length > 0) {
            elements.push(
                <p 
                    key={`p-${i}`} 
                    className="text-base sm:text-lg text-gray-700 leading-relaxed my-5 font-normal selection:bg-primary-100"
                    dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(trimmed) }} 
                />
            );
        }
    }

    // Flush any pending lists, tables, or callouts at EOF
    if (inList) elements.push(flushList('eof'));
    if (inTable) elements.push(flushTable('eof'));
    if (inCallout) elements.push(flushCallout('eof'));

    return <div className="space-y-1">{elements}</div>;
}
