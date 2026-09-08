/**
 * The system's signature structure: content on a rounded surface inset from the
 * ground, like a cup set down on a saucer. One per page — it lives in the root
 * layout so no page has to remember it. Nested trays are not a thing.
 *
 * Below 640px it goes full-bleed and drops its radius: screen real estate beats
 * the device on a phone.
 */
export function Tray({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-bg sm:p-3 lg:p-6">
      {/* `overflow-clip`, not `overflow-hidden`: both clip children to the
          tray's rounded corners, but `hidden` creates a scroll container and
          kills `position: sticky` on the header inside it. `clip` does not. */}
      <div className="mx-auto flex min-h-dvh max-w-(--container-tray) flex-col overflow-clip bg-surface sm:min-h-0 sm:rounded-tray sm:shadow-tray">
        {children}
      </div>
    </div>
  );
}
