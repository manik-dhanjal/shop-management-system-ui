import { LocalImageBlob } from '@partials/products/sidebar-image-upload.component';
import { Image } from '@shared/interfaces/image.interface';
import axios from 'axios';
const baseUrl =
	'http://localhost:3001/api/shop/6765bae37ab3095322389127/media-storage';

export const uploadImage = async ({
	file,
	alt,
}: LocalImageBlob): Promise<Image> => {
	const formData = new FormData();
	formData.append('file', file);
	formData.append('alt', alt);
	const response = await axios.post(`${baseUrl}/image/upload`, formData);
	return response.data;
};
