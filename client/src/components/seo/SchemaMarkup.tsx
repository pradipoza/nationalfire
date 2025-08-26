import React from 'react';

interface SchemaMarkupProps {
  schema: any;
}

const SchemaMarkup: React.FC<SchemaMarkupProps> = ({ schema }) => {
  React.useEffect(() => {
    if (schema) {
      // Remove existing schema
      const existingSchema = document.querySelector('script[type="application/ld+json"][data-component="schema-markup"]');
      if (existingSchema) {
        existingSchema.remove();
      }

      // Add new schema
      const script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.setAttribute('data-component', 'schema-markup');
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);

      return () => {
        const schemaScript = document.querySelector('script[type="application/ld+json"][data-component="schema-markup"]');
        if (schemaScript) {
          schemaScript.remove();
        }
      };
    }
  }, [schema]);

  return null;
};

export default SchemaMarkup;