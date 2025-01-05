export type SuccessApiResult<ApiResponseData> = {
	data: ApiResponseData;
	message: string;
	statusCode: number;
};

export type ErrorApiResult = {
	error: string;
	message: string;
	statusCode: number;
};
