import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { categories, products, discountTiers } from '../data/researchProtocols';

const Protocols: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const navigate = useNavigate();

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'All') return products;
    return products.filter((p) => p.category.toUpperCase().includes(activeCategory[0]));
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white flex flex-col">
      <Header
        cartItemsCount={0}
        onCartClick={() => navigate('/')}
        onMenuClick={() => navigate('/')}
      />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 md:py-16 space-y-12">
          <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-blue-700 font-semibold">Protocols</p>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">Research & Protocol Library</h1>
              <p className="text-gray-600 mt-2 max-w-3xl">
                Fully-loaded, mobile-friendly reference for dosing, recon, stacking, and precautions. Filter by
                category and drill into product-specific protocols.
              </p>
            </div>
            <div className="flex flex-col md:items-end gap-2">
              <span className="h-10 inline-flex items-center px-4 rounded-full bg-white text-blue-700 text-sm font-semibold shadow-md border border-blue-100">
                Discount ladder ready
              </span>
              <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                {discountTiers.map((t) => (
                  <span key={t.threshold} className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                    {t.threshold}: {t.offer}
                  </span>
                ))}
              </div>
            </div>
          </header>

          <section className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-sm">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <button
                onClick={() => setActiveCategory('All')}
                className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                  activeCategory === 'All'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-blue-50 text-blue-700 border-blue-100 hover:-translate-y-[1px]'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                    activeCategory === cat
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-blue-50 text-blue-700 border-blue-100 hover:-translate-y-[1px]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <article
                  key={product.id}
                  className="group rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md hover:-translate-y-[2px] transition-all duration-200 p-5 flex flex-col"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold text-blue-600 uppercase tracking-[0.15em]">
                        Category {product.category}
                      </p>
                      <h2 className="text-xl font-bold text-gray-900 leading-snug">{product.name}</h2>
                      <p className="text-sm text-gray-700 mt-1">{product.description}</p>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                      Protocol
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    {product.variations?.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Variations</p>
                        <ul className="space-y-1.5">
                          {product.variations.map((v) => (
                            <li key={v.label} className="text-sm text-gray-800 flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-blue-500" />
                              <span className="font-semibold">{v.label}</span>
                              <span className="text-gray-600">— {v.price}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {product.protocol && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Protocol / Reconstitution</p>
                        <p className="text-sm text-gray-800 leading-relaxed">{product.protocol}</p>
                      </div>
                    )}

                    {product.dosing && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Dosing</p>
                        <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                          {product.dosing.map((d) => (
                            <li key={d}>{d}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {product.howItWorks && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">How it works</p>
                        <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                          {product.howItWorks.map((d) => (
                            <li key={d}>{d}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {product.sideEffects && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Possible side effects</p>
                        <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                          {product.sideEffects.map((d) => (
                            <li key={d}>{d}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {product.contraindications && product.contraindications.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Who should not use</p>
                        <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                          {product.contraindications.map((d) => (
                            <li key={d}>{d}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {product.stacking && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Stacking suggestions</p>
                        <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                          {product.stacking.map((d) => (
                            <li key={d}>{d}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Protocols;
