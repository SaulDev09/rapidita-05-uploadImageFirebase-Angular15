import { Injectable } from '@angular/core';


import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { ItemFile } from '../models/itemFile';


@Injectable({
  providedIn: 'root'
})
export class LoadImagesService {
  private imageFolder_path = 'img';

  constructor(private db: AngularFirestore) { }

  uploadImagesFirebase(images: ItemFile[]) {
    const storage = getStorage();

    for (const item of images) {
      item.isUploading = true;
      if (item.progress >= 100) {
        continue;
      }

      const storageRef = ref(storage, `${this.imageFolder_path}/${item.fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, item.file);

      uploadTask.on('state_changed', (snapshot: any) =>
        item.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        (error) => console.error('Error uploading', error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            item.url = downloadURL;

            item.isUploading = false;
            this.saveImage({
              name: item.fileName,
              url: item.url
            });
          });
        });
    }
  }

  private saveImage(image: { name: string, url: string }) {
    this.db.collection(`/${this.imageFolder_path}`).add(image);
  }
}
