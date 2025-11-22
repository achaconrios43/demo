import{Injectable}from'@angular/core';  
import{Preferences} from'@capacitor/preferences';


export interface Fotocamara{
  id:string;
  nombre:string;
  rutaArchivo:string;
  fechaCaptura:string;
  base64Data:string;

}

@Injectable({
  providedIn:'root'
})
export class FotocamaraStorageService {
    private storageKey='fotocamaras';

    private getStoredkey(usuario:string):string{
        return`${this.storageKey}-${usuario}`;
    }

    async guardarFotocamara(usuario:string,fotocamara: Fotocamara[]):Promise<void>{
        const key=this.getStoredkey(usuario);
        await Preferences.set({
            key,
            value:JSON.stringify(fotocamara)
        });
    }

    async obtenerFotocamara(usuario:string):Promise<Fotocamara[]>{
        const key=this.getStoredkey(usuario);
        const{value}=await Preferences.get({key:key});
        return value?JSON.parse(value):[];
    }

    async eliminarFotocamaras(usuario:string):Promise<void>{
        const key=this.getStoredkey(usuario);
        await Preferences.remove({key:key});
    }
}