"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ContactForm() {
  const [formState, setFormState] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const tempErrors: Record<string, string> = {};
    if (!formState.fullName.trim()) tempErrors.fullName = "Full Name is required";
    
    if (!formState.email.trim()) {
      tempErrors.email = "Email Address is required";
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      tempErrors.email = "Please enter a valid email address";
    }

    if (!formState.phone.trim()) {
      tempErrors.phone = "Phone Number is required";
    } else if (!/^[0-9+\s-]{10,15}$/.test(formState.phone.replace(/\s/g, ""))) {
      tempErrors.phone = "Please enter a valid phone number (10-15 digits)";
    }

    if (!formState.role) tempErrors.role = "Please select your role";
    if (!formState.message.trim()) tempErrors.message = "Message is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    // Clear error for field once user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate sending network request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormState({
        fullName: "",
        email: "",
        phone: "",
        role: "",
        message: "",
      });
    }, 2000);
  };

  return (
    <div className="glass-card p-6 sm:p-10 border border-white/5 relative overflow-hidden bg-charcoal-light/40">
      <div className="absolute inset-0 bg-shimmer opacity-10 pointer-events-none" />
      
      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.form
            key="contact-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-6"
            noValidate
          >
            {/* Input grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="flex flex-col">
                <label htmlFor="fullName" className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Full Name <span className="text-gold">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formState.fullName}
                  onChange={handleInputChange}
                  placeholder="e.g. Rahul Kumar"
                  className={`px-4 py-3 bg-charcoal border text-white text-sm focus:outline-none focus:border-gold transition-colors ${
                    errors.fullName ? "border-muted-red" : "border-white/10"
                  }`}
                />
                {errors.fullName && (
                  <p className="text-xs text-muted-red-light mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.fullName}
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div className="flex flex-col">
                <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Email Address <span className="text-gold">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formState.email}
                  onChange={handleInputChange}
                  placeholder="e.g. rahul@example.com"
                  className={`px-4 py-3 bg-charcoal border text-white text-sm focus:outline-none focus:border-gold transition-colors ${
                    errors.email ? "border-muted-red" : "border-white/10"
                  }`}
                />
                {errors.email && (
                  <p className="text-xs text-muted-red-light mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.email}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div className="flex flex-col">
                <label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Phone Number <span className="text-gold">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formState.phone}
                  onChange={handleInputChange}
                  placeholder="e.g. +91 9876543210"
                  className={`px-4 py-3 bg-charcoal border text-white text-sm focus:outline-none focus:border-gold transition-colors ${
                    errors.phone ? "border-muted-red" : "border-white/10"
                  }`}
                />
                {errors.phone && (
                  <p className="text-xs text-muted-red-light mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.phone}
                  </p>
                )}
              </div>

              {/* Role Selection */}
              <div className="flex flex-col">
                <label htmlFor="role" className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  I am a: <span className="text-gold">*</span>
                </label>
                <div className="relative">
                  <select
                    id="role"
                    name="role"
                    value={formState.role}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-charcoal border text-white text-sm focus:outline-none focus:border-gold transition-colors appearance-none cursor-pointer ${
                      errors.role ? "border-muted-red" : "border-white/10"
                    }`}
                  >
                    <option value="" disabled>Select your category</option>
                    <option value="Player">Player</option>
                    <option value="Team">Team</option>
                    <option value="Coach">Coach</option>
                    <option value="Supporter">Supporter</option>
                    <option value="Organization">Organization</option>
                    <option value="Partner">Partner</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                    ▼
                  </div>
                </div>
                {errors.role && (
                  <p className="text-xs text-muted-red-light mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.role}
                  </p>
                )}
              </div>
            </div>

            {/* Message Area */}
            <div className="flex flex-col">
              <label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Message <span className="text-gold">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={formState.message}
                onChange={handleInputChange}
                placeholder="Tell us about your Kabaddi journey, your team, or how you want to support..."
                className={`px-4 py-3 bg-charcoal border text-white text-sm focus:outline-none focus:border-gold transition-colors ${
                  errors.message ? "border-muted-red" : "border-white/10"
                }`}
              />
              {errors.message && (
                <p className="text-xs text-muted-red-light mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="group flex items-center justify-center gap-2 w-full py-4 bg-forest-medium hover:bg-gold text-white hover:text-charcoal font-bold uppercase tracking-widest border border-gold/20 hover:border-gold rounded-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending Message...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
                  Send Message
                </>
              )}
            </button>
          </motion.form>
        ) : (
          <motion.div
            key="success-screen"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="py-12 px-4 text-center flex flex-col items-center justify-center"
          >
            <div className="w-16 h-16 bg-forest-medium/20 text-gold border border-gold/30 rounded-none flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            
            <h4 className="text-3xl font-oswald font-bold text-white uppercase tracking-wider mb-3">
              Message Received Successfully!
            </h4>
            
            <p className="text-gray-300 text-sm max-w-md font-light leading-relaxed mb-8">
              Thank you for reaching out to P.G. Brothers. We appreciate your connection and support for Kabaddi. Our team will review your message and get back to you shortly.
            </p>

            <button
              onClick={() => setIsSuccess(false)}
              className="px-6 py-2.5 bg-charcoal border border-white/10 hover:border-gold text-white hover:text-gold text-xs font-bold uppercase tracking-wider transition-colors duration-300"
            >
              Send Another Message
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
