import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ListingFormData {
  brand: string;
  model: string;
  condition: 'New' | 'Like New' | 'Good' | 'Fair';
  year: string;
  price: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  images: File[];
}

interface FormErrors {
  [key: string]: string;
}

const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MIN_IMAGE_WIDTH = 800;
const MIN_IMAGE_HEIGHT = 600;

const CreateListingModal: React.FC<CreateListingModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const modalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<ListingFormData>({
    brand: '',
    model: '',
    condition: 'New',
    year: new Date().getFullYear().toString(),
    price: '',
    description: '',
    contactEmail: user?.email || '',
    contactPhone: '',
    images: []
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const createBucket = async () => {
      try {
        const { data: buckets } = await supabase.storage.listBuckets();
        const listingsBucket = buckets?.find(bucket => bucket.name === 'listings');
        
        if (!listingsBucket) {
          const { error } = await supabase.storage.createBucket('listings', {
            public: true,
            fileSizeLimit: MAX_FILE_SIZE,
            allowedMimeTypes: ALLOWED_FILE_TYPES
          });
          
          if (error) throw error;
        }
      } catch (err) {
        console.error('Error creating storage bucket:', err);
        setErrors(prev => ({
          ...prev,
          submit: 'Failed to initialize storage. Please try again later.'
        }));
      }
    };

    if (isOpen) {
      createBucket();
    }
  }, [isOpen]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.brand.trim()) {
      newErrors.brand = 'Brand is required';
    }

    if (!formData.model.trim()) {
      newErrors.model = 'Model is required';
    }

    if (!formData.year || isNaN(Number(formData.year))) {
      newErrors.year = 'Valid year is required';
    } else {
      const year = Number(formData.year);
      const currentYear = new Date().getFullYear();
      if (year < 1800 || year > currentYear) {
        newErrors.year = `Year must be between 1800 and ${currentYear}`;
      }
    }

    if (!formData.price || isNaN(Number(formData.price))) {
      newErrors.price = 'Valid price is required';
    } else if (Number(formData.price) <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.contactEmail && !formData.contactPhone) {
      newErrors.contact = 'At least one contact method is required';
    }

    if (formData.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Valid email is required';
    }

    if (formData.contactPhone && !/^\+?[\d\s-]{10,}$/.test(formData.contactPhone)) {
      newErrors.contactPhone = 'Valid phone number is required';
    }

    if (formData.images.length === 0) {
      newErrors.images = 'At least one image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateImage = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          images: 'Invalid file type. Please use JPEG, PNG, or WebP'
        }));
        resolve(false);
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setErrors(prev => ({
          ...prev,
          images: 'File size must be less than 5MB'
        }));
        resolve(false);
        return;
      }

      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(img.src);
        if (img.width < MIN_IMAGE_WIDTH || img.height < MIN_IMAGE_HEIGHT) {
          setErrors(prev => ({
            ...prev,
            images: `Image must be at least ${MIN_IMAGE_WIDTH}x${MIN_IMAGE_HEIGHT} pixels`
          }));
          resolve(false);
        } else {
          resolve(true);
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        setErrors(prev => ({
          ...prev,
          images: 'Invalid image file'
        }));
        resolve(false);
      };
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles: File[] = [];

    for (const file of files) {
      const isValid = await validateImage(file);
      if (isValid) {
        validFiles.push(file);
      }
    }

    if (validFiles.length > 0) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...validFiles]
      }));
      setErrors(prev => ({ ...prev, images: '' }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setUploadProgress(0);
    setErrors({});

    try {
      // Upload images
      const imageUrls: string[] = [];
      for (const [index, file] of formData.images.entries()) {
        const fileExt = file.name.split('.').pop();
        const fileName = `watch-listings/${user!.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError, data } = await supabase.storage
          .from('listings')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('listings')
          .getPublicUrl(fileName);

        imageUrls.push(publicUrl);
        setUploadProgress(((index + 1) / formData.images.length) * 100);
      }

      // Create listing
      const { error: listingError } = await supabase
        .from('watch_listings')
        .insert({
          seller_id: user!.id,
          brand: formData.brand,
          model: formData.model,
          year: parseInt(formData.year),
          condition_rating: {
            'New': 10,
            'Like New': 9,
            'Good': 7,
            'Fair': 5
          }[formData.condition],
          price: parseFloat(formData.price),
          description: formData.description,
          location: 'Not specified',
          contact_preferences: [
            formData.contactEmail && 'email',
            formData.contactPhone && 'phone'
          ].filter(Boolean),
          images: imageUrls,
          status: 'active'
        });

      if (listingError) throw listingError;

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error creating listing:', err);
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to create listing. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-20 z-50">
      <div
        ref={modalRef}
        className="bg-primary-light w-full max-w-2xl mx-4 rounded-lg shadow-xl max-h-[80vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-dark flex items-center justify-between">
          <h2 className="text-2xl font-serif text-white">Create Listing</h2>
          <button
            onClick={onClose}
            className="text-gray-light hover:text-white transition"
            disabled={isSubmitting}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white mb-2">
                Brand <span className="text-secondary">*</span>
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                className="w-full px-4 py-2 bg-primary text-white border border-gray-dark rounded focus:border-secondary outline-none"
                placeholder="e.g., Rolex"
              />
              {errors.brand && (
                <p className="mt-1 text-red-500 text-sm">{errors.brand}</p>
              )}
            </div>

            <div>
              <label className="block text-white mb-2">
                Model <span className="text-secondary">*</span>
              </label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                className="w-full px-4 py-2 bg-primary text-white border border-gray-dark rounded focus:border-secondary outline-none"
                placeholder="e.g., Submariner"
              />
              {errors.model && (
                <p className="mt-1 text-red-500 text-sm">{errors.model}</p>
              )}
            </div>

            <div>
              <label className="block text-white mb-2">
                Condition <span className="text-secondary">*</span>
              </label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData(prev => ({ ...prev, condition: e.target.value as ListingFormData['condition'] }))}
                className="w-full px-4 py-2 bg-primary text-white border border-gray-dark rounded focus:border-secondary outline-none"
              >
                <option value="New">New</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </select>
            </div>

            <div>
              <label className="block text-white mb-2">
                Year <span className="text-secondary">*</span>
              </label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                className="w-full px-4 py-2 bg-primary text-white border border-gray-dark rounded focus:border-secondary outline-none"
                placeholder="Year of manufacture"
                min="1800"
                max={new Date().getFullYear()}
              />
              {errors.year && (
                <p className="mt-1 text-red-500 text-sm">{errors.year}</p>
              )}
            </div>

            <div>
              <label className="block text-white mb-2">
                Price (USD) <span className="text-secondary">*</span>
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                className="w-full px-4 py-2 bg-primary text-white border border-gray-dark rounded focus:border-secondary outline-none"
                placeholder="Enter price"
                min="0"
                step="0.01"
              />
              {errors.price && (
                <p className="mt-1 text-red-500 text-sm">{errors.price}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-white mb-2">
              Description <span className="text-secondary">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-2 bg-primary text-white border border-gray-dark rounded focus:border-secondary outline-none"
              rows={4}
              placeholder="Describe the watch's features, condition, and any other relevant details"
            />
            {errors.description && (
              <p className="mt-1 text-red-500 text-sm">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="block text-white mb-2">
              Contact Information <span className="text-secondary">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                  className="w-full px-4 py-2 bg-primary text-white border border-gray-dark rounded focus:border-secondary outline-none"
                  placeholder="Email address"
                />
                {errors.contactEmail && (
                  <p className="mt-1 text-red-500 text-sm">{errors.contactEmail}</p>
                )}
              </div>
              <div>
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                  className="w-full px-4 py-2 bg-primary text-white border border-gray-dark rounded focus:border-secondary outline-none"
                  placeholder="Phone number"
                />
                {errors.contactPhone && (
                  <p className="mt-1 text-red-500 text-sm">{errors.contactPhone}</p>
                )}
              </div>
            </div>
            {errors.contact && (
              <p className="mt-1 text-red-500 text-sm">{errors.contact}</p>
            )}
          </div>

          <div>
            <label className="block text-white mb-2">
              Images <span className="text-secondary">*</span>
            </label>
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {formData.images.map((file, index) => (
                  <div key={index} className="relative aspect-square">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Watch preview ${index + 1}`}
                      className="w-full h-full object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-red-500 rounded-full flex items-center justify-center transition"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ))}
                {formData.images.length < 5 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square border-2 border-dashed border-gray-dark hover:border-secondary rounded flex flex-col items-center justify-center gap-2 transition"
                  >
                    <Upload className="w-6 h-6 text-gray-light" />
                    <span className="text-sm text-gray-light">Add Image</span>
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                multiple
                className="hidden"
              />
              <p className="text-sm text-gray-light">
                Upload up to 5 high-quality images (JPEG, PNG, or WebP, max 5MB each)
              </p>
              {errors.images && (
                <p className="text-red-500 text-sm">{errors.images}</p>
              )}
            </div>
          </div>

          {errors.submit && (
            <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg flex items-center gap-2 text-red-500">
              <AlertCircle className="w-5 h-5" />
              <p>{errors.submit}</p>
            </div>
          )}

          {uploadProgress > 0 && (
            <div className="space-y-2">
              <div className="h-2 bg-primary rounded overflow-hidden">
                <div
                  className="h-full bg-secondary transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-light text-center">
                Uploading images... {Math.round(uploadProgress)}%
              </p>
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 border border-gray-dark hover:border-secondary text-white px-6 py-3 rounded font-semibold transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-secondary hover:bg-secondary-light text-primary px-6 py-3 rounded font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Listing...
                </>
              ) : (
                'Create Listing'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateListingModal;