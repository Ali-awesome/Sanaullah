import { cvDownloadUrl } from "../api/client.js";

/**
 * The "Download CV" call-to-action, shared by Home and About so the markup
 * and the CV's actual source URL aren't duplicated between them. The CV is
 * served by the backend (see cvDownloadUrl) rather than a static frontend
 * file, so an admin upload can actually replace what this links to.
 */
export default function DownloadCvButton({ className = "" }) {
  return (
    <div className={`tokyo_tm_button ${className}`} data-position="left">
      <a href={cvDownloadUrl()} download>
        <span>Download CV</span>
      </a>
    </div>
  );
}
