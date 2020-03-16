import { Component, OnInit } from '@angular/core';
import { DatabaseService  } from '../services/database.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';


@Component({
  selector: 'app-favorite-recipes',
  templateUrl: './favorite-recipes.page.html',
  styleUrls: ['./favorite-recipes.page.scss'],
})
export class FavoriteRecipesPage implements OnInit {
  public favRecipeList:any=[];
  public origRecipeList:any=[];
  public A2G = [];
  public H2M = [];
  public N2S = [];
  public T2Z = [];

  constructor(private dbService:DatabaseService,
              private iab: InAppBrowser) { }

  ngOnInit() {
    this.getFavoriteRecipes();
  }


  getFavoriteRecipes() {
    this.dbService.presentLoading('Searching Recipes....');
    console.log('Inside searchByIngredient');
    this.dbService.getFavoriteRecipes()
      .then((res) => {
        console.log("Inside DB Service Call");
        this.dbService.$favRecipeList.subscribe((ret) => {
          this.favRecipeList = [];
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
            this.favRecipeList.push(ret[i]);
          }
          this.origRecipeList = this.favRecipeList;

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
  addToFavorites(recipeId) {
    console.log('FavoriteService : addToFavorites ' + recipeId);

    this.dbService.addToFavorites(recipeId)
      .then((res) => {
        console.log("FavoriteService : Favorite Added " + recipeId);
        for (let i = 0; i < this.favRecipeList.length; i++) {
          console.log(recipeId + ' : ' + this.favRecipeList[i].recipe_id);
          if (recipeId == this.favRecipeList[i].recipe_id) {
            console.log("FavoriteService : Match Found " + this.favRecipeList[i].recipe_id);
            console.log("FavoriteService : Add Before Match Found " + this.favRecipeList[i].fav_recipe);
            this.favRecipeList[i].fav_recipe = recipeId;
            console.log("FavoriteService : Add After  Match Found " + this.favRecipeList[i].fav_recipe);
            break;
          }
        }
      })
      .catch((e) => {
        console.log("FavoriteService : Error While adding favorites");
      })
  }

  removeFromFavorites(recipeId) {
    console.log('FavoriteService : removeFromFavorites ' + recipeId);

    this.dbService.removeFromFavorites(recipeId)
      .then((res) => {
        console.log("FavoriteService : Favorite Removed " + recipeId);
        for (let i = 0; i < this.favRecipeList.length; i++) {
          console.log(recipeId + ' === ' + this.favRecipeList[i].recipe_id);
          if (recipeId == this.favRecipeList[i].recipe_id) {
            console.log("FavoriteService : Match Found " + this.favRecipeList.recipe_id);
            console.log("FavoriteService : Before Match Found " + this.favRecipeList[i].fav_recipe);
            this.favRecipeList[i].fav_recipe = 0;
            console.log("FavoriteService : After  Match Found " + this.favRecipeList[i].fav_recipe);

            break;
          }
        }
      })
      .catch((e) => {
        console.log("FavoriteService : Error While removing favorites");
      })
  }

  openInBrowser(urlToOpen) {
    console.log("Favorite Url to Open :" + urlToOpen);
    const browser = this.iab.create(urlToOpen);

    // browser.close();

  }

}
