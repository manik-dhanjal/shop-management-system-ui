import React, { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import { Image } from "@/shared/interfaces/image.interface";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IoClose } from "react-icons/io5";
import Button from "@/shared/components/button.component";
import ImageUploadWithAltText from "./image-upload.component";

// Modal Component
const Modal = ({
  imageSrc,
  imageAlt,
  onClose,
}: {
  imageSrc: string;
  imageAlt: string;
  onClose: () => void;
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white bg-black rounded-full p-2 hover:bg-gray-800"
        >
          <IoClose className="text-3xl" />
        </button>
        <img
          src={imageSrc}
          alt={imageAlt}
          className="max-w-full max-h-screen object-contain rounded-lg"
        />
      </div>
    </div>
  );
};

export interface ProductImagesTypes {
  images: Image[];
  className?: string; // Made className optional in case it's not passed
}

const ProductImages = ({ images, className }: ProductImagesTypes) => {
  const [nav1, setNav1] = useState<Slider>();
  const [nav2, setNav2] = useState<Slider>();
  const [modalOpen, setModalOpen] = useState(false); // Modal state
  const [modalImage, setModalImage] = useState<{
    src: string;
    alt: string;
  } | null>(null); // Modal image state

  // Define refs properly with the correct type.
  const sliderRef1 = useRef<Slider>(null);
  const sliderRef2 = useRef<Slider>(null);

  useEffect(() => {
    if (sliderRef1.current && sliderRef2.current) {
      setNav1(sliderRef1.current);
      setNav2(sliderRef2.current);
    }
  }, [sliderRef1, sliderRef2]);

  if (images.length === 0)
    return (
      <div>
        <ImageUploadWithAltText />
      </div>
    );

  const openModal = (imageSrc: string, imageAlt: string) => {
    setModalImage({ src: imageSrc, alt: imageAlt });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalImage(null);
  };

  const sliderSettings = {
    slidesToShow: 4,
    swipeToSlide: true,
    focusOnSelect: images.length > 4,
    arrows: images.length >= 5, // Only show arrows if there are 4 or more images
    infinite: false,
  };

  return (
    <div className={`slider-container ${className}`}>
      <h2 className="text-xl text-gray-600 mb-4">Featured Images</h2>
      {/* Main Image Slider */}
      <Slider
        asNavFor={nav2}
        ref={sliderRef1}
        slidesToShow={1}
        slidesToScroll={1}
        fade={true}
        className="mb-1"
      >
        {images.map((image, index) => (
          <div
            key={image.alt + index}
            className="w-full"
            onClick={() => openModal(image.src, image.alt)}
          >
            {/* Image container with fixed height and centered image */}
            <div className="flex justify-center items-center h-56 cursor-pointer bg-slate-100 rounded-lg overflow-hidden">
              <img
                src={image.src}
                alt={image.alt}
                className="max-h-full w-auto object-contain"
              />
            </div>
          </div>
        ))}
      </Slider>

      {/* Thumbnail Navigation Slider */}
      <Slider
        asNavFor={nav1}
        ref={sliderRef2}
        {...sliderSettings}
        className="thumbnail-slider"
      >
        {images.map((image, index) => (
          <div
            key={image.alt + index}
            className="p-1 cursor-pointer hover:scale-105 transition-transform duration-300"
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-16 object-cover rounded-lg shadow-md"
            />
          </div>
        ))}
      </Slider>

      <Button className="w-full mt-2">Upload Image</Button>
      {/* Modal for showing image in large view */}
      {modalOpen && modalImage && (
        <Modal
          imageSrc={modalImage.src}
          imageAlt={modalImage.alt}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default ProductImages;
