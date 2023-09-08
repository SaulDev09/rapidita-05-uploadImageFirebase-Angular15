import { Component } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { ItemFile } from './models/itemFile';
import { LoadImagesService } from './services/load-images.service';

export interface Item { name: string; url: string; }

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'upload-image-firebase';

  private itemsCollection: AngularFirestoreCollection<Item>;
  public items: Observable<Item[]>;

  public files: ItemFile[] = [];

  constructor(
    private afs: AngularFirestore,
    public loadImages: LoadImagesService
  ) {
    this.itemsCollection = afs.collection<Item>('img');
    this.items = this.itemsCollection.valueChanges();
  }

  public selectFiles(event: any) {
    for (let i = 0; i < event.target.files.length; i++) {
      if (!event.target.files[i].type.includes('image')) {
        alert('File ' + event.target.files[i].name + ' not allowed, Invalid extension');
        event.target.value = null;
        return;
      }
      this.files.push(new ItemFile(event.target.files[i]));
    }
    event.target.value = null;
  }

  public uploadImages() {
    this.loadImages.uploadImagesFirebase(this.files);
  }

  public deleteImages() {
    this.files = [];
  }
}

