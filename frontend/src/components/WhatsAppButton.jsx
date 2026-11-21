import { useSettings } from '../context/SettingsContext.jsx';

export const waLink = (number, text) => `https://wa.me/${String(number || '').replace(/\D/g, '')}?text=${encodeURIComponent(text || '')}`;

export default function WhatsAppButton() {
  const { settings } = useSettings();
  if (!settings.whatsappNumber) return null;
  return (
    <a className="wa-float" href={waLink(settings.whatsappNumber, settings.whatsappMessage)} target="_blank" rel="noreferrer" aria-label="Chat with us on WhatsApp">
      <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true">
        <path fill="currentColor" d="M16.04 3C9.4 3 4 8.4 4 15.02c0 2.12.56 4.19 1.62 6.01L4 29l8.14-1.6a12.03 12.03 0 0 0 3.9.65h.01C22.68 28.05 28 22.65 28 16.03 28 9.4 22.68 3 16.04 3Zm0 22.03h-.01c-1.2 0-2.38-.32-3.4-.93l-.24-.15-4.83.95.99-4.7-.16-.25a9.97 9.97 0 0 1-1.54-5.3c0-5.5 4.5-9.97 10.04-9.97 5.53 0 10.03 4.47 10.03 9.97 0 5.5-4.5 10.38-10.88 10.38Zm5.5-7.5c-.3-.15-1.78-.88-2.06-.98-.27-.1-.47-.15-.67.15-.2.3-.77.98-.95 1.18-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.67-2.08-.18-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.38-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.48.7.3 1.26.48 1.69.62.7.22 1.35.2 1.86.12.57-.08 1.78-.73 2.03-1.43.25-.7.25-1.3.17-1.43-.07-.13-.27-.2-.57-.35Z" />
      </svg>
      <span>Chat on WhatsApp</span>
    </a>
  );
}
