import React, { useState } from 'react';
import { Star, Quote, User, ThumbsUp, MessageSquare, Send } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  helpful: number;
  avatar?: string;
}

const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    {
      id: '1',
      name: 'Maria Santos',
      rating: 5,
      comment: 'Excellent quality peptides! Fast shipping and great customer service. Will definitely order again.',
      date: '2024-12-15',
      verified: true,
      helpful: 24,
      avatar: 'MS'
    },
    {
      id: '2',
      name: 'John Chen',
      rating: 4,
      comment: 'Good product quality and competitive prices. Packaging was secure and arrived in perfect condition.',
      date: '2024-12-10',
      verified: true,
      helpful: 18,
      avatar: 'JC'
    },
    {
      id: '3',
      name: 'Dr. Sarah Williams',
      rating: 5,
      comment: 'As a researcher, I appreciate the purity and consistency of these peptides. The COA documentation is comprehensive.',
      date: '2024-12-08',
      verified: true,
      helpful: 32,
      avatar: 'SW'
    },
    {
      id: '4',
      name: 'Roberto Garcia',
      rating: 5,
      comment: 'Outstanding service! The team is very knowledgeable and helped me choose the right products for my research.',
      date: '2024-12-05',
      verified: true,
      helpful: 15,
      avatar: 'RG'
    }
  ]);

  const [newTestimonial, setNewTestimonial] = useState({
    name: '',
    rating: 5,
    comment: ''
  });

  const [showForm, setShowForm] = useState(false);
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, number>>({});

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
            onClick={() => interactive && onRate && onRate(star)}
          />
        ))}
      </div>
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTestimonial.name && newTestimonial.comment) {
      const testimonial: Testimonial = {
        id: Date.now().toString(),
        name: newTestimonial.name,
        rating: newTestimonial.rating,
        comment: newTestimonial.comment,
        date: new Date().toISOString().split('T')[0],
        verified: false,
        helpful: 0,
        avatar: newTestimonial.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
      };
      setTestimonials([testimonial, ...testimonials]);
      setNewTestimonial({ name: '', rating: 5, comment: '' });
      setShowForm(false);
    }
  };

  const handleHelpful = (testimonialId: string) => {
    if (!helpfulVotes[testimonialId]) {
      setHelpfulVotes({ ...helpfulVotes, [testimonialId]: 1 });
      setTestimonials(testimonials.map(t => 
        t.id === testimonialId 
          ? { ...t, helpful: t.helpful + 1 }
          : t
      ));
    }
  };

  const averageRating = testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length;

  return (
    <div className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Customer Reviews</h2>
          <p className="text-lg text-gray-600 mb-6">See what our customers are saying about our products</p>
          
          {/* Rating Summary */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-600 mb-2">{averageRating.toFixed(1)}</div>
              {renderStars(Math.round(averageRating))}
              <div className="text-sm text-gray-500 mt-1">{testimonials.length} reviews</div>
            </div>
            
            <div className="flex flex-col gap-2 w-full max-w-xs">
              {[5, 4, 3, 2, 1].map(rating => {
                const count = testimonials.filter(t => t.rating === rating).length;
                const percentage = (count / testimonials.length) * 100;
                return (
                  <div key={rating} className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 w-8">{rating}★</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-yellow-400 h-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500 w-8">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Add Testimonial Button */}
        <div className="text-center mb-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <MessageSquare className="w-5 h-5" />
            Write a Review
          </button>
        </div>

        {/* Testimonial Form */}
        {showForm && (
          <div className="max-w-2xl mx-auto mb-12 bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Share Your Experience</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                <input
                  type="text"
                  value={newTestimonial.name}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                {renderStars(newTestimonial.rating, true, (rating) => 
                  setNewTestimonial({ ...newTestimonial, rating })
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                <textarea
                  value={newTestimonial.comment}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, comment: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                  placeholder="Share your experience with our products..."
                  required
                />
              </div>
              
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Submit Review
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Testimonials Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.date}</div>
                  </div>
                </div>
                {testimonial.verified && (
                  <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                    Verified
                  </div>
                )}
              </div>

              {/* Rating */}
              <div className="mb-3">
                {renderStars(testimonial.rating)}
              </div>

              {/* Comment */}
              <div className="relative mb-4">
                <Quote className="absolute -top-2 -left-2 w-8 h-8 text-blue-100" />
                <p className="text-gray-700 leading-relaxed pl-6">
                  {testimonial.comment}
                </p>
              </div>

              {/* Helpful */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleHelpful(testimonial.id)}
                  className={`flex items-center gap-2 text-sm ${
                    helpfulVotes[testimonial.id]
                      ? 'text-blue-600'
                      : 'text-gray-500 hover:text-blue-600'
                  } transition-colors`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  Helpful ({testimonial.helpful + (helpfulVotes[testimonial.id] || 0)})
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
