import {
  getDownloadURL,
  getStorage,
  ref,
  StorageReference,
  uploadBytesResumable,
} from "firebase/storage";

type ProgressCallback = (percent: number) => void;
type SuccessCallback = (url: string) => void;
type ErrorCallback = (error: string) => void;

const storage = getStorage();

export function handleFileUpload(
  file: File,
  onSuccess: SuccessCallback,
  onProgress: ProgressCallback,
  onError: ErrorCallback
): void {
  const storageRef: StorageReference = ref(storage, `/images/${file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const percent = Math.round(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      );
      onProgress(percent);
    },
    (error) => {
      onError(error.message);
    },
    async () => {
      getDownloadURL(uploadTask.snapshot.ref).then((url) => {
        onSuccess(url);
      });
    }
  );
}
