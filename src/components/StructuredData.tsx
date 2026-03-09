

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

interface SoftwareApplicationSchema {
  type: 'SoftwareApplication';
  name: string;
  description: string;
  applicationCategory: string;
  operatingSystem: string;
  url: string;
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
    bestRating?: number;
  };
}

interface HowToSchema {
  type: 'HowTo';
  name: string;
  description: string;
  steps: Array<{ name: string; text: string }>;
}

type SchemaType =
  | OrganizationSchema
  | ProductSchema
  | ArticleSchema
  | FAQSchema
  | BreadcrumbSchema
  | LocalBusinessSchema
  | SoftwareApplicationSchema
  | HowToSchema;

interface StructuredDataProps {
  data: SchemaType | SchemaType[];
}

const StructuredData = ({ data }: StructuredDataProps) => {
  const generateSchema = (schemaData: SchemaType) => {
    const baseUrl = 'https://www.toptabletennispaddle.com';

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

      case 'SoftwareApplication':
        return {
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: schemaData.name,
          description: schemaData.description,
          applicationCategory: schemaData.applicationCategory,
          operatingSystem: schemaData.operatingSystem,
          url: schemaData.url,
          ...(schemaData.aggregateRating && {
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: schemaData.aggregateRating.ratingValue,
              reviewCount: schemaData.aggregateRating.reviewCount,
              bestRating: schemaData.aggregateRating.bestRating ?? 5,
            },
          }),
        };

      case 'HowTo':
        return {
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          name: schemaData.name,
          description: schemaData.description,
          step: schemaData.steps.map((s, i) => ({
            '@type': 'HowToStep',
            position: i + 1,
            name: s.name,
            text: s.text,
          })),
        };

      default:
        return null;
    }
  };

  const schemas = Array.isArray(data) ? data : [data];
  const jsonLd = schemas.map(generateSchema).filter(Boolean);

  return (
    <>
      {jsonLd.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
};

export default StructuredData;
