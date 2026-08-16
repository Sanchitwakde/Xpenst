import { X } from 'lucide-react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function Modal({
                                  isOpen,
                                  onClose,
                                  title,
                                  description,
                                  children,
                                  footer,
                                  size = 'md',
                              }) {
    useEffect(() => {
        if (!isOpen) return undefined;

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') onClose?.();
        };

        document.body.classList.add('modal-open');
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.classList.remove('modal-open');
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div className="modal" role="dialog" aria-modal="true">
            <div className="modal__backdrop" onClick={onClose} />

            <div className={`modal__dialog modal__dialog--${size}`}>
                <div className="modal__header">
                    <div>
                        <h3>{title}</h3>
                        {description ? <p>{description}</p> : null}
                    </div>

                    <button type="button" className="btn-icon" onClick={onClose} aria-label="Close modal">
                        <X size={18} />
                    </button>
                </div>

                <div className="modal__content">{children}</div>

                {footer ? <div className="modal__footer">{footer}</div> : null}
            </div>
        </div>,
        document.body
    );
}