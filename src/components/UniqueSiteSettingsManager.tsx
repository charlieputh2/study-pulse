import React, { useState } from 'react';
import { Home, Layout, Palette, Globe, Zap, Shield, Sparkles, Save, RotateCcw, Eye, EyeOff, Upload, Settings, Monitor, Smartphone, Tablet } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { useImageUpload } from '../hooks/useImageUpload';

const UniqueSiteSettingsManager: React.FC = () => {
  const { siteSettings, loading, updateSiteSettings } = useSiteSettings();
  const { uploadImage, uploading } = useImageUpload();

  const [formData, setFormData] = useState({
    site_name: '',
    site_description: '',
    currency: '',
    currency_code: '',
    // Hero Fields
    hero_badge_text: '',
    hero_title_prefix: '',
    hero_title_highlight: '',
    hero_title_suffix: '',
    hero_subtext: '',
    hero_tagline: '',
    hero_description: '',
    hero_accent_color: 'blue-500',
    // New unique fields
    primary_color: '#3B82F6',
    secondary_color: '#8B5CF6',
    accent_color: '#06B6D4',
    theme_mode: 'modern',
    layout_style: 'centered',
    animation_speed: 'normal'
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'appearance' | 'content' | 'advanced'>('general');
  const [showPreview, setShowPreview] = useState(false);

  React.useEffect(() => {
    if (siteSettings) {
      setFormData({
        site_name: siteSettings.site_name,
        site_description: siteSettings.site_description,
        currency: siteSettings.currency,
        currency_code: siteSettings.currency_code,
        hero_badge_text: siteSettings.hero_badge_text || '',
        hero_title_prefix: siteSettings.hero_title_prefix || '',
        hero_title_highlight: siteSettings.hero_title_highlight || '',
        hero_title_suffix: siteSettings.hero_title_suffix || '',
        hero_subtext: siteSettings.hero_subtext || '',
        hero_tagline: siteSettings.hero_tagline || '',
        hero_description: siteSettings.hero_description || '',
        hero_accent_color: siteSettings.hero_accent_color || 'blue-500',
        primary_color: siteSettings.primary_color || '#3B82F6',
        secondary_color: siteSettings.secondary_color || '#8B5CF6',
        accent_color: siteSettings.accent_color || '#06B6D4',
        theme_mode: siteSettings.theme_mode || 'modern',
        layout_style: siteSettings.layout_style || 'centered',
        animation_speed: siteSettings.animation_speed || 'normal'
      });
      setLogoPreview(siteSettings.site_logo);
    }
  }, [siteSettings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      let logoUrl = logoPreview;

      if (logoFile) {
        const uploadedUrl = await uploadImage(logoFile);
        logoUrl = uploadedUrl;
      }

      await updateSiteSettings({
        ...formData,
        site_logo: logoUrl
      });

      setLogoFile(null);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving site settings:', error);
      alert('Failed to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefaults = () => {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
      setFormData(prev => ({
        ...prev,
        hero_badge_text: 'Premium Research Solutions',
        hero_title_prefix: 'Scientific',
        hero_title_highlight: 'Excellence',
        hero_title_suffix: 'Delivered',
        hero_subtext: 'Where precision meets innovation in research',
        hero_tagline: 'Quality-tested products. Reliable performance. Trusted by researchers worldwide.',
        hero_description: 'Study Pulse is your premier destination for cutting-edge research compounds, peptides, and scientific supplies.',
        primary_color: '#3B82F6',
        secondary_color: '#8B5CF6',
        accent_color: '#06B6D4'
      }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading settings...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'content', label: 'Content', icon: Home },
    { id: 'advanced', label: 'Advanced', icon: Zap }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Layout className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Site Settings</h1>
                <p className="text-sm text-gray-500">Customize your website appearance and content</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  showPreview 
                    ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {showPreview ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || uploading}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Navigation Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
              <div className="flex space-x-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              
              {/* General Tab */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">General Settings</h2>
                  
                  {/* Logo & Branding */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Globe className="w-5 h-5 text-blue-600" />
                      Brand Identity
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Site Logo</label>
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                            <img src={logoPreview || '/assets/logo.jpeg'} alt="Logo" className="w-full h-full object-cover" />
                          </div>
                          <label className="cursor-pointer bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                            <Upload className="w-4 h-4" />
                            Change Logo
                            <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                          </label>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
                          <input
                            type="text"
                            name="site_name"
                            value={formData.site_name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            placeholder="Study Pulse"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Site Description</label>
                          <textarea
                            name="site_description"
                            value={formData.site_description}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                            placeholder="Premium research solutions..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Currency Settings */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Currency Settings</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Currency Symbol</label>
                        <input 
                          type="text" 
                          name="currency" 
                          value={formData.currency} 
                          onChange={handleInputChange} 
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="$"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Currency Code</label>
                        <input 
                          type="text" 
                          name="currency_code" 
                          value={formData.currency_code} 
                          onChange={handleInputChange} 
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="USD"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance Tab */}
              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Appearance Settings</h2>
                  
                  {/* Color Scheme */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Palette className="w-5 h-5 text-purple-600" />
                      Color Scheme
                    </h3>
                    
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            name="primary_color"
                            value={formData.primary_color}
                            onChange={handleInputChange}
                            className="w-16 h-16 rounded-lg border-2 border-gray-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            name="primary_color"
                            value={formData.primary_color}
                            onChange={handleInputChange}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            name="secondary_color"
                            value={formData.secondary_color}
                            onChange={handleInputChange}
                            className="w-16 h-16 rounded-lg border-2 border-gray-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            name="secondary_color"
                            value={formData.secondary_color}
                            onChange={handleInputChange}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            name="accent_color"
                            value={formData.accent_color}
                            onChange={handleInputChange}
                            className="w-16 h-16 rounded-lg border-2 border-gray-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            name="accent_color"
                            value={formData.accent_color}
                            onChange={handleInputChange}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Theme Settings */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Theme Configuration</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Theme Mode</label>
                        <select
                          name="theme_mode"
                          value={formData.theme_mode}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="modern">Modern</option>
                          <option value="classic">Classic</option>
                          <option value="minimal">Minimal</option>
                          <option value="dark">Dark</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Layout Style</label>
                        <select
                          name="layout_style"
                          value={formData.layout_style}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="centered">Centered</option>
                          <option value="wide">Wide</option>
                          <option value="boxed">Boxed</option>
                          <option value="fluid">Fluid</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Animation Speed</label>
                        <select
                          name="animation_speed"
                          value={formData.animation_speed}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="slow">Slow</option>
                          <option value="normal">Normal</option>
                          <option value="fast">Fast</option>
                          <option value="instant">Instant</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Content Tab */}
              {activeTab === 'content' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Homepage Content</h2>
                  
                  {/* Hero Content */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Home className="w-5 h-5 text-green-600" />
                      Hero Section
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Badge Text</label>
                        <input
                          type="text"
                          name="hero_badge_text"
                          value={formData.hero_badge_text}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Premium Research Solutions"
                        />
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Title Prefix</label>
                          <input
                            type="text"
                            name="hero_title_prefix"
                            value={formData.hero_title_prefix}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Scientific"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Title Highlight</label>
                          <input
                            type="text"
                            name="hero_title_highlight"
                            value={formData.hero_title_highlight}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg font-medium focus:ring-2 focus:ring-blue-500"
                            placeholder="Excellence"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Title Suffix</label>
                          <input
                            type="text"
                            name="hero_title_suffix"
                            value={formData.hero_title_suffix}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Delivered"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subtext</label>
                        <input
                          type="text"
                          name="hero_subtext"
                          value={formData.hero_subtext}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Where precision meets innovation in research"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
                        <textarea
                          name="hero_tagline"
                          value={formData.hero_tagline}
                          onChange={handleInputChange}
                          rows={2}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                          placeholder="Quality-tested products. Reliable performance..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Main Description</label>
                        <textarea
                          name="hero_description"
                          value={formData.hero_description}
                          onChange={handleInputChange}
                          rows={4}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                          placeholder="Study Pulse is your premier destination for..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Advanced Tab */}
              {activeTab === 'advanced' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Advanced Settings</h2>
                  
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-orange-600" />
                      Advanced Options
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-gray-900">Backup & Reset</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              Reset all settings to default values. This action cannot be undone.
                            </p>
                            <button
                              onClick={handleResetDefaults}
                              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
                            >
                              <RotateCcw className="w-4 h-4" />
                              Reset to Defaults
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Preview Panel */}
          {showPreview && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-gray-500" />
                  Live Preview
                </h3>
                
                <div className="space-y-4">
                  {/* Mobile Preview */}
                  <div className="bg-gray-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Smartphone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Mobile</span>
                    </div>
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <div className="w-full h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded mb-2"></div>
                      <div className="space-y-1">
                        <div className="h-2 bg-gray-200 rounded"></div>
                        <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Preview */}
                  <div className="bg-gray-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Monitor className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Desktop</span>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="w-full h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded mb-3"></div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="h-16 bg-gray-100 rounded"></div>
                        <div className="h-16 bg-gray-100 rounded"></div>
                      </div>
                    </div>
                  </div>

                  {/* Color Palette */}
                  <div className="bg-gray-100 rounded-xl p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Color Palette</h4>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <div 
                          className="w-full h-12 rounded-lg border border-gray-300 mb-1"
                          style={{ backgroundColor: formData.primary_color }}
                        ></div>
                        <p className="text-xs text-gray-600 text-center">Primary</p>
                      </div>
                      <div className="flex-1">
                        <div 
                          className="w-full h-12 rounded-lg border border-gray-300 mb-1"
                          style={{ backgroundColor: formData.secondary_color }}
                        ></div>
                        <p className="text-xs text-gray-600 text-center">Secondary</p>
                      </div>
                      <div className="flex-1">
                        <div 
                          className="w-full h-12 rounded-lg border border-gray-300 mb-1"
                          style={{ backgroundColor: formData.accent_color }}
                        ></div>
                        <p className="text-xs text-gray-600 text-center">Accent</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UniqueSiteSettingsManager;
