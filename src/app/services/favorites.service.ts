import { Injectable } from '@angular/core';
import { DatabaseService  } from './database.service';
@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  constructor(private dbService:DatabaseService) { }

  
}
