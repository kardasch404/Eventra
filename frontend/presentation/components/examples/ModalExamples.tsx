'use client';

/**
 * Modal Component Usage Examples
 * 
 * This file demonstrates various ways to use the Modal component
 * following best practices and common patterns.
 */

import { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, ModalButton } from '../ui/Modal';

// Example 1: Simple Confirmation Modal
export function ConfirmationModal() {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    console.log('Action confirmed');
    setIsOpen(false);
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Delete Item</button>
      
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Confirm Deletion"
        size="sm"
      >
        <ModalBody>
          Are you sure you want to delete this item? This action cannot be undone.
        </ModalBody>
        <ModalFooter>
          <ModalButton variant="secondary" onClick={() => setIsOpen(false)}>
            Cancel
          </ModalButton>
          <ModalButton variant="danger" onClick={handleConfirm}>
            Delete
          </ModalButton>
        </ModalFooter>
      </Modal>
    </>
  );
}

// Example 2: Form Modal
export function FormModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setIsOpen(false);
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Add User</button>
      
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Add New User"
        size="md"
      >
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <ModalButton variant="secondary" onClick={() => setIsOpen(false)}>
              Cancel
            </ModalButton>
            <ModalButton variant="primary" type="submit">
              Add User
            </ModalButton>
          </ModalFooter>
        </form>
      </Modal>
    </>
  );
}

// Example 3: Info Modal (No Header Border)
export function InfoModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Show Info</button>
      
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        showCloseButton={false}
        size="md"
      >
        <div className="text-center py-6">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Success!</h3>
          <p className="text-gray-600 mb-6">Your action has been completed successfully.</p>
          <ModalButton variant="primary" onClick={() => setIsOpen(false)}>
            Got it
          </ModalButton>
        </div>
      </Modal>
    </>
  );
}

// Example 4: Image Gallery Modal
export function ImageGalleryModal({ images }: { images: string[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>View Gallery</button>
      
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        size="xl"
        showCloseButton={true}
      >
        <div className="relative">
          <img 
            src={images[currentIndex]} 
            alt={`Gallery ${currentIndex + 1}`}
            className="w-full h-96 object-cover rounded"
          />
          
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
          >
            ←
          </button>
          
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
          >
            →
          </button>
          
          <div className="text-center mt-4 text-gray-600">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      </Modal>
    </>
  );
}

// Example 5: Loading Modal
export function LoadingModal({ isLoading }: { isLoading: boolean }) {
  return (
    <Modal
      isOpen={isLoading}
      onClose={() => {}}
      showCloseButton={false}
      size="sm"
    >
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Processing your request...</p>
      </div>
    </Modal>
  );
}

// Example 6: Nested Content Modal (Scrollable)
export function ContentModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Read Article</button>
      
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Article Title"
        size="lg"
      >
        <ModalHeader>Understanding React Modals</ModalHeader>
        <ModalBody>
          <div className="prose prose-sm max-w-none">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
            <h3>Section 1</h3>
            <p>More content here...</p>
            {/* Add more content to demonstrate scrolling */}
          </div>
        </ModalBody>
        <ModalFooter>
          <ModalButton variant="secondary" onClick={() => setIsOpen(false)}>
            Close
          </ModalButton>
        </ModalFooter>
      </Modal>
    </>
  );
}

// Example 7: Multi-Step Modal
export function MultiStepModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Start Wizard</button>
      
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setStep(1);
        }}
        title={`Step ${step} of 3`}
        size="md"
      >
        <ModalBody>
          {step === 1 && <div>Step 1 content</div>}
          {step === 2 && <div>Step 2 content</div>}
          {step === 3 && <div>Step 3 content</div>}
        </ModalBody>
        <ModalFooter>
          {step > 1 && (
            <ModalButton variant="secondary" onClick={prevStep}>
              Back
            </ModalButton>
          )}
          {step < 3 ? (
            <ModalButton variant="primary" onClick={nextStep}>
              Next
            </ModalButton>
          ) : (
            <ModalButton variant="primary" onClick={() => setIsOpen(false)}>
              Finish
            </ModalButton>
          )}
        </ModalFooter>
      </Modal>
    </>
  );
}
