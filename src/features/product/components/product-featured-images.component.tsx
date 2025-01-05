import { Image } from '@shared/interfaces/image.interface';
import SidebarImageUpload, {
	LocalImageBlob,
} from './sidebar-image-upload.component';
import SidebarViewImages from './sidebar-view-images.component';
import { useState } from 'react';
import { uploadImage } from '@shared/api/media-storage.api';
import { AxiosError } from 'axios';
import { useAuth } from '@shared/hooks/auth.hooks';

const ProductFeaturedImages = ({
	images = [],
	onChange,
}: {
	images: Image[];
	onChange: (img: Image[]) => void;
}) => {
	const [isUploadEnabled, setIsUploadEnabled] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);
	const { activeShop } = useAuth();
	const handleImageSave = async (newImageBlob: LocalImageBlob) => {
		console.log(newImageBlob);
		// do IO operation for uploading image in S3 or somewhere else
		// add the recieved image url in image records
		if (!activeShop) return;
		setIsUploading(true);
		try {
			setErrorMsg(null);
			const uploadedImage = await uploadImage(activeShop._id, newImageBlob);
			const updatedImages = [...images, uploadedImage];
			onChange(updatedImages);
			setIsUploadEnabled(false);
		} catch (error) {
			if (error instanceof AxiosError) {
				setErrorMsg(error.response?.data?.message);
			} else if (error instanceof Error) {
				setErrorMsg(error.message);
			} else {
				setErrorMsg('Unkown error occured while uploading image');
			}
		} finally {
			setIsUploading(false);
		}
	};

	const handleImageDelete = (imageId: string) => {
		const updatedImages = images.filter((image) => imageId != image._id);
		onChange(updatedImages);
	};

	return (
		<div>
			<h2 className="mb-3">
				<span
					onClick={() => setIsUploadEnabled(false)}
					className={`cursor-pointer ${
						!isUploadEnabled
							? 'dark:text-gray-300 text-slate-500'
							: 'dark:text-slate-500 text-gray-300'
					}`}
				>
					Featured Images
				</span>
				<span
					onClick={() => setIsUploadEnabled(true)}
					className={`ml-3 cursor-pointer ${
						isUploadEnabled
							? 'dark:text-gray-300 text-slate-500'
							: 'dark:text-slate-500 text-gray-300'
					}`}
				>
					Upload Image
				</span>
			</h2>
			{images.length === 0 || isUploadEnabled ? (
				<>
					<SidebarImageUpload onSave={handleImageSave} />
					{isUploading && <p>Uploading</p>}
					{errorMsg && <p>{errorMsg}</p>}
				</>
			) : (
				<SidebarViewImages images={images} onDelete={handleImageDelete} />
			)}
		</div>
	);
};

export default ProductFeaturedImages;
