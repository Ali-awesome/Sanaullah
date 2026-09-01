import { useState } from "react";
import { submitContact } from "../../api/client.js";

export default function Contact({ profile }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null); // { type: 'success'|'error', text }
  const [sending, setSending] = useState(false);

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
      <div className="tokyo_tm_contact">
        <div className="tokyo_tm_title">
          <div className="title_flex">
            <div className="left">
              <span>Contact</span>
              <h2>Get in Touch</h2>
            </div>
          </div>
        </div>
        <div className="map_wrap">
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
        <div className="fields">
          <form className="contact_form" onSubmit={handleSubmit} autoComplete="off">
            {status && (
              <div className={status.type === "success" ? "returnmessage" : "empty_notice"} style={{ display: "block" }}>
                <span>{status.text}</span>
              </div>
            )}
            <div className="first">
              <ul>
                <li>
                  <input type="text" placeholder="Name" value={form.name} onChange={update("name")} />
                </li>
                <li>
                  <input type="text" placeholder="Email" value={form.email} onChange={update("email")} />
                </li>
              </ul>
            </div>
            <div className="last">
              <textarea placeholder="Message" value={form.message} onChange={update("message")}></textarea>
            </div>
            <div className="tokyo_tm_button" data-position="left">
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
