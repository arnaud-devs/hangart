// "use client";

// import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { z } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';

// const schema = z.object({
//   title: z.string().min(1, 'Title is required'),
//   description: z.string().optional(),
//   category: z.string().optional(),
//   // Accept empty string or number input; result is optional number >= 0
//   price: z.preprocess((v) => {
//     if (typeof v === 'string') {
//       const s = v.trim();
//       return s === '' ? undefined : Number(s);
//     }
//     if (typeof v === 'number') return v;
//     return undefined;
//   }, z.number().min(0).optional()),
//   currency: z.string().optional(),
//   is_available: z.boolean(),
//   images: z.unknown().optional(), // handled separately as FileList
// });

// type ParsedSchema = z.infer<typeof schema>;
// type FormValues = ParsedSchema & { images: FileList | null };

// export default function UploadArtForm() {
//   const [previews, setPreviews] = useState<string[]>([]);
//   const [submitting, setSubmitting] = useState(false);

//   const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormValues>({
//     resolver: zodResolver(schema),
//     defaultValues: { 
//       images: null,
//       is_available: true 
//     },
//   });

//   const onFiles = (files?: FileList | null) => {
//     if (!files) return;
//     const arr = Array.from(files);
//     const urls = arr.map((f) => URL.createObjectURL(f));
//     setPreviews(urls);
//     // react-hook-form typing is conservative; cast to any for FileList
//     setValue('images' as any, files as any, { shouldValidate: true });
//   };

//   const onSubmit = async (data: FormValues) => {
//     if (!data.images || data.images.length === 0) {
//       alert('Please add at least one image');
//       return;
//     }
//     setSubmitting(true);
//     try {
//       const fd = new FormData();
//       fd.append('title', data.title);
//       if (data.description) fd.append('description', data.description);
//       if (data.category) fd.append('category', data.category);
//       if (data.price !== undefined) fd.append('price', String(data.price));
//       if (data.currency) fd.append('currency', data.currency);
//       fd.append('is_available', String(data.is_available));
//       Array.from(data.images).forEach((f) => fd.append('images', f));

//       const res = await fetch('/api/artist/upload', { method: 'POST', body: fd });
//       const json = await res.json();
//       console.log('upload result', json);
//       alert('Upload submitted (stub)');
//     } catch (e) {
//       console.error(e);
//       alert('Upload failed');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // Revoke object URLs when previews change or component unmounts
//   React.useEffect(() => {
//     return () => {
//       previews.forEach((p) => URL.revokeObjectURL(p));
//     };
//   }, [previews]);

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//       <div>
//         <label className="block text-sm font-medium">Title</label>
//         <input {...register('title')} className="mt-1 block w-full rounded-md border px-3 py-2" />
//         {errors.title && <p className="text-sm text-red-600">{String(errors.title.message)}</p>}
//       </div>

//       <div>
//         <label className="block text-sm font-medium">Description</label>
//         <textarea {...register('description')} className="mt-1 block w-full rounded-md border px-3 py-2" />
//       </div>

//       <div className="grid grid-cols-2 gap-3">
//         <div>
//           <label className="block text-sm font-medium">Category</label>
//           <input {...register('category')} className="mt-1 block w-full rounded-md border px-3 py-2" />
//         </div>
//         <div>
//           <label className="block text-sm font-medium">Price</label>
//           <input type="number" step="0.01" {...register('price' as any)} className="mt-1 block w-full rounded-md border px-3 py-2" />
//         </div>
//       </div>

//       <div>
//         <label className="block text-sm font-medium">Currency</label>
//         <input {...register('currency')} className="mt-1 block w-full rounded-md border px-3 py-2" />
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Availability</label>
//         <div className="flex items-center gap-6">
//           <label className="flex items-center gap-2 cursor-pointer">
//             <input
//               type="radio"
//               value="true"
//               {...register('is_available', {
//                 setValueAs: (v) => v === 'true'
//               })}
//               className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
//             />
//             <span className="text-sm text-gray-700 dark:text-gray-300">Available</span>
//           </label>
//           <label className="flex items-center gap-2 cursor-pointer">
//             <input
//               type="radio"
//               value="false"
//               {...register('is_available', {
//                 setValueAs: (v) => v === 'true'
//               })}
//               className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
//             />
//             <span className="text-sm text-gray-700 dark:text-gray-300">Not Available</span>
//           </label>
//         </div>
//         {errors.is_available && <p className="text-sm text-red-600 mt-1">{String(errors.is_available.message)}</p>}
//       </div>

//       <div>
//         <label className="block text-sm font-medium">Images</label>
//         <input
//           type="file"
//           multiple
//           accept="image/*"
//           onChange={(e) => onFiles(e.target.files)}
//           className="mt-1 block w-full"
//         />
//         {previews.length > 0 && (
//           <div className="mt-2 flex gap-2">
//             {previews.map((p) => (
//               // eslint-disable-next-line @next/next/no-img-element
//               <img key={p} src={p} alt="preview" className="w-24 h-24 object-cover rounded-md" />
//             ))}
//           </div>
//         )}
//       </div>

//       <div>
//         <button type="submit" disabled={submitting} className="rounded-md bg-indigo-600 text-[#DFDFD6] px-4 py-2">
//           {submitting ? 'Uploading...' : 'Upload artwork'}
//         </button>
//       </div>
//     </form>
//   );
// }
