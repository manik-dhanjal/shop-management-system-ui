import { useState, useEffect, useRef, RefObject } from 'react';
import Slider from 'react-slick';
import { Image } from '@/shared/interfaces/image.interface';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { IoClose, IoTrash } from 'react-icons/io5';

// Modal Component
const Modal = ({
	imageSrc,
	imageAlt,
	onClose,
}: {
	imageSrc: string;
	imageAlt?: string;
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
	onDelete?: (imageIndex: string) => void;
	className?: string; // Made className optional in case it's not passed
}

const SidebarViewImages = ({
	images,
	className,
	onDelete,
}: ProductImagesTypes) => {
	const [nav1, setNav1] = useState<RefObject<null>>();
	const [nav2, setNav2] = useState<RefObject<null>>();
	const [modalOpen, setModalOpen] = useState(false); // Modal state
	const [modalImage, setModalImage] = useState<{
		src: string;
		alt?: string;
	} | null>(null); // Modal image state

	// Define refs properly with the correct type.
	let sliderRef1 = useRef(null);
	let sliderRef2 = useRef(null);

	useEffect(() => {
		setNav1(sliderRef1);
		setNav2(sliderRef2);
	}, []);

	const openModal = (imageSrc: string, imageAlt?: string) => {
		setModalImage({ src: imageSrc, alt: imageAlt });
		setModalOpen(true);
	};

	const closeModal = () => {
		setModalOpen(false);
		setModalImage(null);
	};
	const sliderSettings1 = {};

	const sliderSettings2 = {
		slidesToShow: 3,
		swipeToSlide: true,
		focusOnSelect: true,
		// arrows: images.length >= 5, // Only show arrows if there are 4 or more images
		arrows: false,
		infinite: false,
	};

	return (
		<div className={`slider-container ${className}`}>
			{/* Main Image Slider */}
			<Slider
				asNavFor={nav2 as never}
				ref={(slider) => (sliderRef1 = slider as never)}
				fade={true}
				className="mb-1"
				{...sliderSettings1}
			>
				{images.map((image, index) => (
					<div
						key={image._id + index}
						className="w-full"
						onClick={() => openModal(image.url, image.alt)}
					>
						{/* Image container with fixed height and centered image */}
						<div className="flex justify-center items-center h-60 cursor-pointer bg-white dark:bg-gray-800 rounded-lg overflow-hidden relative">
							{onDelete && (
								<button
									onClick={() => onDelete(image._id)}
									className="absolute top-2 right-2 text-white bg-red-600 hover:bg-red-700 rounded-full w-8 h-8 flex justify-center items-center z-100"
								>
									<IoTrash className="text-xl" />
								</button>
							)}
							<img
								src={image.url}
								alt={image.alt}
								className="max-h-full w-auto object-contain"
							/>
							<div className="absolute bottom-1 right-2 text-sm">
								{index + 1 + ' / ' + images.length}
							</div>
						</div>
					</div>
				))}
			</Slider>
			{/* Thumbnail Navigation Slider */}
			<Slider
				asNavFor={nav1 as never}
				ref={(slider) => (sliderRef2 = slider as never)}
				{...sliderSettings2}
				className="thumbnail-slider"
			>
				{images.map((image, index) => (
					<div
						key={image._id + index}
						className="p-1 cursor-pointer hover:scale-105 transition-transform duration-300 outline-none"
					>
						<img
							src={image.url}
							alt={image.alt}
							className="w-full h-16 object-cover rounded-lg shadow-md outline-none"
						/>
					</div>
				))}
			</Slider>
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

export default SidebarViewImages;
