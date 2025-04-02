import { useState } from 'react';
import { useLanguage } from '@/hooks/use-language';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import SignupForm from './auth/SignupForm';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';
import { SubscriptionPlan } from '@shared/schema';

const PricingPlans = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>('premium');
  const [, setLocation] = useLocation();
  const [showSignupModal, setShowSignupModal] = useState(false);

  const handlePlanSelect = (plan: 'basic' | 'premium' | 'vip') => {
    setSelectedPlan(plan);
    
    if (user) {
      // If user is logged in, redirect to dashboard with selected plan
      setLocation('/dashboard?newSubscription=true');
    } else {
      // Otherwise, show signup modal
      setShowSignupModal(true);
    }
  };

  return (
    <section id="pricing" className="py-16 bg-[#FAFAF9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-[#1A2421] sm:text-4xl font-heading">
            {t('pricing.title')}
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-xl text-[#52524E]">
            {t('pricing.subtitle')}
          </p>
        </div>

        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
          {/* Basic Plan */}
          <div 
            className={`bg-white rounded-lg shadow-sm divide-y divide-[#E5E5E3] hover:shadow-md transition-shadow duration-300 ${
              selectedPlan === 'basic' ? 'ring-2 ring-primary' : ''
            }`}
          >
            <div className="p-6">
              <h3 className="text-xl font-medium text-[#1A2421] font-heading">
                {t('pricing.basic.title')}
              </h3>
              <p className="mt-4 text-sm text-[#52524E]">
                {t('pricing.basic.description')}
              </p>
              <p className="mt-8">
                <span className="text-4xl font-extrabold text-primary">
                  {t('pricing.basic.price')}
                </span>
                <span className="text-base font-medium text-[#A3A3A1]">
                  {' '}{t('pricing.currency')}
                </span>
              </p>
              
              <Dialog open={showSignupModal && selectedPlan === 'basic'} onOpenChange={(open) => {
                if (!open) setShowSignupModal(false);
              }}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={() => handlePlanSelect('basic')}
                    variant="outline"
                    className="mt-8 w-full py-3 px-6 border border-primary rounded-md text-center font-medium text-primary hover:bg-[#FAFAF9]"
                  >
                    {t('pricing.basic.select')}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <SignupForm onSuccess={() => {
                    setShowSignupModal(false);
                    setLocation('/dashboard?newSubscription=true');
                  }} />
                </DialogContent>
              </Dialog>
            </div>
            <div className="px-6 pt-6 pb-8">
              <h4 className="text-sm font-medium text-[#1A2421]">
                {t('pricing.included')}
              </h4>
              <ul className="mt-6 space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 brand-check-icon" />
                  </div>
                  <span className="ml-3 text-sm text-[#52524E]">
                    {t('pricing.basic.feature1')}
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 brand-check-icon" />
                  </div>
                  <span className="ml-3 text-sm text-[#52524E]">
                    {t('pricing.basic.feature2')}
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 brand-check-icon" />
                  </div>
                  <span className="ml-3 text-sm text-[#52524E]">
                    {t('pricing.basic.feature3')}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Premium Plan */}
          <div 
            className={`bg-white rounded-lg shadow-sm divide-y divide-[#E5E5E3] hover:shadow-md transition-shadow duration-300 ${
              selectedPlan === 'premium' ? 'ring-2 ring-primary' : ''
            }`}
          >
            <div className="p-6">
              <h3 className="text-xl font-medium text-[#1A2421] font-heading">
                {t('pricing.premium.title')}
              </h3>
              <p className="mt-4 text-sm text-[#52524E]">
                {t('pricing.premium.description')}
              </p>
              <p className="mt-8">
                <span className="text-4xl font-extrabold text-primary">
                  {t('pricing.premium.price')}
                </span>
                <span className="text-base font-medium text-[#A3A3A1]">
                  {' '}{t('pricing.currency')}
                </span>
              </p>
              
              <Dialog open={showSignupModal && selectedPlan === 'premium'} onOpenChange={(open) => {
                if (!open) setShowSignupModal(false);
              }}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={() => handlePlanSelect('premium')}
                    className="mt-8 w-full py-3 px-6 rounded-md text-center font-medium text-white brand-button"
                  >
                    {t('pricing.premium.select')}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <SignupForm onSuccess={() => {
                    setShowSignupModal(false);
                    setLocation('/dashboard?newSubscription=true');
                  }} />
                </DialogContent>
              </Dialog>
            </div>
            <div className="px-6 pt-6 pb-8">
              <h4 className="text-sm font-medium text-[#1A2421]">
                {t('pricing.included')}
              </h4>
              <ul className="mt-6 space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 brand-check-icon" />
                  </div>
                  <span className="ml-3 text-sm text-[#52524E]">
                    {t('pricing.premium.feature1')}
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 brand-check-icon" />
                  </div>
                  <span className="ml-3 text-sm text-[#52524E]">
                    {t('pricing.premium.feature2')}
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 brand-check-icon" />
                  </div>
                  <span className="ml-3 text-sm text-[#52524E]">
                    {t('pricing.premium.feature3')}
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 brand-check-icon" />
                  </div>
                  <span className="ml-3 text-sm text-[#52524E]">
                    {t('pricing.premium.feature4')}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* VIP Plan */}
          <div 
            className={`bg-white rounded-lg shadow-sm divide-y divide-[#E5E5E3] hover:shadow-md transition-shadow duration-300 ${
              selectedPlan === 'vip' ? 'ring-2 ring-primary' : ''
            }`}
          >
            <div className="p-6">
              <h3 className="text-xl font-medium text-[#1A2421] font-heading">
                {t('pricing.vip.title')}
              </h3>
              <p className="mt-4 text-sm text-[#52524E]">
                {t('pricing.vip.description')}
              </p>
              <p className="mt-8">
                <span className="text-4xl font-extrabold text-primary">
                  {t('pricing.vip.price')}
                </span>
                <span className="text-base font-medium text-[#A3A3A1]">
                  {' '}{t('pricing.currency')}
                </span>
              </p>
              
              <Dialog open={showSignupModal && selectedPlan === 'vip'} onOpenChange={(open) => {
                if (!open) setShowSignupModal(false);
              }}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={() => handlePlanSelect('vip')}
                    variant="outline"
                    className="mt-8 w-full py-3 px-6 border border-primary rounded-md text-center font-medium text-primary hover:bg-[#FAFAF9]"
                  >
                    {t('pricing.vip.select')}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <SignupForm onSuccess={() => {
                    setShowSignupModal(false);
                    setLocation('/dashboard?newSubscription=true');
                  }} />
                </DialogContent>
              </Dialog>
            </div>
            <div className="px-6 pt-6 pb-8">
              <h4 className="text-sm font-medium text-[#1A2421]">
                {t('pricing.included')}
              </h4>
              <ul className="mt-6 space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 brand-check-icon" />
                  </div>
                  <span className="ml-3 text-sm text-[#52524E]">
                    {t('pricing.vip.feature1')}
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 brand-check-icon" />
                  </div>
                  <span className="ml-3 text-sm text-[#52524E]">
                    {t('pricing.vip.feature2')}
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 brand-check-icon" />
                  </div>
                  <span className="ml-3 text-sm text-[#52524E]">
                    {t('pricing.vip.feature3')}
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 brand-check-icon" />
                  </div>
                  <span className="ml-3 text-sm text-[#52524E]">
                    {t('pricing.vip.feature4')}
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 brand-check-icon" />
                  </div>
                  <span className="ml-3 text-sm text-[#52524E]">
                    {t('pricing.vip.feature5')}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingPlans;
