'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/presentation/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/presentation/components/layouts/Navbar';
import { Footer } from '@/presentation/components/layouts/Footer';

interface ContactInfo {
  prefix: string;
  firstName: string;
  lastName: string;
  suffix: string;
  homePhone: string;
  cellPhone: string;
  jobTitle: string;
  company: string;
  website: string;
  blog: string;
}

interface Address {
  address1: string;
  address2: string;
  city: string;
  country: string;
  state: string;
  zip: string;
}

const COUNTRIES = [
  { value: '', label: 'Select a Country' },
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'AU', label: 'Australia' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'ES', label: 'Spain' },
  { value: 'IT', label: 'Italy' },
  { value: 'NL', label: 'Netherlands' },
  { value: 'BE', label: 'Belgium' },
  { value: 'CH', label: 'Switzerland' },
  { value: 'AT', label: 'Austria' },
  { value: 'SE', label: 'Sweden' },
  { value: 'NO', label: 'Norway' },
  { value: 'DK', label: 'Denmark' },
  { value: 'FI', label: 'Finland' },
  { value: 'IE', label: 'Ireland' },
  { value: 'PT', label: 'Portugal' },
  { value: 'PL', label: 'Poland' },
  { value: 'CZ', label: 'Czechia' },
  { value: 'JP', label: 'Japan' },
  { value: 'CN', label: 'China' },
  { value: 'IN', label: 'India' },
  { value: 'BR', label: 'Brazil' },
  { value: 'MX', label: 'Mexico' },
  { value: 'AR', label: 'Argentina' },
  { value: 'ZA', label: 'South Africa' },
  { value: 'AE', label: 'United Arab Emirates' },
  { value: 'SG', label: 'Singapore' },
  { value: 'HK', label: 'Hong Kong' },
  { value: 'KR', label: 'Korea, Republic of' },
  { value: 'NZ', label: 'New Zealand' },
];

const US_STATES = [
  { value: '', label: 'Select a State' },
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
];

const PREFIXES = [
  { value: '', label: '--' },
  { value: 'Mr.', label: 'Mr.' },
  { value: 'Mrs.', label: 'Mrs.' },
  { value: 'Ms.', label: 'Ms.' },
  { value: 'Miss', label: 'Miss' },
  { value: 'Mx.', label: 'Mx.' },
  { value: 'Dr.', label: 'Dr.' },
  { value: 'Prof.', label: 'Prof.' },
  { value: 'Rev.', label: 'Rev.' },
];

export default function AccountSettingsPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('account');

  // Form state
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    prefix: '',
    firstName: '',
    lastName: '',
    suffix: '',
    homePhone: '',
    cellPhone: '',
    jobTitle: '',
    company: '',
    website: '',
    blog: '',
  });

  const [homeAddress, setHomeAddress] = useState<Address>({
    address1: '',
    address2: '',
    city: '',
    country: 'US',
    state: '',
    zip: '',
  });

  const [billingAddress, setBillingAddress] = useState<Address>({
    address1: '',
    address2: '',
    city: '',
    country: 'US',
    state: '',
    zip: '',
  });

  const [shippingAddress, setShippingAddress] = useState<Address>({
    address1: '',
    address2: '',
    city: '',
    country: 'US',
    state: '',
    zip: '',
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (!isAuthenticated) {
        router.push('/login');
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  const handleSave = async () => {
    setIsSaving(true);
    // TODO: Implement API call to save settings
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    alert('Settings saved successfully!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600">Loading settings...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) return null;

  // Calculate account age
  const accountSince = 'Feb 9, 2026'; // Would come from user data

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Account Settings
            </h1>
            <p className="text-sm text-gray-500 mt-2 md:mt-0">
              Eventra account since {accountSince}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <aside className="lg:w-64 flex-shrink-0">
              <nav className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="font-semibold text-gray-900">Contact Info</h2>
                </div>
                <ul className="divide-y divide-gray-100">
                  <li>
                    <button
                      onClick={() => setActiveSection('account')}
                      className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                        activeSection === 'account'
                          ? 'bg-orange-50 text-orange-600 border-l-4 border-orange-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Account
                    </button>
                  </li>
                  <li>
                    <Link
                      href="/account/password"
                      className="w-full text-left px-4 py-3 flex items-center gap-3 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Password
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/account/cards"
                      className="w-full text-left px-4 py-3 flex items-center gap-3 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      Credit/Debit Cards
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/account/email-preferences"
                      className="w-full text-left px-4 py-3 flex items-center gap-3 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Email Preferences
                    </Link>
                  </li>
                </ul>
              </nav>

              {/* Back to Profile Link */}
              <Link
                href="/profile"
                className="mt-4 flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Profile
              </Link>
            </aside>

            {/* Main Form */}
            <div className="flex-1">
              <div className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8">
                {/* Account Information Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Account Information</h2>
                  <p className="text-sm text-gray-500 hidden md:block">
                    Eventra account since {accountSince}
                  </p>
                </div>
                <hr className="mb-6" />

                {/* Profile Photo Section */}
                <section className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Photo</h3>
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl font-bold text-white">
                        {contactInfo.firstName.charAt(0)}{contactInfo.lastName.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors cursor-pointer">
                        <svg className="w-10 h-10 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm font-medium text-gray-700">ADD A PROFILE IMAGE</p>
                        <p className="text-xs text-gray-500 mt-1">Drag and drop or choose a file to upload</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Contact Information */}
                <section className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Prefix */}
                    <div>
                      <label htmlFor="prefix" className="block text-sm font-medium text-gray-700 mb-1">
                        Prefix
                      </label>
                      <select
                        id="prefix"
                        value={contactInfo.prefix}
                        onChange={(e) => setContactInfo({ ...contactInfo, prefix: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      >
                        {PREFIXES.map((p) => (
                          <option key={p.value} value={p.value}>{p.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {/* First Name */}
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        value={contactInfo.firstName}
                        onChange={(e) => setContactInfo({ ...contactInfo, firstName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>

                    {/* Last Name */}
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        value={contactInfo.lastName}
                        onChange={(e) => setContactInfo({ ...contactInfo, lastName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    {/* Suffix */}
                    <div>
                      <label htmlFor="suffix" className="block text-sm font-medium text-gray-700 mb-1">
                        Suffix
                      </label>
                      <input
                        type="text"
                        id="suffix"
                        value={contactInfo.suffix}
                        onChange={(e) => setContactInfo({ ...contactInfo, suffix: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {/* Home Phone */}
                    <div>
                      <label htmlFor="homePhone" className="block text-sm font-medium text-gray-700 mb-1">
                        Home Phone
                      </label>
                      <input
                        type="tel"
                        id="homePhone"
                        value={contactInfo.homePhone}
                        onChange={(e) => setContactInfo({ ...contactInfo, homePhone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>

                    {/* Cell Phone */}
                    <div>
                      <label htmlFor="cellPhone" className="block text-sm font-medium text-gray-700 mb-1">
                        Cell Phone
                      </label>
                      <input
                        type="tel"
                        id="cellPhone"
                        value={contactInfo.cellPhone}
                        onChange={(e) => setContactInfo({ ...contactInfo, cellPhone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {/* Job Title */}
                    <div>
                      <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
                        Job Title
                      </label>
                      <input
                        type="text"
                        id="jobTitle"
                        value={contactInfo.jobTitle}
                        onChange={(e) => setContactInfo({ ...contactInfo, jobTitle: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>

                    {/* Company */}
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                        Company / Organization
                      </label>
                      <input
                        type="text"
                        id="company"
                        value={contactInfo.company}
                        onChange={(e) => setContactInfo({ ...contactInfo, company: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {/* Website */}
                    <div>
                      <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                        Website
                      </label>
                      <input
                        type="url"
                        id="website"
                        value={contactInfo.website}
                        onChange={(e) => setContactInfo({ ...contactInfo, website: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="https://"
                      />
                    </div>

                    {/* Blog */}
                    <div>
                      <label htmlFor="blog" className="block text-sm font-medium text-gray-700 mb-1">
                        Blog
                      </label>
                      <input
                        type="url"
                        id="blog"
                        value={contactInfo.blog}
                        onChange={(e) => setContactInfo({ ...contactInfo, blog: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="https://"
                      />
                    </div>
                  </div>
                </section>

                {/* Home Address */}
                <AddressSection
                  title="Home Address"
                  address={homeAddress}
                  setAddress={setHomeAddress}
                  idPrefix="home"
                />

                {/* Billing Address */}
                <AddressSection
                  title="Billing Address"
                  address={billingAddress}
                  setAddress={setBillingAddress}
                  idPrefix="billing"
                />

                {/* Shipping Address */}
                <AddressSection
                  title="Shipping Address"
                  address={shippingAddress}
                  setAddress={setShippingAddress}
                  idPrefix="shipping"
                />

                {/* Save Button */}
                <div className="mt-8">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-8 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving...
                      </>
                    ) : (
                      'Save'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Address Section Component
interface AddressSectionProps {
  title: string;
  address: Address;
  setAddress: (address: Address) => void;
  idPrefix: string;
}

function AddressSection({ title, address, setAddress, idPrefix }: AddressSectionProps) {
  return (
    <section className="mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      
      <div className="space-y-4">
        {/* Address Line 1 */}
        <div>
          <label htmlFor={`${idPrefix}_address1`} className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            type="text"
            id={`${idPrefix}_address1`}
            value={address.address1}
            onChange={(e) => setAddress({ ...address, address1: e.target.value })}
            className="w-full md:w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        {/* Address Line 2 */}
        <div>
          <label htmlFor={`${idPrefix}_address2`} className="block text-sm font-medium text-gray-700 mb-1">
            Address 2
          </label>
          <input
            type="text"
            id={`${idPrefix}_address2`}
            value={address.address2}
            onChange={(e) => setAddress({ ...address, address2: e.target.value })}
            className="w-full md:w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        {/* City */}
        <div>
          <label htmlFor={`${idPrefix}_city`} className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <input
            type="text"
            id={`${idPrefix}_city`}
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
            className="w-full md:w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        {/* Country */}
        <div>
          <label htmlFor={`${idPrefix}_country`} className="block text-sm font-medium text-gray-700 mb-1">
            Country
          </label>
          <select
            id={`${idPrefix}_country`}
            value={address.country}
            onChange={(e) => setAddress({ ...address, country: e.target.value, state: '' })}
            className="w-full md:w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            {COUNTRIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:w-2/3">
          {/* Zip/Postal Code */}
          <div>
            <label htmlFor={`${idPrefix}_zip`} className="block text-sm font-medium text-gray-700 mb-1">
              Zip/Postal Code
            </label>
            <input
              type="text"
              id={`${idPrefix}_zip`}
              value={address.zip}
              onChange={(e) => setAddress({ ...address, zip: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {/* State */}
          <div>
            <label htmlFor={`${idPrefix}_state`} className="block text-sm font-medium text-gray-700 mb-1">
              State
            </label>
            {address.country === 'US' ? (
              <select
                id={`${idPrefix}_state`}
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                {US_STATES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                id={`${idPrefix}_state`}
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
