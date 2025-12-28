import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { discountTiers, discountTerms, categories } from '../data/researchProtocols';

const Research: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/40 to-white flex flex-col">
      <Header
        cartItemsCount={0}
        onCartClick={() => navigate('/')}
        onMenuClick={() => navigate('/')}
      />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 md:py-16 space-y-12">
          <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-blue-700 font-semibold">
                Pulse Discount Policy
              </p>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">Benefits & Eligibility</h1>
              <p className="text-gray-600 mt-2 max-w-2xl">
                Dynamic discount ladder with shipping perks. All tiers are stack-aware and easy to update.
              </p>
            </div>
            <span className="h-10 inline-flex items-center px-4 rounded-full bg-white text-blue-700 text-sm font-semibold shadow-md border border-blue-100">
              Updated as policies change
            </span>
          </header>

          <section className="grid gap-6 md:grid-cols-2">
            <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Discount Tiers</h2>
              <div className="space-y-3">
                {discountTiers.map((tier) => (
                  <div
                    key={tier.threshold}
                    className="flex items-start gap-3 p-3 rounded-xl bg-blue-50/60 border border-blue-100"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white grid place-items-center font-bold shadow">
                      ₱
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-800">{tier.threshold}</p>
                      <p className="text-sm text-gray-700">{tier.offer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Terms & Conditions</h2>
              <ul className="space-y-2 list-disc list-inside text-sm text-gray-700">
                {discountTerms.map((term) => (
                  <li key={term}>{term}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-blue-700 font-semibold">Products</p>
                <h2 className="text-2xl font-bold text-gray-900">List of Categories</h2>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-100">
                Tap to explore in Protocols
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((cat) => (
                <div
                  key={cat}
                  className="p-4 rounded-xl border border-gray-100 bg-blue-50/40 text-gray-900 font-semibold shadow-sm hover:-translate-y-[2px] hover:shadow transition-all"
                >
                  {cat}
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Research;
