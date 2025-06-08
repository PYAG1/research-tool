// import { useCallback, useEffect, useMemo, useState } from "react";
// import {
//   type FileError,
//   type FileRejection,
//   useDropzone,
// } from "react-dropzone";
// import { supabase } from "renderer/lib/config";
// import { processDocRPC } from "renderer/services/process-doc-rpc";
// import { toast } from "sonner";

// interface FileWithPreview extends File {
//   preview?: string;
//   errors: readonly FileError[];
// }

// /**
//  * Type representing upload response
//  */
// interface UploadResponse {
//   name: string;
//   message?: string;
//   success: boolean;
// }

// /**
//  * Type for upload error
//  */
// interface UploadError {
//   name: string;
//   message: string;
// }

// type UseSupabaseUploadOptions = {
//   /**
//    * Name of bucket to upload files to in your Supabase project
//    */
//   bucketName: string;
//   /**
//    * Folder to upload files to in the specified bucket within your Supabase project.
//    *
//    * Defaults to uploading files to the root of the bucket
//    *
//    * e.g If specified path is `test`, your file will be uploaded as `test/file_name`
//    */
//   path?: string;
//   /**
//    * Allowed MIME types for each file upload (e.g `image/png`, `text/html`, etc). Wildcards are also supported (e.g `image/*`).
//    *
//    * Defaults to allowing uploading of all MIME types.
//    */
//   allowedMimeTypes?: string[];
//   /**
//    * Maximum upload size of each file allowed in bytes. (e.g 1000 bytes = 1 KB)
//    */
//   maxFileSize?: number;
//   /**
//    * Maximum number of files allowed per upload.
//    */
//   maxFiles?: number;
//   /**
//    * The number of seconds the asset is cached in the browser and in the Supabase CDN.
//    *
//    * This is set in the Cache-Control: max-age=<seconds> header. Defaults to 3600 seconds.
//    */
//   cacheControl?: number;
//   /**
//    * When set to true, the file is overwritten if it exists.
//    *
//    * When set to false, an error is thrown if the object already exists. Defaults to `false`
//    */
//   upsert?: boolean;
//   /**
//    * Optional category ID to associate with uploaded files
//    */
//   category_id?: string;
//   onUploadComplete?: () => void;
// };

// type UseSupabaseUploadReturn = ReturnType<typeof useSupabaseUpload>;

// /**
//  * Custom hook for handling file uploads to Supabase storage
//  * @param options Upload configuration options
//  * @returns Object containing files, state, and upload methods
//  */
// const useSupabaseUpload = (options: UseSupabaseUploadOptions) => {
//   const {
//     bucketName,
//     path,
//     allowedMimeTypes = [],
//     maxFileSize = Number.POSITIVE_INFINITY,
//     maxFiles = 1,
//     cacheControl = 3600,
//     upsert = false,
//     category_id,
//     onUploadComplete,
//   } = options;

//   const [files, setFiles] = useState<FileWithPreview[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [errors, setErrors] = useState<UploadError[]>([]);
//   const [successes, setSuccesses] = useState<string[]>([]);

//   const isSuccess = useMemo(() => {
//     if (errors.length === 0 && successes.length === 0) {
//       return false;
//     }
//     if (errors.length === 0 && successes.length === files.length) {
//       return true;
//     }
//     return false;
//   }, [errors.length, successes.length, files.length]);
//   const onDrop = useCallback(
//     (acceptedFiles: File[], fileRejections: FileRejection[]) => {
//       const validFiles = acceptedFiles
//         .filter((file) => !files.find((x) => x.name === file.name))
//         .map((file) => {
//           (file as FileWithPreview).preview = URL.createObjectURL(file);
//           (file as FileWithPreview).errors = [];
//           return file as FileWithPreview;
//         });

//       const invalidFiles = fileRejections.map(({ file, errors }) => {
//         (file as FileWithPreview).preview = URL.createObjectURL(file);
//         (file as FileWithPreview).errors = errors;
//         return file as FileWithPreview;
//       });

//       const newFiles = [...files, ...validFiles, ...invalidFiles];

//       setFiles(newFiles);
//     },
//     [files, setFiles]
//   );

//   // Clean up object URLs when component unmounts or files change
//   useEffect(() => {
//     return () => {
//       files.forEach((file) => {
//         if (file.preview) {
//           URL.revokeObjectURL(file.preview);
//         }
//       });
//     };
//   }, [files]);

//   // Add cleanup for object URLs to prevent memory leaks
//   useEffect(() => {
//     // Cleanup function to revoke object URLs
//     return () => {
//       // Revoke object URLs when component unmounts
//       files.forEach((file) => {
//         if (file.preview) {
//           URL.revokeObjectURL(file.preview);
//         }
//       });
//     };
//   }, [files]);

//   const dropzoneProps = useDropzone({
//     onDrop,
//     noClick: true,
//     accept: allowedMimeTypes.reduce(
//       (acc, type) => ({ ...acc, [type]: [] }),
//       {}
//     ),
//     maxSize: maxFileSize,
//     maxFiles: maxFiles,
//     multiple: maxFiles !== 1,
//   });
//   /**
//    * Handles the file upload process to Supabase storage
//    * Includes error handling and processing of uploaded files
//    */
//   const onUpload = useCallback(async () => {
//     setLoading(true);

//     const uploadPromise = new Promise(async (resolve, reject) => {
//       // Determine which files need to be uploaded
//       // Files that had errors previously + files that haven't been uploaded yet
//       const filesWithErrors = errors.map((x) => x.name);
//       const filesToUpload = Array.from(
//         new Set([
//           ...files.filter((f) => filesWithErrors.includes(f.name)),
//           ...files.filter((f) => !successes.includes(f.name)),
//         ])
//       );
//       const responses: UploadResponse[] = await Promise.all(
//         filesToUpload.map(async (file) => {
//           try {
//             const { error } = await supabase.storage
//               .from(bucketName)
//               .upload(!!path ? `${path}/${file.name}` : file.name, file, {
//                 cacheControl: cacheControl.toString(),
//                 upsert,
//               });

//             if (error) {
//               console.log(
//                 "Error uploading file",
//                 file.name,
//                 error.message,
//                 error.cause,
//                 error.stack
//               );
//               return {
//                 name: file.name,
//                 message: `Upload failed: ${error.message || "Unknown error"}`,
//                 success: false,
//               };
//             } else {
//               console.log("File uploaded successfully", file.name);
//               return { name: file.name, message: undefined, success: true };
//             }
//           } catch (uploadError: unknown) {
//             // Handle unexpected errors (e.g. network failures)
//             const errorMessage =
//               uploadError instanceof Error
//                 ? uploadError.message
//                 : "Unknown upload error";

//             console.error(
//               `Unexpected error uploading ${file.name}:`,
//               uploadError
//             );
//             return {
//               name: file.name,
//               message: `Upload failed: ${errorMessage}`,
//               success: false,
//             };
//           }
//         })
//       ); // Process upload results
//       const responseErrors: UploadError[] = responses
//         .filter((x) => !x.success)
//         .map((x) => ({ name: x.name, message: x.message! }));

//       // Update errors state - clear previous errors for re-attempted uploads
//       setErrors(responseErrors);

//       // Track successful uploads
//       const responseSuccesses = responses.filter((x) => x.success);
//       const newSuccesses = Array.from(
//         new Set([...successes, ...responseSuccesses.map((x) => x.name)])
//       );
//       setSuccesses(newSuccesses);

//       // Handle case where some uploads failed
//       if (responseErrors.length > 0) {
//         const failedCount = responseErrors.length;
//         const totalCount = filesToUpload.length;
//         reject(
//           new Error(`${failedCount} of ${totalCount} files failed to upload.`)
//         );
//         return;
//       } // Process documents after successful upload
//       if (path) {
//         // Track processing results
//         const processingResults: {
//           name: string;
//           success: boolean;
//           error?: string;
//         }[] = [];

//         // Process each successfully uploaded document
//         for (const successfulUpload of responseSuccesses) {
//           try {
//             console.log(
//               `Processing document: user_id=${path}, file_name=${successfulUpload.name}`
//             );
//             await processDocRPC(path, successfulUpload.name, category_id);
//             console.log(`Successfully processed ${successfulUpload.name}`);
//             processingResults.push({
//               name: successfulUpload.name,
//               success: true,
//             });
//           } catch (rpcError: unknown) {
//             // Properly type the error and extract message
//             const errorMessage =
//               rpcError instanceof Error
//                 ? rpcError.message
//                 : "Unknown processing error";

//             console.error(
//               `Error processing ${successfulUpload.name}:`,
//               rpcError
//             );

//             // Store processing error but continue with other files
//             processingResults.push({
//               name: successfulUpload.name,
//               success: false,
//               error: errorMessage,
//             });
//           }
//         }

//         // Check if any processing failed
//         const processingErrors = processingResults.filter((r) => !r.success);
//         if (processingErrors.length > 0) {
//           // Partial success - some files were processed
//           if (processingErrors.length < responseSuccesses.length) {
//             resolve(
//               `Files uploaded successfully. ${processingErrors.length} had processing issues.`
//             );
//           } else {
//             // All processing failed
//             reject(new Error("Files uploaded but processing failed."));
//           }
//           return;
//         }
//       } else {
//         console.warn(
//           "Path (user_id) is not defined. Skipping document processing."
//         );
//       }

//       resolve("All files uploaded and processed successfully.");
//     });

//     toast.promise(uploadPromise, {
//       loading: "Setting up paper...",
//       success: (message) => {
//         setLoading(false);
//         if (onUploadComplete) {
//           onUploadComplete();
//         }
//         return message as string;
//       },
//       error: (err) => {
//         setLoading(false);
//         return err.message;
//       },
//     });
//   }, [
//     files,
//     path,
//     bucketName,
//     errors,
//     successes,
//     upsert,
//     cacheControl,
//     onUploadComplete,
//   ]);

//   useEffect(() => {
//     if (files.length === 0) {
//       setErrors([]);
//     }

//     // If the number of files doesn't exceed the maxFiles parameter, remove the error 'Too many files' from each file
//     if (files.length <= maxFiles) {
//       let changed = false;
//       const newFiles = files.map((file) => {
//         if (file.errors.some((e) => e.code === "too-many-files")) {
//           file.errors = file.errors.filter((e) => e.code !== "too-many-files");
//           changed = true;
//         }
//         return file;
//       });
//       if (changed) {
//         setFiles(newFiles);
//       }
//     }
//   }, [files.length, setFiles, maxFiles]);

//   return {
//     files,
//     setFiles,
//     successes,
//     isSuccess,
//     loading,
//     errors,
//     setErrors,
//     onUpload,
//     maxFileSize: maxFileSize,
//     maxFiles: maxFiles,
//     allowedMimeTypes,
//     ...dropzoneProps,
//   };
// };

// export {
//   useSupabaseUpload,
//   type UseSupabaseUploadOptions,
//   type UseSupabaseUploadReturn,
// };
