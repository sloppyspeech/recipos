import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DatabaseService} from '../services/database.service';
@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string;

  constructor(private activatedRoute: ActivatedRoute,
             private dbService:DatabaseService) { }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
  }

  getRecipeMaster(){
    let ingredient_list:any=['palak','paneer','chilli','flour','soya'];
    console.log('Inside Components Recipe Master');
    // this.dbService.getRecipeMaster();
    this.dbService.getRecipesByIngredients(ingredient_list);
  }
}
