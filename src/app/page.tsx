import Link from 'next/link';

// Sample data - will be replaced with database calls
const featuredArticle = {
  slug: 'base-blockchain',
  title: 'Base (blockchain)',
  excerpt:
    'Base is an Ethereum Layer 2 network developed by Coinbase, launched in August 2023. Built on the OP Stack, it provides a secure, low-cost, and developer-friendly environment for building decentralized applications.',
};

const activeArticles = [
  { slug: 'erc-8004', title: 'ERC-8004' },
  { slug: 'xmtp', title: 'XMTP' },
  { slug: 'farcaster', title: 'Farcaster' },
  { slug: 'model-context-protocol', title: 'Model Context Protocol' },
  { slug: 'x402', title: 'x402' },
];

const categories = [
  { slug: 'protocols', name: 'Protocols' },
  { slug: 'infrastructure', name: 'Infrastructure' },
  { slug: 'agents', name: 'Agents' },
  { slug: 'standards', name: 'Standards' },
];

export default function HomePage() {
  return (
    <>
      <section className="featured-article">
        <div className="featured-label">From today&apos;s featured article</div>
        <h2 className="featured-title">
          <Link href={`/wiki/${featuredArticle.slug}`}>{featuredArticle.title}</Link>
        </h2>
        <p className="featured-excerpt">{featuredArticle.excerpt}</p>
        <Link href={`/wiki/${featuredArticle.slug}`} className="read-more">
          Read more →
        </Link>
      </section>

      <div className="two-columns">
        <section>
          <h3 className="section-title">Active articles</h3>
          <ul className="article-list">
            {activeArticles.map((article) => (
              <li key={article.slug}>
                <Link href={`/wiki/${article.slug}`}>{article.title}</Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="section-title">Browse by topic</h3>
          <ul className="category-list">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link href={`/category/${category.slug}`}>{category.name}</Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
