import React from 'react';
import { Link } from 'wouter';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  if (items.length <= 1) return null;

  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-gray-400 mr-2" aria-hidden="true" />
            )}
            {index === items.length - 1 ? (
              <span 
                className="text-gray-600 font-medium" 
                aria-current="page"
                itemProp="name"
              >
                {item.name}
              </span>
            ) : (
              <Link href={item.href}>
                <a 
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                  itemProp="item"
                >
                  <span itemProp="name">{item.name}</span>
                </a>
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;