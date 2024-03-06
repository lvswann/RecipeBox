import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(private storage: Storage) {
    this.initStorage();
   }

  async initStorage() {
    await this.storage.create();
  }

  async set(key: any,value: any) {
    await this.storage.set(key, value);
    return true;
  }

  async get(key: any) {
    const value = await this.storage.get(key); 

    return value;
  }

  async remove(key: any)
  {
      await this.storage.remove(key);
      return
  }
}
