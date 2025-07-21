import { cn } from '@/lib/utils';

interface RichTextDisplayProps {
  content: string;
  className?: string;
}

export function RichTextDisplay({ content, className }: RichTextDisplayProps) {
  return (
    <div 
      className={cn(
        "prose prose-gray max-w-none",
        "prose-headings:text-gray-900",
        "prose-p:text-gray-700 prose-p:leading-relaxed",
        "prose-strong:text-gray-900",
        "prose-blockquote:border-l-fire-red prose-blockquote:bg-gray-50 prose-blockquote:not-italic",
        "prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded",
        "prose-pre:bg-gray-900 prose-pre:text-gray-100",
        "prose-ul:list-disc prose-ol:list-decimal",
        "prose-li:text-gray-700",
        "prose-table:border-collapse prose-table:border prose-table:border-gray-300",
        "prose-thead:bg-gray-50",
        "prose-th:border prose-th:border-gray-300 prose-th:p-2 prose-th:font-semibold",
        "prose-td:border prose-td:border-gray-300 prose-td:p-2",
        "prose-img:rounded-lg prose-img:shadow-md prose-img:my-6",
        "prose-a:text-fire-red prose-a:no-underline hover:prose-a:underline",
        className
      )}
      dangerouslySetInnerHTML={{ __html: content || '<p class="text-gray-500 italic">No content available.</p>' }}
    />
  );
}