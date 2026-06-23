import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Save, Loader2, Globe, Users, TrendingUp, Upload, Image as ImageIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { charitiesApi } from '../../features/charities/charitiesApi';
import { formatCurrency } from '../../utils/formatters';
import type { Charity } from '../../types';

const schema = z.object({
  name: z.string().min(2, 'Required'),
  description: z.string().min(10, 'Min 10 characters'),
  short_bio: z.string().optional(),
  website_url: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  category: z.enum(['education', 'health', 'environment', 'community', 'sports', 'other']),
  is_featured: z.boolean().optional(),
});
type Form = z.infer<typeof schema>;

const CAT_COLORS: Record<string, string> = {
  environment: 'badge-success', education: 'badge-blue', health: 'badge-danger',
  community: 'badge-brand', sports: 'badge-gold', other: 'badge-warning',
};

export default function AdminCharities() {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Charity | null>(null);
  
  // Media State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const qc = useQueryClient();

  const { data: res, isLoading } = useQuery({
    queryKey: ['charities-admin'],
    queryFn: () => charitiesApi.getAll({ limit: 50 }),
  });
  const charities = res?.data ?? [];

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { category: 'other', is_featured: false },
  });

  const createMut = useMutation({
    mutationFn: charitiesApi.create,
    onSuccess: (res) => {
      toast.success('Charity created!');
      qc.invalidateQueries({ queryKey: ['charities-admin'] });
      if (selectedFile && res.data) {
        uploadMediaMut.mutate({ id: res.data.id, file: selectedFile });
      } else {
        closeForm();
      }
    },
    onError: (e: any) => toast.error(e.response?.data?.message ?? 'Failed to create charity'),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Form> }) => charitiesApi.update(id, data),
    onSuccess: (_, vars) => {
      toast.success('Charity updated!');
      qc.invalidateQueries({ queryKey: ['charities-admin'] });
      if (selectedFile) {
        uploadMediaMut.mutate({ id: vars.id, file: selectedFile });
      } else {
        closeForm();
      }
    },
    onError: (e: any) => toast.error(e.response?.data?.message ?? 'Failed to update charity'),
  });

  const deleteMut = useMutation({
    mutationFn: charitiesApi.remove,
    onSuccess: () => { toast.success('Charity removed'); qc.invalidateQueries({ queryKey: ['charities-admin'] }); },
    onError: () => toast.error('Delete failed'),
  });

  const uploadMediaMut = useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) => charitiesApi.uploadMedia(id, file),
    onSuccess: () => {
      toast.success('Media uploaded successfully!');
      qc.invalidateQueries({ queryKey: ['charities-admin'] });
      closeForm();
    },
    onError: (e: any) => toast.error(e.response?.data?.message ?? 'Media upload failed'),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const onSubmit = (data: Form) => {
    if (editing) updateMut.mutate({ id: editing.id, data });
    else createMut.mutate(data as any);
  };

  const startEdit = (c: Charity) => {
    setEditing(c);
    setValue('name', c.name);
    setValue('description', c.description);
    setValue('short_bio', c.short_bio ?? '');
    setValue('website_url', c.website_url ?? '');
    setValue('category', c.category as any);
    setValue('is_featured', c.is_featured);
    setSelectedFile(null);
    setPreviewUrl(null);
    setShowForm(true);
  };

  const closeForm = () => { 
    setShowForm(false); 
    setEditing(null); 
    setSelectedFile(null);
    setPreviewUrl(null);
    reset(); 
  };
  
  const isSubmitting = createMut.isPending || updateMut.isPending || uploadMediaMut.isPending;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-ink">Charities</h1>
          <p className="text-ink-muted text-sm mt-1">{charities.length} partner charities</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="btn-primary btn-md">
            <Plus className="w-4 h-4" /> Add Charity
          </button>
        )}
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-6">
            <div className="card border-2 border-brand/30">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-ink">{editing ? 'Edit Charity' : 'New Charity'}</h3>
                <button onClick={closeForm} className="p-1.5 rounded-lg hover:bg-surface"><X className="w-4 h-4 text-ink-muted" /></button>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="label">Charity Name</label>
                    <input {...register('name')} className={`input ${errors.name ? 'input-error' : ''}`} placeholder="Green Earth Foundation" />
                    {errors.name && <p className="form-error">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="label">Category</label>
                    <select {...register('category')} className="input">
                      {['education','health','environment','community','sports','other'].map(c => (
                        <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label">Short Bio <span className="text-ink-muted font-normal">(optional)</span></label>
                    <input {...register('short_bio')} className="input" placeholder="One-line tagline..." />
                  </div>
                  <div>
                    <label className="label">Website URL <span className="text-ink-muted font-normal">(optional)</span></label>
                    <input {...register('website_url')} type="url" className={`input ${errors.website_url ? 'input-error' : ''}`} placeholder="https://..." />
                    {errors.website_url && <p className="form-error">{errors.website_url.message}</p>}
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <input {...register('is_featured')} type="checkbox" id="featured" className="w-4 h-4 accent-brand" />
                    <label htmlFor="featured" className="text-sm text-ink cursor-pointer font-medium">Mark as Featured Charity</label>
                  </div>
                </div>

                {/* Right Column: Desc + Media Upload */}
                <div className="space-y-4 flex flex-col">
                  <div className="flex-1">
                    <label className="label">Full Description</label>
                    <textarea {...register('description')} rows={5} className={`input resize-none h-[120px] ${errors.description ? 'input-error' : ''}`} placeholder="Full description..." />
                    {errors.description && <p className="form-error">{errors.description.message}</p>}
                  </div>

                  <div>
                    <label className="label">Charity Image / Logo</label>
                    <div className="border-2 border-dashed border-border rounded-xl p-4 text-center hover:bg-surface transition-colors">
                      {(previewUrl || editing?.image_url) ? (
                        <div className="relative group rounded-lg overflow-hidden h-32 w-full max-w-[200px] mx-auto bg-surface flex items-center justify-center">
                          <img 
                            src={previewUrl || editing?.image_url || undefined} 
                            alt="Preview" 
                            className="max-h-full object-contain"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button type="button" onClick={() => fileInputRef.current?.click()} className="btn-secondary btn-sm">
                              Change Image
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="py-4">
                          <ImageIcon className="w-8 h-8 text-border mx-auto mb-2" />
                          <button type="button" onClick={() => fileInputRef.current?.click()} className="btn-secondary btn-sm mx-auto">
                            <Upload className="w-4 h-4 mr-1" /> Browse Image
                          </button>
                          <p className="text-xs text-ink-muted mt-2">JPG, PNG, WebP up to 5MB</p>
                        </div>
                      )}
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/jpeg,image/png,image/webp" 
                        onChange={handleFileChange} 
                      />
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="md:col-span-2 flex gap-3 pt-4 border-t border-border">
                  <button type="submit" disabled={isSubmitting} className="btn-primary btn-md flex-1 md:flex-none">
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
                    {uploadMediaMut.isPending ? 'Uploading Media...' : (editing ? 'Save Charity' : 'Create Charity')}
                  </button>
                  <button type="button" onClick={closeForm} disabled={isSubmitting} className="btn-ghost btn-md">Cancel</button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Charity Cards */}
      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-brand" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {charities.map((charity, i) => (
            <motion.div key={charity.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="card hover:shadow-elevated transition-all duration-200">
              <div className="flex items-start gap-4 mb-3">
                <div className="w-12 h-12 rounded-lg bg-surface flex items-center justify-center flex-shrink-0 overflow-hidden border border-border">
                  {charity.image_url ? (
                    <img src={charity.image_url} alt={charity.name} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-5 h-5 text-border" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`badge ${CAT_COLORS[charity.category]} capitalize text-[10px]`}>{charity.category}</span>
                    {charity.is_featured && <span className="badge badge-gold text-[10px]">⭐ Featured</span>}
                    {!charity.is_active && <span className="badge badge-danger text-[10px]">Inactive</span>}
                  </div>
                  <h3 className="font-bold text-ink truncate">{charity.name}</h3>
                </div>
              </div>
              
              <p className="text-xs text-ink-muted mb-4 line-clamp-2">{charity.short_bio || charity.description}</p>
              
              <div className="flex items-center justify-between text-xs text-ink-muted mb-4 pt-3 border-t border-border">
                <span className="flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5 text-brand" />{formatCurrency(charity.total_raised)}</span>
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{charity.donor_count.toLocaleString()}</span>
                {charity.website_url && (
                  <a href={charity.website_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-brand hover:underline">
                    <Globe className="w-3.5 h-3.5" /> Site
                  </a>
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(charity)} className="btn-secondary btn-sm flex-1 text-xs">
                  <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit
                </button>
                <button
                  onClick={() => { if (confirm('Remove this charity?')) deleteMut.mutate(charity.id); }}
                  className="btn-danger btn-sm text-xs px-3"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
