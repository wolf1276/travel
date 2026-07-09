'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { LocationAutocomplete } from '@/features/places/components/LocationAutocomplete';
import { CoverImageUpload } from '@/features/places/components/CoverImageUpload';
import { TagsInput } from '@/features/places/components/TagsInput';
import { placeSchema, type PlaceFormInput } from '@/lib/validations/place.schema';
import { useCreatePlace } from '@/hooks/useCreatePlace';
import { useUpdatePlace } from '@/hooks/useUpdatePlace';
import type { PlaceDetail } from '@/types/place';

export function AddPlaceForm({ place, userId }: { place?: PlaceDetail; userId: string }) {
  const router = useRouter();
  const isEditing = Boolean(place);
  const createPlace = useCreatePlace();
  const updatePlace = useUpdatePlace(place?.id ?? '');
  const [manualEntry, setManualEntry] = useState(false);

  const form = useForm<PlaceFormInput>({
    resolver: zodResolver(placeSchema),
    defaultValues: {
      name: place?.name ?? '',
      address: place?.address ?? null,
      country: place?.country ?? null,
      countryCode: place?.countryCode ?? null,
      placeProviderId: null,
      latitude: place?.latitude ?? null,
      longitude: place?.longitude ?? null,
      coverImageUrl: place?.coverImageUrl ?? null,
      coverImagePath: null,
      dreamNotes: place?.dreamNotes ?? '',
      personalReason: place?.personalReason ?? '',
      tags: place?.tags.map((tag) => tag.name) ?? [],
    },
  });

  const isSubmitting = createPlace.isPending || updatePlace.isPending;
  const address = form.watch('address');

  async function onSubmit(values: PlaceFormInput) {
    try {
      if (isEditing && place) {
        await updatePlace.mutateAsync(values);
        toast.success('Place updated');
        router.push(`/places/${place.id}`);
      } else {
        const created = await createPlace.mutateAsync(values);
        toast.success('Added to your places');
        router.push(`/places/${created.id}`);
      }
      router.refresh();
    } catch {
      toast.error('Something went wrong.', {
        action: { label: 'Retry', onClick: () => void onSubmit(values) },
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-2">
          <Label htmlFor="location-search">📍 Place</Label>
          {!manualEntry ? (
            <>
              <LocationAutocomplete
                id="location-search"
                defaultQuery={place?.name ?? ''}
                onSelect={(result) => {
                  form.setValue('name', result.name, { shouldValidate: true });
                  form.setValue('address', result.address);
                  form.setValue('country', result.country);
                  form.setValue('countryCode', result.countryCode);
                  form.setValue('latitude', result.latitude);
                  form.setValue('longitude', result.longitude);
                  form.setValue('placeProviderId', result.placeProviderId);
                }}
              />
              {address && <p className="text-xs text-muted-foreground">{address}</p>}
              {form.formState.errors.name && (
                <p className="text-[0.8rem] font-medium text-destructive">
                  {form.formState.errors.name.message}
                </p>
              )}
            </>
          ) : (
            <div className="space-y-3 rounded-2xl border border-border/70 bg-card/40 p-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Place name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Blue Bottle Coffee" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Optional" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          <button
            type="button"
            onClick={() => setManualEntry((current) => !current)}
            className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
          >
            {manualEntry ? 'Search instead' : "Can't find it? Enter it manually"}
          </button>
        </div>

        <FormField
          control={form.control}
          name="personalReason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>❤️ Why do you want to go here?</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Let's watch the sunset here together."
                  rows={3}
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormDescription>Optional.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dreamNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>📝 Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Anything else worth remembering" rows={3} {...field} value={field.value ?? ''} />
              </FormControl>
              <FormDescription>Optional.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="coverImageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>📷 Cover image</FormLabel>
              <FormControl>
                <CoverImageUpload
                  value={
                    field.value
                      ? { url: field.value, path: form.getValues('coverImagePath') ?? '' }
                      : null
                  }
                  folder={`${userId}/places/${place?.id ?? 'new'}`}
                  onChange={(image) => {
                    field.onChange(image?.url ?? null);
                    form.setValue('coverImagePath', image?.path ?? null);
                  }}
                />
              </FormControl>
              <FormDescription>Optional.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {isEditing && (
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <TagsInput value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isEditing ? 'Save changes' : 'Add place'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
