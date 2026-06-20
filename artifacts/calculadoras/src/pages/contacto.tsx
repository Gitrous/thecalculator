import React, { useState } from "react";
import { Mail, MessageSquare, Send, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Seo } from "@/components/seo";
import { useLocale } from "@/lib/locale";
import { CONTACT_EMAIL } from "@/lib/site";

const T = {
  es: {
    seoTitle: "Contacto | thecalculator.tech",
    seoDesc: "¿Tienes alguna pregunta o sugerencia? Escríbenos y te responderemos lo antes posible.",
    hero: "¿Tienes alguna pregunta?",
    heroSub: "Estamos aquí para ayudarte. Escríbenos sobre cualquier duda, sugerencia o error que hayas encontrado y te responderemos en el menor tiempo posible.",
    name: "Nombre",
    namePh: "Tu nombre",
    email: "Correo electrónico",
    emailPh: "tu@correo.com",
    subject: "Asunto",
    subjectOpts: [
      { value: "Consulta general", label: "Consulta general" },
      { value: "Error en calculadora", label: "Error en calculadora" },
      { value: "Sugerencia de mejora", label: "Sugerencia de mejora" },
      { value: "Sugerencia de nueva calculadora", label: "Sugerencia de nueva calculadora" },
      { value: "Privacidad / datos", label: "Privacidad / datos" },
      { value: "Publicidad", label: "Publicidad o colaboración" },
      { value: "Otro", label: "Otro" },
    ],
    message: "Mensaje",
    messagePh: "Describe tu consulta con el mayor detalle posible…",
    send: "Enviar mensaje",
    sending: "Enviando…",
    successTitle: "¡Mensaje enviado!",
    successBody: "Hemos recibido tu mensaje y te responderemos en breve. Gracias por contactarnos.",
    errorTitle: "No se pudo enviar",
    errorBody: "Ha ocurrido un error al enviar tu mensaje. Inténtalo de nuevo o escríbenos directamente a ",
    required: "Este campo es obligatorio.",
    invalidEmail: "Introduce un correo electrónico válido.",
    topics: [
      { icon: "💡", label: "Sugerencias", desc: "Nuevas calculadoras o mejoras en las existentes" },
      { icon: "🐛", label: "Errores", desc: "Cifras incorrectas o comportamientos inesperados" },
      { icon: "🔒", label: "Privacidad", desc: "Consultas sobre tus datos o nuestra política" },
      { icon: "📣", label: "Publicidad", desc: "Colaboraciones o anuncios en la plataforma" },
    ],
  },
  en: {
    seoTitle: "Contact | thecalculator.tech",
    seoDesc: "Have a question or suggestion? Write to us and we'll get back to you as soon as possible.",
    hero: "Have a question?",
    heroSub: "We're here to help. Write to us about any query, suggestion or error you've found and we'll reply as soon as possible.",
    name: "Name",
    namePh: "Your name",
    email: "Email address",
    emailPh: "you@email.com",
    subject: "Subject",
    subjectOpts: [
      { value: "General enquiry", label: "General enquiry" },
      { value: "Calculator error", label: "Calculator error" },
      { value: "Improvement suggestion", label: "Improvement suggestion" },
      { value: "New calculator suggestion", label: "New calculator suggestion" },
      { value: "Privacy / data", label: "Privacy / data" },
      { value: "Advertising", label: "Advertising or partnership" },
      { value: "Other", label: "Other" },
    ],
    message: "Message",
    messagePh: "Describe your enquiry in as much detail as possible…",
    send: "Send message",
    sending: "Sending…",
    successTitle: "Message sent!",
    successBody: "We've received your message and will get back to you shortly. Thank you for reaching out.",
    errorTitle: "Could not send",
    errorBody: "An error occurred while sending your message. Please try again or email us directly at ",
    required: "This field is required.",
    invalidEmail: "Please enter a valid email address.",
    topics: [
      { icon: "💡", label: "Suggestions", desc: "New calculators or improvements to existing ones" },
      { icon: "🐛", label: "Errors", desc: "Incorrect figures or unexpected behaviour" },
      { icon: "🔒", label: "Privacy", desc: "Questions about your data or our policy" },
      { icon: "📣", label: "Advertising", desc: "Collaborations or advertising on the platform" },
    ],
  },
};

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface Errors {
  name?: string;
  email?: string;
  message?: string;
}

export default function Contacto() {
  const locale = useLocale();
  const isEn = locale === "en";
  const t = T[isEn ? "en" : "es"];

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    subject: t.subjectOpts[0].value,
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const validate = (): boolean => {
    const e: Errors = {};
    if (!form.name.trim()) e.name = t.required;
    if (!form.email.trim()) e.email = t.required;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = t.invalidEmail;
    if (!form.message.trim()) e.message = t.required;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          _subject: `[thecalculator.tech] ${form.subject}`,
          message: form.message,
          _captcha: "false",
          _template: "table",
        }),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", subject: t.subjectOpts[0].value, message: "" });
        setErrors({});
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const field = (id: keyof FormState) => ({
    value: form[id],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((p) => ({ ...p, [id]: e.target.value }));
      if (errors[id as keyof Errors]) setErrors((p) => ({ ...p, [id]: undefined }));
    },
  });

  return (
    <>
      <Seo
        title={t.seoTitle}
        description={t.seoDesc}
        path={isEn ? "/en/contact" : "/contacto"}
        alternatePath={isEn ? "/contacto" : "/en/contact"}
      />

      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
            <MessageSquare className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
            {t.hero}
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            {t.heroSub}
          </p>
        </div>

        {/* Topic chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12">
          {t.topics.map((topic) => (
            <div
              key={topic.label}
              className="flex flex-col items-center text-center gap-2 p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5"
            >
              <span className="text-2xl">{topic.icon}</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{topic.label}</span>
              <span className="text-xs text-gray-500 dark:text-white/50 leading-snug">{topic.desc}</span>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-5 gap-10">
          {/* Form */}
          <div className="md:col-span-3">
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center text-center gap-4 py-16 px-8 rounded-2xl border border-primary/30 bg-primary/5">
                <CheckCircle className="w-14 h-14 text-primary" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t.successTitle}</h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm">{t.successBody}</p>
                <Button variant="outline" className="mt-2" onClick={() => setStatus("idle")}>
                  {isEn ? "Send another message" : "Enviar otro mensaje"}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    {t.name} <span className="text-primary">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder={t.namePh}
                    {...field("name")}
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 transition-colors ${
                      errors.name
                        ? "border-red-400 dark:border-red-500"
                        : "border-gray-200 dark:border-white/10 focus:border-primary dark:focus:border-primary"
                    }`}
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    {t.email} <span className="text-primary">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder={t.emailPh}
                    {...field("email")}
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 transition-colors ${
                      errors.email
                        ? "border-red-400 dark:border-red-500"
                        : "border-gray-200 dark:border-white/10 focus:border-primary dark:focus:border-primary"
                    }`}
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    {t.subject}
                  </label>
                  <select
                    id="subject"
                    {...field("subject")}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-white/10 text-sm bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:border-primary dark:focus:border-primary transition-colors"
                  >
                    {t.subjectOpts.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    {t.message} <span className="text-primary">*</span>
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    placeholder={t.messagePh}
                    {...field("message")}
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 resize-none transition-colors ${
                      errors.message
                        ? "border-red-400 dark:border-red-500"
                        : "border-gray-200 dark:border-white/10 focus:border-primary dark:focus:border-primary"
                    }`}
                  />
                  {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
                </div>

                {status === "error" && (
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700 dark:text-red-400">
                      {t.errorBody}
                      <a href={`mailto:${CONTACT_EMAIL}`} className="underline">{CONTACT_EMAIL}</a>.
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full gap-2 hover-elevate active-elevate-2"
                >
                  {status === "loading" ? (
                    t.sending
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {t.send}
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>

          {/* Sidebar info */}
          <div className="md:col-span-2 space-y-6">
            <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {isEn ? "Direct contact" : "Contacto directo"}
                </h3>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                {isEn
                  ? "You can also reach us directly by email:"
                  : "También puedes escribirnos directamente:"}
              </p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-sm font-medium text-primary hover:underline break-all"
              >
                {CONTACT_EMAIL}
              </a>
            </div>

            <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                {isEn ? "Response time" : "Tiempo de respuesta"}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {isEn
                  ? "We aim to reply within 24–48 hours on working days. Messages sent over the weekend may take a little longer."
                  : "Intentamos responder en un plazo de 24–48 horas en días laborables. Los mensajes enviados en fin de semana pueden tardar algo más."}
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                {isEn ? "Before writing to us" : "Antes de escribirnos"}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {isEn
                  ? "Check whether your question is already answered in the FAQ section of the relevant calculator. Most common questions are covered there."
                  : "Comprueba si tu pregunta ya está respondida en la sección de preguntas frecuentes de la calculadora en cuestión. La mayoría de dudas habituales están cubiertas allí."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
