import { useQuery } from '@tanstack/react-query';
import type { Customer } from '@shared/schema';

interface CustomerSectionProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function CustomerSection({ 
  title = "Our Trusted Customers", 
  subtitle = "Serving emergency services and government agencies nationwide",
  className = ""
}: CustomerSectionProps) {
  const { data: customerData, isLoading } = useQuery<{ customers: Customer[] }>({
    queryKey: ['/api/customers/active'],
  });

  const customers = customerData?.customers || [];

  if (isLoading) {
    return (
      <div className={`py-16 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-20 w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (customers.length === 0) {
    return null;
  }

  return (
    <div className={`py-16 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {customers.map((customer) => (
            <a
              key={customer.id}
              href={customer.website}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:scale-105 transition-all duration-300"
              title={`Visit ${customer.name}`}
            >
              <img
                src={customer.logo}
                alt={customer.name}
                className="max-w-full max-h-16 object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}