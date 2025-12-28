import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { SiteSettings } from '../types';

export const useSiteSettings = () => {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSiteSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('id');

      if (error) throw error;

      const settingsData = data || [];

      // Transform the data into a more usable format
      const settings: SiteSettings = {
        site_name: settingsData.find(s => s.id === 'site_name')?.value || 'Study Pulse',
        site_logo: settingsData.find(s => s.id === 'site_logo')?.value || '/assets/logo.jpeg',
        site_description: settingsData.find(s => s.id === 'site_description')?.value || '',
        currency: settingsData.find(s => s.id === 'currency')?.value || 'PHP',
        currency_code: settingsData.find(s => s.id === 'currency_code')?.value || 'PHP',
        hero_badge_text: settingsData.find(s => s.id === 'hero_badge_text')?.value || 'Premium Health & Wellness Store',
        hero_title_prefix: settingsData.find(s => s.id === 'hero_title_prefix')?.value || 'Study',
        hero_title_highlight: settingsData.find(s => s.id === 'hero_title_highlight')?.value || 'Pulse',
        hero_title_suffix: settingsData.find(s => s.id === 'hero_title_suffix')?.value || 'Premium E-Commerce',
        hero_subtext: settingsData.find(s => s.id === 'hero_subtext')?.value || 'Trusted quality for modern health solutions.',
        hero_tagline: settingsData.find(s => s.id === 'hero_tagline')?.value || 'Premium products. Secure payments. Seamless experience.',
        hero_description: settingsData.find(s => s.id === 'hero_description')?.value || 'Study Pulse is a premium e-commerce platform offering carefully selected health, wellness, cosmetic, and medical-related products. Designed for convenience and reliability, our system provides fast ordering, secure payment processing, real-time order tracking, doctor appointment availability viewing, and accurate inventory management to ensure a smooth and professional shopping experience.',
        hero_accent_color: settingsData.find(s => s.id === 'hero_accent_color')?.value || 'gold-500'
      };

      setSiteSettings(settings);
    } catch (err) {
      console.error('Error fetching site settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch site settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSiteSetting = async (id: string, value: string) => {
    try {
      setError(null);

      const { error } = await supabase
        .from('site_settings')
        .update({ value })
        .eq('id', id);

      if (error) throw error;

      // Refresh the settings
      await fetchSiteSettings();
    } catch (err) {
      console.error('Error updating site setting:', err);
      setError(err instanceof Error ? err.message : 'Failed to update site setting');
      throw err;
    }
  };

  const updateSiteSettings = async (updates: Partial<SiteSettings>) => {
    try {
      setError(null);

      const upsertData = Object.entries(updates).map(([key, value]) => ({
        id: key,
        value: String(value),
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('site_settings')
        .upsert(upsertData);

      if (error) throw error;

      // Refresh the settings
      await fetchSiteSettings();
    } catch (err) {
      console.error('Error updating site settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to update site settings');
      throw err;
    }
  };

  useEffect(() => {
    fetchSiteSettings();
  }, []);

  return {
    siteSettings,
    loading,
    error,
    updateSiteSetting,
    updateSiteSettings,
    refetch: fetchSiteSettings
  };
};
