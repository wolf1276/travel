'use client';

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

  const form = useForm<PlaceFormInput>({
    resolver: zodResolver(placeSchema),
    defaultValues: {
      city: place?.city ?? '',
      country: place?.country ?? '',
      countryCode: place?.countryCode ?? null,
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

  async function onSubmit(values: PlaceFormInput) {
    try {
      if (isEditing && place) {
        await updatePlace.mutateAsync(values);
        toast.success('Place updated');
        router.push(`/places/${place.id}`);
      } else {
        const created = await createPlace.mutateAsync(values);
        toast.success('Added to your dream list');
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
        <FormField
          control={form.control}
          name="coverImageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover image</FormLabel>
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
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <Label htmlFor="location-search">Search for a place</Label>
          <LocationAutocomplete
            id="location-search"
            defaultQuery={place ? `${place.city}, ${place.country}` : ''}
            onSelect={(result) => {
              form.setValue('city', result.city, { shouldValidate: true });
              form.setValue('country', result.country, { shouldValidate: true });
              form.setValue('countryCode', result.countryCode);
              form.setValue('latitude', result.latitude);
              form.setValue('longitude', result.longitude);
            }}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="Kyoto" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder="Japan" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="dreamNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dream notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="What do you imagine this place will be like?"
                  rows={4}
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="personalReason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Why this place?</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A personal reason this is on your list"
                  rows={3}
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormDescription>Optional — the story behind the dream.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isEditing ? 'Save changes' : 'Add to dream list'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
