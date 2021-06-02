import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference,
} from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { from, Observable } from 'rxjs';
import { Contacto } from '../models/contactos';

@Injectable({
  providedIn: 'root',
})
export class ContactosService {
  private contactos: Observable<Contacto[]>;
  private contactosCollection: AngularFirestoreCollection<Contacto>;

  constructor(private fb: AngularFirestore) {
    this.contactosCollection = fb.collection<Contacto>('contactos');
    this.contactos = this.contactosCollection.snapshotChanges().pipe(
      map((actions) =>
        actions.map((a) => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
  }

  crearContacto(contacto: Contacto): Promise<DocumentReference> {
    console.log(contacto);
    return this.contactosCollection.add(contacto);
  }
  getContactos(): Observable<Contacto[]> {
    console.log(this.contactos);

    return this.contactos;
  }
  borrarContacto(contacto: Contacto) {
    this.fb
      .doc(`contactos/${contacto}`)
      .delete()
      .then(() => {
        console.log('COntactoo eliminado');
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
