"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";

/* ===== Brand Config ===== */
const BRAND = "#07518a"; // your brand color
const BRAND_TINT = "#0a6ab8"; // slightly lighter tint for hovers

/* ===== Animation Helpers ===== */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] },
});

const staggerWrap = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.08 },
  },
};

const child = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

/* ===== Input Component ===== */
function Field({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  type?: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  placeholder?: string;
}) {
  const shared =
    "w-full rounded-xl border bg-white/90 px-4 py-3 text-[15px] outline-none transition focus:bg-white";
  const border = `border-gray-200 focus:ring-2 focus:ring-[${BRAND}] focus:border-[${BRAND}]`;

  if (type === "textarea") {
    return (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={5}
        className={`${shared} ${border} resize-none`}
      />
    );
  }

  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`${shared} ${border}`}
    />
  );
}

/* ===== Main Component ===== */
export default function ContactFormBrand() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: replace with your API route
      await new Promise((r) => setTimeout(r, 900));
      setDone(true);
      setForm({ name: "", email: "", phone: "", message: "" });
    } finally {
      setLoading(false);
      setTimeout(() => setDone(false), 2500);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      {/* Card */}
      <motion.div
        {...fadeUp(0)}
        className="grid grid-cols-1 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:grid-cols-2"
      >
        {/* Left: Copy & Contact Info */}
        <div className="relative p-8 md:p-10">
          <div
            className="absolute inset-y-0 right-0 hidden w-px md:block"
            style={{
              background:
                "linear-gradient(to bottom, transparent, #e5e7eb, transparent)",
            }}
          />
          <motion.div variants={staggerWrap} initial="hidden" animate="show">
            <motion.h2
              variants={child}
              className="mb-3 text-4xl font-bold tracking-tight"
              style={{ color: BRAND }}
            >
              Get in touch
            </motion.h2>

            <motion.p variants={child} className="mb-8 text-gray-600">
              If you have any questions regarding our services or need help,
              please fill out the form here. We do our best to respond within 1
              business day.
            </motion.p>

            <div className="space-y-5">
              {/* Email */}
              <motion.div variants={child} className="flex items-start gap-4">
                <div
                  className="grid h-12 w-12 place-items-center rounded-xl bg-gray-50"
                  style={{ border: `1px solid ${BRAND}20` }}
                >
                  <Mail style={{ color: BRAND }} />
                </div>
                <div>
                  <div
                    className="text-sm font-semibold"
                    style={{ color: BRAND }}
                  >
                    Email
                  </div>
                  <div className="text-gray-700">info@brihasptahi.com</div>
                </div>
              </motion.div>

              {/* Phone */}
              <motion.div variants={child} className="flex items-start gap-4">
                <div
                  className="grid h-12 w-12 place-items-center rounded-xl bg-gray-50"
                  style={{ border: `1px solid ${BRAND}20` }}
                >
                  <Phone style={{ color: BRAND }} />
                </div>
                <div>
                  <div
                    className="text-sm font-semibold"
                    style={{ color: BRAND }}
                  >
                    Phone
                  </div>
                  <div className="text-gray-700">+91 98858 88835 </div>
                </div>
              </motion.div>

              {/* Address */}
              <motion.div variants={child} className="flex items-start gap-4">
                <div
                  className="grid h-12 w-12 place-items-center rounded-xl bg-gray-50"
                  style={{ border: `1px solid ${BRAND}20` }}
                >
                  <MapPin style={{ color: BRAND }} />
                </div>
                <div>
                  <div
                    className="text-sm font-semibold"
                    style={{ color: BRAND }}
                  >
                    Address
                  </div>
                  <div className="text-gray-700">
                    5th Floor, Sahithi Arcade, SR Nagar, Hyderabad - 500038
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Right: Form */}
        <div className="p-8 md:p-10">
          <motion.form
            variants={staggerWrap}
            initial="hidden"
            animate="show"
            onSubmit={onSubmit}
            className="space-y-5"
          >
            <motion.div variants={child}>
              <label
                htmlFor="name"
                className="mb-1 block text-sm font-medium text-gray-800"
              >
                Name
              </label>
              <Field
                name="name"
                value={form.name}
                onChange={onChange}
                placeholder="Your full name"
              />
            </motion.div>

            <motion.div variants={child}>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-gray-800"
              >
                Email
              </label>
              <Field
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="you@example.com"
              />
            </motion.div>

            <motion.div variants={child}>
              <label
                htmlFor="phone"
                className="mb-1 block text-sm font-medium text-gray-800"
              >
                Phone
              </label>
              <Field
                name="phone"
                value={form.phone}
                onChange={onChange}
                placeholder="+91 98765 43210"
              />
            </motion.div>

            <motion.div variants={child}>
              <label
                htmlFor="message"
                className="mb-1 block text-sm font-medium text-gray-800"
              >
                Message
              </label>
              <Field
                type="textarea"
                name="message"
                value={form.message}
                onChange={onChange}
                placeholder="Tell us a bit about your query..."
              />
            </motion.div>

            <motion.button
              variants={child}
              type="submit"
              disabled={loading}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-white shadow-sm transition focus:outline-none"
              style={{ backgroundColor: BRAND }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <span className="font-medium">
                {loading ? "Sending..." : done ? "Sent" : "Submit"}
              </span>
              <Send
                className="transition group-hover:translate-x-0.5"
                size={18}
              />
            </motion.button>

            {/* Tiny success bar */}
            {done && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "100%", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="h-1 rounded-full"
                style={{ background: BRAND_TINT }}
              />
            )}
          </motion.form>
        </div>
      </motion.div>
    </section>
  );
}
