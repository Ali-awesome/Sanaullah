/**
 * Shown centered on screen while the initial API calls (profile/posts/
 * gallery/portfolio projects) are still in flight — before that data
 * exists there's nothing for the real intro curtain (Preloader) to reveal,
 * so this is a plain, lightweight "checking..." indicator instead. See
 * App.jsx for why this has to be a separate component from Preloader
 * rather than the same element handling both states.
 */
export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-white">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-black/10 border-t-black" />
    </div>
  );
}
