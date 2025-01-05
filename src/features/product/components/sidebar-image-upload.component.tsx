import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { IoClose } from 'react-icons/io5';
import TextBox from '@shared/components/form/text-box.component';
import Button from '@shared/components/form/button.component';

export interface LocalImageBlob {
	file: File;
	alt: string;
}

const SidebarImageUpload = ({
	onSave,
}: {
	onSave: (img: LocalImageBlob) => void;
}) => {
	const [image, setImage] = useState<LocalImageBlob | null>(null);

	// Handle image selection
	const handleImageChange = (acceptedFiles: File[]) => {
		if (acceptedFiles.length > 0) {
			const file = acceptedFiles[0];
			setImage({
				file,
				alt: '', // Initial empty alt text
			});
		}
	};

	// Handle alt text change
	const handleTextAreaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (image) {
			setImage({
				...image,
				alt: e.target.value,
			});
		}
	};

	const { getRootProps, getInputProps } = useDropzone({
		onDrop: (acceptedFiles) => handleImageChange(acceptedFiles),
		accept: { 'image/*': [] },
		multiple: false, // Only allow one file
	});

	const handleSave = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		if (!image) return;
		onSave(image);
	};

	return (
		<div className="max-w-xs mx-auto space-y-6">
			{/* Drag-and-Drop Area */}
			<div
				{...getRootProps()}
				className="border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500 cursor-pointer hover:border-violet-400 transition-all"
			>
				{image ? (
					<div className="relative w-full">
						{/* Image Preview */}
						<img
							src={URL.createObjectURL(image.file)}
							alt={image.alt || 'Featured Image'}
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
					className="mb-2"
					value={image.alt}
					onChange={handleTextAreaChange}
				/>
			)}
			{/* Submit Button */}
			<Button
				type="button"
				disabled={!image}
				className="btn-lg w-full"
				secondary
				onClick={handleSave}
			>
				{image ? 'Save Featured Image' : 'No Image Selected'}
			</Button>
		</div>
	);
};

export default SidebarImageUpload;
