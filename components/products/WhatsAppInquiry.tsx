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
      className="btn-lux inline-flex items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-6 py-3.5 font-semibold text-white shadow-[0_10px_30px_-8px_rgba(37,211,102,0.5)] hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
    >
      <WhatsAppIcon className="h-5 w-5" />
      {label}
    </a>
  );
}
