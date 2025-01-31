import { Button, CircularProgress } from "@mui/material";
import { uploadImage } from "@shared/api/media-storage.api";
import { useAuth } from "@shared/hooks/auth.hooks";
import { Image } from "@shared/interfaces/image.interface";
import { AxiosError } from "axios";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { IoCamera } from "react-icons/io5";

const UserImageUpload = ({
  image,
  onChange,
}: {
  image: Image | null;
  onChange: (img: Image | null) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { activeShop } = useAuth();

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => handleImageChange(acceptedFiles),
    accept: { "image/*": [] },
    multiple: false, // Only allow one file
  });

  const handleImageChange = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    if (!activeShop) return;

    const file = acceptedFiles[0];
    setIsLoading(true);

    try {
      setErrorMsg(null);
      const uploadedImage = await uploadImage(activeShop._id, {
        file,
        alt: "Profile Image",
      });
      onChange(uploadedImage);
    } catch (error) {
      if (error instanceof AxiosError) {
        setErrorMsg(error.response?.data?.message);
      } else if (error instanceof Error) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg("Unkown error occured while uploading image");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xs mx-auto space-y-6">
      <div className="flex flex-col items-center gap-4">
        {/* Drag-and-Drop Area */}
        <div
          {...getRootProps()}
          className={`border-2 h-48 w-48 border-dashed border-gray-300 text-gray-500 dark:border-gray-600 ${
            !isLoading && "cursor-pointer"
          } hover:border-violet-400 transition-all rounded-full relative group p-2.5`}
        >
          {image ? (
            <>
              <div className="h-full w-full overflow-hidden relative">
                {/* Image Preview */}
                <img
                  src={image.url}
                  className=" w-full h-full object-cover object-center rounded-full"
                />
                <div className="flex flex-col justify-center items-center w-full h-full absolute top-0 left-0 bg-gray-900 text-white opacity-0 group-hover:opacity-60 rounded-full transition-opacity dark:bg-slate-200">
                  {isLoading ? (
                    <>
                      <CircularProgress size={30} color="inherit" />
                      <p className="text-sm">Changing</p>
                    </>
                  ) : (
                    <>
                      <IoCamera size={30} />
                      <p className="text-sm">Change Photo</p>
                      <input {...getInputProps()} />
                    </>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col justify-center items-center w-full h-full dark:bg-gray-700 rounded-full text-gray-400 bg-gray-200">
              {isLoading ? (
                <>
                  <CircularProgress
                    size={30}
                    color="inherit"
                    className="mb-4"
                  />
                  <p className="text-sm">Uploading</p>
                </>
              ) : (
                <>
                  <input {...getInputProps()} />
                  <IoCamera size={30} />
                  <p className="text-sm">Upload Image</p>
                </>
              )}
            </div>
          )}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-[200px]">
          Allowed *.jpeg, *.jpg, *.png max size of 3 Mb
        </p>
        {errorMsg && (
          <p className="text-sm text-red-800 text-center max-w-[200px] my-2 ">
            {errorMsg}
          </p>
        )}
        {image && (
          <Button
            variant="contained"
            size="small"
            color="error"
            onClick={() => onChange(null)}
          >
            Remove Image
          </Button>
        )}
      </div>
    </div>
  );
};

export default UserImageUpload;
