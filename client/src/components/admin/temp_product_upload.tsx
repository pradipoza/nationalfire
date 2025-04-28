// File Upload section for ProductManager.tsx
// To be inserted in the FormField for photos

<FormField
  control={form.control}
  name="photos"
  render={() => (
    <FormItem>
      <FormLabel>Photos</FormLabel>
      <div className="space-y-3">
        {/* File Upload */}
        <div className="border rounded-lg p-4 mb-4">
          <FormLabel className="block mb-2">Upload Image</FormLabel>
          <Input 
            type="file" 
            accept="image/*"
            disabled={isUploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setIsUploading(true);
                
                // Read file as data URL to show preview
                const reader = new FileReader();
                reader.onload = (e) => {
                  const dataUrl = e.target?.result as string;
                  
                  // Add to photo URLs
                  const updatedPhotos = [...photoUrls, dataUrl];
                  setPhotoUrls(updatedPhotos);
                  form.setValue("photos", updatedPhotos, { shouldValidate: true });
                  setIsUploading(false);
                };
                reader.readAsDataURL(file);
              }
            }}
          />
          <FormDescription className="mt-2 text-xs">
            Upload an image file (JPG, PNG) directly from your computer
          </FormDescription>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-background px-2 text-muted-foreground">or use a URL</span>
          </div>
        </div>
        
        {/* Photo URL input */}
        <div className="flex space-x-2 mt-4">
          <Input
            placeholder="Enter photo URL"
            value={newPhotoUrl}
            onChange={(e) => setNewPhotoUrl(e.target.value)}
            disabled={isUploading}
          />
          <Button
            type="button"
            onClick={addPhotoUrl}
            variant="secondary"
            disabled={isUploading}
          >
            Add
          </Button>
        </div>

        {/* Photo list */}
        {photoUrls.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            {photoUrls.map((url, index) => (
              <div
                key={index}
                className="border rounded-md p-3 flex items-center space-x-3"
              >
                <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded">
                  <img
                    src={url}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/150?text=Error";
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{url}</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removePhotoUrl(index)}
                  className="h-8 w-8 rounded-full p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 border rounded-md border-dashed">
            <ImageIcon className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">No photos added yet</p>
          </div>
        )}
      </div>
      <FormMessage />
    </FormItem>
  )}
/>