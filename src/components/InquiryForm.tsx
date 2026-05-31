'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';

// ============================================
// Option helper functions (locale-aware)
// ============================================

function getTravelerTypes(t: any) {
  return [
    { value: 'Couple', label: t('options.travelerType.Couple') },
    { value: 'Family', label: t('options.travelerType.Family') },
    { value: 'Solo', label: t('options.travelerType.Solo') },
    { value: 'Friends', label: t('options.travelerType.Friends') },
  ];
}

function getBudgetRanges(t: any) {
  return [
    { value: '10000-30000', label: t('options.budget.10000-30000') },
    { value: '30000-50000', label: t('options.budget.30000-50000') },
    { value: '50000-100000', label: t('options.budget.50000-100000') },
    { value: '100000+', label: t('options.budget.100000+') },
  ];
}

function getInterestOptions(t: any) {
  return [
    { value: 'Culture', label: t('options.interests.Culture') },
    { value: 'Adventure', label: t('options.interests.Adventure') },
    { value: 'Wellness', label: t('options.interests.Wellness') },
    { value: 'Food', label: t('options.interests.Food') },
    { value: 'Wildlife', label: t('options.interests.Wildlife') },
    { value: 'History', label: t('options.interests.History') },
    { value: 'Nature', label: t('options.interests.Nature') },
    { value: 'Photography', label: t('options.interests.Photography') },
  ];
}

function getEmotionOptions(t: any) {
  return [
    { value: 'Contentment', label: t('options.emotions.Contentment'), icon: t('options.emotionIcons.Contentment') },
    { value: 'Revitalized', label: t('options.emotions.Revitalized'), icon: t('options.emotionIcons.Revitalized') },
    { value: 'Freedom', label: t('options.emotions.Freedom'), icon: t('options.emotionIcons.Freedom') },
    { value: 'Distraction', label: t('options.emotions.Distraction'), icon: t('options.emotionIcons.Distraction') },
    { value: 'Challenged', label: t('options.emotions.Challenged'), icon: t('options.emotionIcons.Challenged') },
  ];
}

// ============================================
// Component Props
// ============================================

interface InquiryFormProps {
  prefillDestination?: string;
  prefillEmotion?: string;
  tripSlug?: string;
  tripTitle?: string;
}

// ============================================
// Component Implementation
// ============================================

export function InquiryForm({ prefillDestination, prefillEmotion, tripSlug, tripTitle }: InquiryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations('form');
  const locale = useLocale();

  // Build schema with locale-aware error messages
  const inquirySchema = z.object({
    firstName: z.string().min(2, t('errors.firstName')),
    lastName: z.string().min(2, t('errors.lastName')),
    email: z.string().min(1, t('errors.emailRequired')).email(t('errors.email')),
    phone: z.string().optional(),
    destination: z.string().min(1, t('errors.destination')),
    travelDate: z.string().optional(),
    isFlexible: z.boolean().optional(),
    duration: z.number().min(1).max(60).optional(),
    travelers: z.number().min(1).max(50).optional(),
    travelerType: z.enum(['Couple', 'Family', 'Solo', 'Friends']).optional(),
    budget: z.enum(['10000-30000', '30000-50000', '50000-100000', '100000+']).optional(),
    emotions: z.array(z.string()).optional(),
    interests: z.array(z.string()).optional(),
    notes: z.string().max(2000).optional(),
  });

  type InquiryFormData = z.infer<typeof inquirySchema>;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      destination: prefillDestination || '',
      travelers: 1,
      isFlexible: false,
    },
  });

  const selectedInterests = watch('interests') || [];
  const selectedEmotions = watch('emotions') || [];

  const toggleInterest = (value: string) => {
    const current = selectedInterests;
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setValue('interests', next);
  };

  const toggleEmotion = (value: string) => {
    const current = selectedEmotions;
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setValue('emotions', next);
  };

  const onSubmit = async (data: InquiryFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(t('errors.submitFailed'));
      }

      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.submitError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state
  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="text-6xl mb-4">✨</div>
        <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">
          {t('success.title')}
        </h3>
        <p className="text-gray-600 mb-6">
          {t('success.subtitle')}
        </p>
        <p className="text-sm text-gray-500">
          {t('success.phone')}
        </p>
      </motion.div>
    );
  }

  const travelerTypes = getTravelerTypes(t);
  const budgetRanges = getBudgetRanges(t);
  const interestOptions = getInterestOptions(t);
  const emotionOptions = getEmotionOptions(t);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Basic Information */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">{t('sections.basic')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label={t('fields.lastName')}
            error={errors.lastName}
          >
            <input
              {...register('lastName')}
              type="text"
              className="input-field"
              placeholder={t('placeholders.lastName')}
            />
          </FormField>

          <FormField
            label={t('fields.firstName')}
            error={errors.firstName}
          >
            <input
              {...register('firstName')}
              type="text"
              className="input-field"
              placeholder={t('placeholders.firstName')}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <FormField
            label={t('fields.email')}
            error={errors.email}
          >
            <input
              {...register('email')}
              type="email"
              className="input-field"
              placeholder={t('placeholders.email')}
            />
          </FormField>

          <FormField label={t('fields.phone')} error={errors.phone}>
            <input
              {...register('phone')}
              type="tel"
              className="input-field"
              placeholder={t('placeholders.phone')}
            />
          </FormField>
        </div>
      </div>

      {/* Travel Preferences */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">{t('sections.needs')}</h3>

        <FormField label={t('fields.destination')} error={errors.destination}>
          <input
            {...register('destination')}
            type="text"
            className="input-field"
            placeholder={t('placeholders.destination')}
          />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <FormField label={t('fields.travelDate')} error={errors.travelDate}>
            <input
              {...register('travelDate')}
              type="date"
              className="input-field"
            />
          </FormField>

          <FormField label={t('fields.duration')} error={errors.duration}>
            <input
              {...register('duration', { valueAsNumber: true })}
              type="number"
              min={1}
              max={60}
              className="input-field"
              placeholder={t('placeholders.duration')}
            />
          </FormField>
        </div>

        <div className="mt-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              {...register('isFlexible')}
              type="checkbox"
              className="w-4 h-4 text-yellow-600 rounded"
            />
            <span className="text-sm text-gray-700">{t('fields.flexible')}</span>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <FormField label={t('fields.travelers')} error={errors.travelers}>
            <input
              {...register('travelers', { valueAsNumber: true })}
              type="number"
              min={1}
              max={50}
              className="input-field"
            />
          </FormField>

          <FormField label={t('fields.travelerType')} error={errors.travelerType}>
            <select {...register('travelerType')} className="input-field">
              <option value="">{t('options.select')}</option>
              {travelerTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <FormField label={t('fields.budget')} error={errors.budget} className="mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {budgetRanges.map((range) => (
              <button
                key={range.value}
                type="button"
                onClick={() => setValue('budget', range.value as any)}
                className={`p-3 rounded border text-sm transition-all ${
                  watch('budget') === range.value
                    ? 'border-yellow-600 bg-yellow-50 text-yellow-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </FormField>
      </div>

      {/* Emotions */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          {t('sections.emotions')}
        </h3>
        <div className="flex flex-wrap gap-2">
          {emotionOptions.map((emotion) => {
            const isSelected = selectedEmotions.includes(emotion.value);
            return (
              <button
                key={emotion.value}
                type="button"
                onClick={() => toggleEmotion(emotion.value)}
                className={`px-4 py-2 rounded-full border text-sm transition-all ${
                  isSelected
                    ? 'border-yellow-600 bg-yellow-50 text-yellow-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {emotion.icon} {emotion.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interests */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          {t('sections.interests')}
        </h3>
        <div className="flex flex-wrap gap-2">
          {interestOptions.map((interest) => {
            const isSelected = selectedInterests.includes(interest.value);
            return (
              <button
                key={interest.value}
                type="button"
                onClick={() => toggleInterest(interest.value)}
                className={`px-4 py-2 rounded-full border text-sm transition-all ${
                  isSelected
                    ? 'border-yellow-600 bg-yellow-50 text-yellow-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {interest.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Notes */}
      <FormField label={t('fields.notes')} error={errors.notes}>
        <textarea
          {...register('notes')}
          rows={4}
          className="input-field resize-none"
          placeholder={t('placeholders.notes')}
        />
      </FormField>

      {/* Submit */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-gray-900 text-white text-lg font-medium rounded hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? t('submitting') : t('submit')}
        </button>
        <p className="mt-3 text-center text-sm text-gray-500">
          {t('privacy')}
        </p>
      </div>
    </form>
  );
}

// ============================================
// Form Field Wrapper
// ============================================

function FormField({
  label,
  error,
  children,
  className = '',
}: {
  label: string;
  error?: { message?: string };
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error.message}</p>
      )}
    </div>
  );
}
