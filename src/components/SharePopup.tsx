import React, { useRef, useEffect } from 'react';
import { X, Instagram, Twitter, Facebook, Link as LinkIcon } from 'lucide-react';

interface SharePopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url: string;
}

const SharePopup: React.FC<SharePopupProps> = ({ isOpen, onClose, title, url }) => {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const socialLinks = [
    {
      name: 'Instagram',
      icon: <Instagram className="w-6 h-6" />,
      url: `https://www.instagram.com/share?url=${encodeURIComponent(url)}`,
    },
    {
      name: 'Twitter',
      icon: <Twitter className="w-6 h-6" />,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    },
    {
      name: 'Facebook',
      icon: <Facebook className="w-6 h-6" />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        ref={popupRef}
        className="bg-primary-light rounded-lg p-6 max-w-sm w-full mx-4 relative"
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-title"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-light hover:text-white transition"
          aria-label="Close share dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 id="share-title" className="text-xl font-serif text-white mb-6">Share</h3>

        <div className="grid grid-cols-4 gap-4">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 text-gray-light hover:text-secondary transition"
              aria-label={`Share on ${link.name}`}
            >
              {link.icon}
              <span className="text-xs">{link.name}</span>
            </a>
          ))}
          <button
            onClick={handleCopyLink}
            className="flex flex-col items-center gap-2 text-gray-light hover:text-secondary transition"
            aria-label="Copy link"
          >
            <LinkIcon className="w-6 h-6" />
            <span className="text-xs">Copy Link</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SharePopup;