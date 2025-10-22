import { Helmet } from 'react-helmet-async';

interface OrganizationSchema {
  type: 'Organization';
  name: string;
  url: string;
  logo?: string;
}

interface ProductSchema {
  type: 'Product';
  name: string;
  description: string;
  image?: string;
  brand?: string;
  offers?: {
    price: number;
    priceCurrency: string;
    availability: string;
  };
}

interface ArticleSchema {
  type: 'Article';
  headline: string;
  description: string;
  image?: string;
  author: string;
  datePublished: string;
  dateModified?: string;
}

interface FAQSchema {
  type: 'FAQPage';
  questions: Array<{
    question: string;
    answer: string;
  }>;
}

interface BreadcrumbSchema {
  type: 'BreadcrumbList';
  items: Array<{
    name: string;
    url: string;
  }>;
}

interface LocalBusinessSchema {
  type: 'LocalBusiness';
  name: string;
  description: string;
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo?: {
    latitude: number;
    longitude: number;
  };
}

type SchemaType = 
  | OrganizationSchema 
  | ProductSchema 
  | ArticleSchema 
  | FAQSchema 
  | BreadcrumbSchema
  | LocalBusinessSchema;

interface StructuredDataProps {
  data: SchemaType | SchemaType[];
}

const StructuredData = ({ data }: StructuredDataProps) => {
  const generateSchema = (schemaData: SchemaType) => {
    const baseUrl = 'https://dcabed67-45bf-49e1-a6f1-a63e629bf863.lovableproject.com';
    
    switch (schemaData.type) {
      case 'Organization':
        return {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: schemaData.name,
          url: schemaData.url,
          logo: schemaData.logo,
        };
      
      case 'Product':
        return {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: schemaData.name,
          description: schemaData.description,
          image: schemaData.image,
          brand: schemaData.brand ? {
            '@type': 'Brand',
            name: schemaData.brand,
          } : undefined,
          offers: schemaData.offers ? {
            '@type': 'Offer',
            price: schemaData.offers.price,
            priceCurrency: schemaData.offers.priceCurrency,
            availability: schemaData.offers.availability,
          } : undefined,
        };
      
      case 'Article':
        return {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: schemaData.headline,
          description: schemaData.description,
          image: schemaData.image,
          author: {
            '@type': 'Person',
            name: schemaData.author,
          },
          publisher: {
            '@type': 'Organization',
            name: 'TopPaddle',
            logo: {
              '@type': 'ImageObject',
              url: `${baseUrl}/logo.png`,
            },
          },
          datePublished: schemaData.datePublished,
          dateModified: schemaData.dateModified || schemaData.datePublished,
        };
      
      case 'FAQPage':
        return {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: schemaData.questions.map(q => ({
            '@type': 'Question',
            name: q.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: q.answer,
            },
          })),
        };
      
      case 'BreadcrumbList':
        return {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: schemaData.items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
          })),
        };
      
      case 'LocalBusiness':
        return {
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: schemaData.name,
          description: schemaData.description,
          address: schemaData.address ? {
            '@type': 'PostalAddress',
            streetAddress: schemaData.address.streetAddress,
            addressLocality: schemaData.address.addressLocality,
            addressRegion: schemaData.address.addressRegion,
            postalCode: schemaData.address.postalCode,
            addressCountry: schemaData.address.addressCountry,
          } : undefined,
          geo: schemaData.geo ? {
            '@type': 'GeoCoordinates',
            latitude: schemaData.geo.latitude,
            longitude: schemaData.geo.longitude,
          } : undefined,
        };
      
      default:
        return null;
    }
  };

  const schemas = Array.isArray(data) ? data : [data];
  const jsonLd = schemas.map(generateSchema).filter(Boolean);

  return (
    <Helmet>
      {jsonLd.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default StructuredData;
