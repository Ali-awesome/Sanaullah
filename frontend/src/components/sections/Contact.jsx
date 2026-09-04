import { useId, useState } from "react";
import { submitContact } from "../../api/client.js";

const inputClass =
  "h-11 w-full border border-[var(--fg)]/20 bg-transparent px-[10px] font-heading text-[15px] leading-[1.6] transition-all duration-300 ease-in-out focus:border-[var(--fg)]/50 focus:bg-[var(--fg)]/[0.06] focus:outline-none";

export default function Contact({ profile }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null); // { type: 'success'|'error', text }
  const [sending, setSending] = useState(false);
  const nameId = useId();
  const emailId = useId();
  const messageId = useId();

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setStatus({ type: "error", text: "Please fill required fields." });
      return;
    }
    setSending(true);
    setStatus(null);
    try {
      await submitContact(form);
      setStatus({ type: "success", text: "Your message has been received. I will reply soon." });
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus({ type: "error", text: err.message });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container">
      <div className="tokyo_tm_contact float-left w-full py-[100px] max-lg:pt-[130px] max-sm:pt-20">
        <div className="tokyo_tm_title">
          <div className="title_flex">
            <div className="left">
              <span>Contact</span>
              <h1>Get in Touch</h1>
            </div>
          </div>
        </div>
        <div className="map_wrap float-left mb-[50px] w-full">
          <div className="mapouter">
            <div className="gmap_canvas">
              <iframe
                width="100%"
                height="355"
                title="location"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(profile.contactMapQuery)}&t=&z=12&ie=UTF8&iwloc=&output=embed`}
                frameBorder="0"
                scrolling="no"
              ></iframe>
            </div>
          </div>
        </div>
        <div className="fields float-left w-full">
          <form className="contact_form" onSubmit={handleSubmit} autoComplete="off">
            {status && (
              <div
                role="status"
                aria-live="polite"
                className={`mb-[7px] text-left font-medium ${status.type === "success" ? "text-[#3A00FF]" : "text-[#F52225]"}`}
              >
                <span>{status.text}</span>
              </div>
            )}
            <div className="first float-left w-full">
              <ul className="m-0 list-none">
                <li className="float-left mb-[30px] w-full">
                  <label htmlFor={nameId} className="sr-only">
                    Name
                  </label>
                  <input id={nameId} type="text" placeholder="Name" className={inputClass} value={form.name} onChange={update("name")} />
                </li>
                <li className="float-left mb-[30px] w-full">
                  <label htmlFor={emailId} className="sr-only">
                    Email
                  </label>
                  <input
                    id={emailId}
                    type="email"
                    placeholder="Email"
                    className={inputClass}
                    value={form.email}
                    onChange={update("email")}
                  />
                </li>
              </ul>
            </div>
            <div className="last float-left w-full">
              <label htmlFor={messageId} className="sr-only">
                Message
              </label>
              <textarea
                id={messageId}
                placeholder="Message"
                className="mb-5 h-[120px] w-full resize-none border border-[var(--fg)]/20 bg-transparent p-[10px] font-heading text-[15px] leading-[1.4] transition-all duration-300 ease-in-out focus:border-[var(--fg)]/50 focus:bg-[var(--fg)]/[0.06] focus:outline-none"
                value={form.message}
                onChange={update("message")}
              ></textarea>
            </div>
            <div className="tokyo_tm_button float-left w-full" data-position="left">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (!sending) handleSubmit(e);
                }}
              >
                <span>{sending ? "Sending..." : "Send Message"}</span>
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
