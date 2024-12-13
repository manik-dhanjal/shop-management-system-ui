import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { IoClose } from "react-icons/io5";
import TextBox from "@components/text-box.component";
import Button from "@components/button.component";

interface FeaturedImage {
  file: File;
  altText: string;
}

const FeaturedImageUpload: React.FC = () => {
  const [image, setImage] = useState<FeaturedImage | null>(null);

  // Handle image selection
  const handleImageChange = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setImage({
        file,
        altText: "", // Initial empty alt text
      });
    }
  };

  // Handle alt text change
  const handleTextAreaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (image) {
      setImage({
        ...image,
        altText: e.target.value,
      });
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => handleImageChange(acceptedFiles),
    accept: { "image/*": [] },
    multiple: false, // Only allow one file
  });

  return (
    <div className="max-w-xs mx-auto space-y-6">
      {/* Drag-and-Drop Area */}
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500 cursor-pointer hover:border-blue-500 transition-all"
      >
        {image ? (
          <div className="relative w-full">
            {/* Image Preview */}
            <img
              src={URL.createObjectURL(image.file)}
              alt={image.altText || "Featured Image"}
              className=" w-full rounded-md"
            />
            <button
              onClick={() => setImage(null)}
              className="absolute top-2 right-2 text-white bg-red-600 hover:bg-red-700 rounded-full w-6 h-6 flex justify-center items-center z-10"
            >
              <IoClose className="text-xl" />
            </button>
          </div>
        ) : (
          <div className="flex justify-center items-center h-60 p-4">
            <input {...getInputProps()} />
            <p className="text-sm">Drag & drop or click to select an image</p>
          </div>
        )}
      </div>

      {/* Alt Text Input */}
      {image && (
        <TextBox
          label="Alt Text"
          name="alt-text"
          className="mb-5"
          value={image.altText}
          onChange={handleTextAreaChange}
        />
        // <div>
        //   <label className="block text-sm font-medium text-gray-700">
        //     Alt Text
        //   </label>
        //   <input
        //     type="text"
        //     value={image.altText}
        //     onChange={(e) => handleAltTextChange(e.target.value)}
        //     placeholder="Enter alt text"
        //     className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
        //   />
        // </div>
      )}

      {/* Submit Button */}
      <Button type="submit" disabled={!image} className="w-full">
        {image ? "Save Featured Image" : "No Image Selected"}
      </Button>
      <button
        type="button"
        disabled={!image}
        className={`w-full py-2 text-sm rounded-md ${
          image
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        {image ? "Save Featured Image" : "No Image Selected"}
      </button>
    </div>
  );
};

export default FeaturedImageUpload;
