import { WhatsAppIcon } from "@/components/icons/ContactIcons";
import { CONTACT } from "@/lib/constants/site";

interface WhatsAppInquiryProps {
  /** Pre-filled chat message (already localised). */
  message: string;
  label: string;
}

/**
 * Opens a WhatsApp chat to the showroom with a product-specific message
 * pre-filled via wa.me's ?text= parameter. External link, new tab, safely rel'd.
 */
export function WhatsAppInquiry({ message, label }: WhatsAppInquiryProps) {
  const href = `${CONTACT.whatsapp.href}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="btn-lux inline-flex items-center justify-center gap-2.5 rounded-full border border-white/15 bg-white/[0.04] px-6 py-3.5 font-medium text-white transition-colors hover:border-white/30 hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
    >
      {/* Palette-matched dark control; the glyph keeps WhatsApp's green so it's
          still instantly recognisable without the loud full-green button. */}
      <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />
      {label}
    </a>
  );
}
