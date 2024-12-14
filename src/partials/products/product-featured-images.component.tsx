import { Image } from "@shared/interfaces/image.interface";
import SidebarImageUpload, {
  ImageBlob,
} from "./sidebar-image-upload.component";
import SidebarViewImages from "./sidebar-view-images.component";
import { useState } from "react";

const ProductFeaturedImages = ({
  images = [],
  onChange,
}: {
  images: Image[];
  onChange: (img: Image[]) => void;
}) => {
  const [isUploadEnabled, setIsUploadEnabled] = useState(false);
  const handleImageSave = (newImageBlob: ImageBlob) => {
    console.log(newImageBlob);
    // do IO operation for uploading image in S3 or somewhere else
    // add the recieved image url in image records
    const uploadedImage = {
      src: "extracted-url.com",
      alt: newImageBlob.altText,
    };
    const updatedImages = [...images, uploadedImage];
    onChange(updatedImages);
  };

  const handleImageDelete = (imageIndex: number) => {
    console.log("image deleted", images[imageIndex]);
  };

  return (
    <div>
      <h2 className="mb-3">
        <span
          onClick={() => setIsUploadEnabled(false)}
          className={`cursor-pointer ${
            !isUploadEnabled ? "text-gray-300" : "text-slate-500"
          }`}
        >
          Featured Images
        </span>
        <span
          onClick={() => setIsUploadEnabled(true)}
          className={`ml-3 cursor-pointer ${
            isUploadEnabled ? "text-gray-300" : "text-slate-500"
          }`}
        >
          Upload Image
        </span>
      </h2>
      {images.length === 0 || isUploadEnabled ? (
        <SidebarImageUpload onSave={handleImageSave} />
      ) : (
        <SidebarViewImages images={images} onDelete={handleImageDelete} />
      )}
    </div>
  );
};

export default ProductFeaturedImages;
