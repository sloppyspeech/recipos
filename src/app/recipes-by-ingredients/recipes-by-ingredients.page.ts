import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { DatabaseService } from '../services/database.service';
import { FavoritesService  } from '../services/favorites.service';
import { ElementFinder } from 'protractor';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-recipes-by-ingredients',
  templateUrl: './recipes-by-ingredients.page.html',
  styleUrls: ['./recipes-by-ingredients.page.scss'],
})
export class RecipesByIngredientsPage implements OnInit {

  private fg_searchByIngredients: FormGroup;
  private fctl_ingredient_name: FormControl;
  private search_rec: any;
  private ingredient_list: any = [];
  private ingrListAutoComp: any = [];
  public recipe_list: any = [];
  public disableAddIngredients: boolean = false;
  public isItemAvailable: boolean = false;
  public alphabets = new Set();
  public origRecipeList: any = [];
  // public A2G=['A','B','C','D','E','F','G'];
  // public H2M=['H','I','J','K','L','M'];
  // public N2S=['N','O','P','Q','R','S'];
  // public T2Z=['T','U','V','W','X','Y','Z'];

  public A2G: any = [];
  public H2M: any = [];
  public N2S: any = [];
  public T2Z: any = [];

  public fifteenMins: any=[];
  public thirtyMins: any=[];
  public fortyFiveMins: any=[];
  public oneHr: any=[];
  public twoHr: any=[];
  public overTwohr:any=[];


  constructor(private dbService: DatabaseService, 
              private favService:FavoritesService, 
              private iab: InAppBrowser) { }

  ngOnInit() {

    this.fg_searchByIngredients = new FormGroup({
      fctl_ingredient_name: new FormControl({ value: '', disabled: false }, Validators.required),
    });

  }

initializeRecipeLists(){
  this.recipe_list = [];
  this.origRecipeList = [];
  this.A2G = [];
  this.H2M = [];
  this.N2S = [];
  this.T2Z = [];
  this.fifteenMins  =[];
  this.thirtyMins  =[];
  this.fortyFiveMins =[];
  this.oneHr=[];
  this.twoHr=[];
  this.overTwohr=[];

}

  searchByIngredient() {
    this.dbService.presentLoading('Searching Recipes....');
    console.log('Inside searchByIngredient');
    console.log('Searching for ' + this.ingredient_list);
    this.dbService.getRecipesByIngredients(this.ingredient_list)
      .then((res) => {
        console.log("Inside DB Service Call");
        this.dbService.$recipe_list.subscribe((ret) => {
          this.recipe_list = [];
          this.origRecipeList = [];
          this.A2G = [];
          this.H2M = [];
          this.N2S = [];
          this.T2Z = [];
          // console.log('Recipe List :' + ret);
          console.log('Recipe List :' + ret.length);
          for (let i = 0; i < ret.length; i++) {
            // this.alphabets.add(ret[i].letr);
            if (ret[i].asciiletr >= 65 && ret[i].asciiletr <= 71) {
              this.A2G.push(ret[i]);
            }
            else if (ret[i].asciiletr >= 72 && ret[i].asciiletr <= 77) {
              this.H2M.push(ret[i]);
            }
            else if (ret[i].asciiletr >= 78 && ret[i].asciiletr <= 83) {
              this.N2S.push(ret[i]);
            }
            else {
              this.T2Z.push(ret[i]);
            }

            if (ret[i].recipe_total_time <=15) {
              this.fifteenMins.push(ret[i]);
            }
            else if (ret[i].recipe_total_time > 15 && ret[i].recipe_total_time <= 30) {
              this.thirtyMins.push(ret[i]);
            }
            else if (ret[i].recipe_total_time >30 && ret[i].recipe_total_time <= 60) {
              this.oneHr.push(ret[i]);
            }
            else if (ret[i].recipe_total_time >60 && ret[i].recipe_total_time <= 120) {
              this.twoHr.push(ret[i]);
            }
            else {
              this.overTwohr.push(ret[i]);
            }
            
            this.recipe_list.push(ret[i]);
          }
          this.origRecipeList = this.recipe_list;

          // console.log(this.recipe_list);
          // console.log('++++++++++++++++++++++++++++++++++');
          // console.log(this.A2G);
          // console.log(this.H2M);
          // console.log(this.N2S);
          // console.log(this.T2Z);
          // console.log('++++++++++++++++++++++++++++++++++');

          // console.log(this.alphabets);
          this.dbService.dismissLoading();
        });
      });

  }

  addIngredient() {
    console.log("Inside addIngredient");
    let valExist = 0;
    for (let i = 0; i < this.ingredient_list.length; i++) {
      if (this.fg_searchByIngredients.get('fctl_ingredient_name').value === this.ingredient_list[i]) {
        valExist = 1;
        console.log("Ingredient exist won't add");
        break;
      }
    }
    console.log("Val Exists "+valExist);
    if (valExist === 0) {
      console.log("Ingredient Doesn't exist");
      this.ingredient_list.push(this.fg_searchByIngredients.get('fctl_ingredient_name').value);

      console.log(this.ingredient_list);
      this.fg_searchByIngredients.get('fctl_ingredient_name').setValue("");

      console.log(this.ingredient_list.length);
      if (this.ingredient_list.length > 2) {
        this.disableAddIngredients = true;
        this.fg_searchByIngredients.get('fctl_ingredient_name').disable();
      }
      this.searchByIngredient();
      // this.searchByIngredient();
      // console.log("this.disableAddIngredients "+this.disableAddIngredients);
    }
  }

  removeIngredient(ingredient) {
    console.log("Going to remove the ingredient " + ingredient);
    let idx = this.ingredient_list.indexOf(ingredient);
    console.log(this.ingredient_list);
    console.log("Bef idx is :"+idx);
    this.ingredient_list.splice(idx, 1);
    if (this.ingredient_list.length>0) {
      console.log("Index list after removal: "+this.ingredient_list);
      console.log("this.disableAddIngredients :"+this.disableAddIngredients)
      if (this.disableAddIngredients) {
        this.disableAddIngredients = false;
      }
        this.fg_searchByIngredients.get('fctl_ingredient_name').enable();
        this.searchByIngredient();
    }
    console.log("ingredient_list.length " + this.ingredient_list.length);

    if (this.ingredient_list.length == 0) {
      this.initializeRecipeLists();
    }
    console.log("After :" + this.ingredient_list);

  }

  getIngredientAutoComp(event: any) {
    let val = event.target.value;
    this.ingrListAutoComp = [];
    console.log("getIngredientAutoComp " + val);

    if (val && val.trim() != '') {
      this.isItemAvailable = true;
      console.log(this.isItemAvailable);

      this.dbService.getIngredientsForAutoComp(val)
        .then((res) => {
          console.log("Inside getIngredientsForAutoComp DB Service Call");
          this.dbService.$ingListAutoComp.subscribe((ret) => {
            this.ingrListAutoComp = [];
            console.log('Ingredient List :' + JSON.stringify(ret));
            console.log('Ingredient List :' + ret.length);
            for (let i = 0; i < ret.length; i++) {
              this.ingrListAutoComp.push(ret[i].ingredient_name);
            }
            console.log(this.ingrListAutoComp);
          });

        });

    }

  }


  itemSelected(item) {
    console.log("itemSelected " + item);
    this.isItemAvailable = false;
    this.fg_searchByIngredients.get('fctl_ingredient_name').setValue(item);
    this.addIngredient();
  }

  setRecipeListItemBegnChars(inp: string) {
    console.log("setRecipeListItemBegnChars Char List Clicked  :" + inp);

    if (inp === 'A-G') {
      this.recipe_list = this.A2G;
      if (this.A2G !== undefined) {
        this.dbService.presentToast(this.A2G.length + ' Recipes Found');
      }
      else {
        this.dbService.presentToast('No Recipes begining A to G');
      }
    }
    else if (inp === 'H-M') {
      this.recipe_list = this.H2M;
      if (this.H2M !== undefined) {
        this.dbService.presentToast(this.H2M.length + ' Recipes Found');
      }
      else {
        this.dbService.presentToast('No Recipes begining H to M');
      }
    }
    else if (inp === 'N-S') {
      this.recipe_list = this.N2S;
      if (this.N2S !== undefined) {
        this.dbService.presentToast(this.N2S.length + ' Recipes Found');
      }
      else {
        this.dbService.presentToast('No Recipes begining N to S');
      }

    }
    else if (inp === "T-Z") {
      this.recipe_list = this.T2Z;
      if (this.T2Z === undefined) {
        this.dbService.presentToast(this.T2Z.length + ' Recipes Found');
      }
      else {
        this.dbService.presentToast('No Recipes begining T to Z');
      }

    }
    else {
      this.recipe_list = this.origRecipeList;
    }
    console.log('this.recipe_list :' + this.recipe_list);
    this.dbService.presentToast(this.recipe_list.length + ' Recipes Found');

  }

  setRecipeListByTotTime(inp: string) {
    console.log("setRecipeListByTotTime Char List Clicked  :" + inp);

    if (inp === '15') {
      this.recipe_list = this.fifteenMins;
      if (this.fifteenMins !== undefined) {
        this.dbService.presentToast(this.fifteenMins.length + ' Recipes Found');
      }
      else {
        this.dbService.presentToast('No Recipes under 15 mins');
      }
    }
    else if (inp === '30') {
      this.recipe_list = this.thirtyMins;
      if (this.thirtyMins !== undefined) {
        this.dbService.presentToast(this.thirtyMins.length + ' Recipes Found');
      }
      else {
        this.dbService.presentToast('No Recipes under 30 mins');
      }
    }
    else if (inp === '1hr') {
      this.recipe_list = this.oneHr;
      if (this.oneHr !== undefined) {
        this.dbService.presentToast(this.oneHr.length + ' Recipes Found');
      }
      else {
        this.dbService.presentToast('No Recipes under 1 hour');
      }

    }
    else if (inp === "2hr") {
      this.recipe_list = this.twoHr;
      if (this.twoHr === undefined) {
        this.dbService.presentToast(this.twoHr.length + ' Recipes Found');
      }
      else {
        this.dbService.presentToast('No Recipes under 2 hours');
      }

    }
    else {
      this.recipe_list = this.origRecipeList;
    }
    console.log('this.recipe_list :' + this.recipe_list);
    this.dbService.presentToast(this.recipe_list.length + ' Recipes Found');

  }

  addToFavorites(recipeId) {
    console.log('addToFavorites : ' + recipeId);

    this.dbService.addToFavorites(recipeId)
      .then((res) => {
        console.log("Favorite Added " + recipeId);
        for (let i = 0; i < this.recipe_list.length; i++) {
          console.log(recipeId + ' : ' + this.recipe_list[i].recipe_id);
          if (recipeId == this.recipe_list[i].recipe_id) {
            console.log("Match Found " + this.recipe_list[i].recipe_id);
            console.log(" Add Before Match Found " + this.recipe_list[i].fav_recipe);
            this.recipe_list[i].fav_recipe = recipeId;
            console.log("Add After  Match Found " + this.recipe_list[i].fav_recipe);
            break;
          }
        }
      })
      .catch((e) => {
        console.log("Error While adding favorites");
      })
  }

  removeFromFavorites(recipeId) {
    console.log('removeFromFavorites ' + recipeId);

    this.dbService.removeFromFavorites(recipeId)
      .then((res) => {
        console.log("Favorite Removed " + recipeId);
        for (let i = 0; i < this.recipe_list.length; i++) {
          console.log(recipeId + ' === ' + this.recipe_list[i].recipe_id);
          if (recipeId == this.recipe_list[i].recipe_id) {
            console.log("Match Found " + this.recipe_list.recipe_id);
            console.log("Before Match Found " + this.recipe_list[i].fav_recipe);
            this.recipe_list[i].fav_recipe = 0;
            console.log("After  Match Found " + this.recipe_list[i].fav_recipe);

            break;
          }
        }
      })
      .catch((e) => {
        console.log("Error While removing favorites");
      })
  }

  openInBrowser(urlToOpen) {
    console.log("Url to Open :" + urlToOpen);
    const browser = this.iab.create(urlToOpen);

    // browser.close();

  }

}
