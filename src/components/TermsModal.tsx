import React from 'react';
import { X, AlertCircle, Shield, Users, Package } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onAccept, onDecline }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={onDecline}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8" />
                <h2 className="text-2xl font-bold">Terms and Conditions</h2>
              </div>
              <button
                onClick={onDecline}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            <div className="space-y-6 text-gray-700">
              {/* Important Notice */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-yellow-800 mb-1">Important Notice</h3>
                    <p className="text-sm text-yellow-700">
                      This is a research peptide intended for scientific and laboratory research purposes only. 
                      Not for human consumption.
                    </p>
                  </div>
                </div>
              </div>

              {/* Terms Sections */}
              <section>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Eligibility and Use
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>I am at least 18 years of age or older</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>I am a qualified researcher or laboratory professional</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>This product will be used solely for legitimate research purposes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>I understand this is not intended for human consumption or therapeutic use</span>
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Package className="w-5 h-5 text-purple-600" />
                  Product Handling and Safety
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">•</span>
                    <span>I will follow proper safety protocols and handling procedures</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">•</span>
                    <span>I will store the product according to recommended guidelines</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">•</span>
                    <span>I assume full responsibility for safe handling and use</span>
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">Legal Disclaimer</h3>
                <div className="bg-gray-50 rounded-lg p-4 text-sm">
                  <p className="mb-2">
                    The information provided on this website is for educational and research purposes only. 
                    Tirzepatide and other research peptides are experimental compounds that have not been 
                    approved by regulatory bodies for human use.
                  </p>
                  <p className="mb-2">
                    By proceeding, you acknowledge that:
                  </p>
                  <ul className="space-y-1 ml-4">
                    <li>• You are using this product at your own risk</li>
                    <li>• We are not liable for any misuse or adverse effects</li>
                    <li>• You comply with all applicable laws and regulations</li>
                    <li>• This product is sold as a research chemical only</li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">Privacy Policy</h3>
                <p className="text-sm">
                  We respect your privacy and are committed to protecting your personal information. 
                  All data is handled in accordance with applicable privacy laws and regulations.
                </p>
              </section>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onDecline}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
              >
                Decline
              </button>
              <button
                onClick={onAccept}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                I Agree and Accept Terms
              </button>
            </div>
            <p className="text-xs text-gray-500 text-center mt-4">
              You must accept these terms to proceed. By accepting, you confirm that you have read, 
              understood, and agree to be bound by these terms and conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
