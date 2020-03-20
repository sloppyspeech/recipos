import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { LoadingController, ToastController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private dbo: SQLiteObject;
  private dbReady: BehaviorSubject<boolean>;
  public recipe_name_list: any = [];
  public favRecipeNameList: any = [];
  public $recipe_list = new BehaviorSubject([]);
  public $favRecipeList = new BehaviorSubject([]);
  public $ingListAutoComp = new BehaviorSubject([]);
  public $recipeNameAutoComp = new BehaviorSubject([]);
  public ingredientList: any = [];
  public recipeNameList: any = [];
  public loaderToShow: any;
  public isLoading = false;

  constructor(private sqlite: SQLite,
    private sqlitePorter: SQLitePorter,
    private platform: Platform,
    private http: HttpClient,
    public loadingController: LoadingController,
    public toastController: ToastController
  ) {

    this.dbReady = new BehaviorSubject(false);
    localStorage.setItem('db_loaded', 'N');

    this.platform.ready()
      .then(() => {
        this.sqlite.create({
          name: 'td.db',
          location: 'default'
        })
          .then((res) => {
            console.log('DB Opened Successfully');
            this.dbo = res;
            if (localStorage.getItem('db_loaded') != 'Y') {
              this.http.get('assets/sqls/version.txt', { responseType: 'text' })
                .subscribe((version) => {
                  console.log("VErsion got " + version);
                  this.loadDB(version);
                });

            }
          })
          .catch((e) => {
            console.log('Error while loading DB' + JSON.stringify(e));
          });
      })
      .catch((e) => {
        console.log("Error opening the DB " + JSON.stringify(e));
      });

  }


  loadDBData(){
    let todayISOString: string = new Date().toISOString();
    this.presentLoading("Loading Recipes .....Please Wait!!!");

      this.http.get('assets/sqls/tarladalal_db_schema.sql', { responseType: 'text' })
        .subscribe((dbSchemaSql) => {
          this.sqlitePorter.importSqlToDb(this.dbo, dbSchemaSql)
            .then((res) => {
              console.log('DB Schema Loaded');

              todayISOString = new Date().toISOString();
              console.log(todayISOString);

              //--------------Data Load Start---------------
              this.http.get('assets/sqls/tarladalal_data.json', { responseType: 'text' })
                .subscribe((jsonData) => {
                  console.log('Loading DB Json Data');
                  todayISOString = new Date().toISOString();
                  console.log(todayISOString);
                  this.sqlitePorter.importJsonToDb(this.dbo, jsonData)
                    .then((res) => {
                      console.log('DB JSON Data Loaded');
                      this.dbReady.next(true);
                      localStorage.setItem('db_loaded', 'Y');
                      todayISOString = new Date().toISOString();
                      console.log(todayISOString);
                      this.dismissLoading();
                    })
                    .catch((e) => {
                      console.log("Error in Importing DB Data JSON" + JSON.stringify(e));
                    })
                });
              //--------------Data Load End-----------------

            })
            .catch((e) => {
              console.log("Error in Importing DB Schema SQL" + JSON.stringify(e));
            })
        });


  }


  loadDB(version) {
    console.log('Begining LoadDb for Version ' + version);
    this.dbo.executeSql("select version from db_version", [])
      .then((res) => {
        console.log("Version supplied is: "+version)
        console.log("res.rows.item(0) "+JSON.stringify(res.rows.item(0).version))
        if (version != res.rows.item(0).version){
          console.log("Loading Data in DB");
           this.loadDBData();
        }
      })
      .catch((e) => {
        console.log('Error while selecting from DB ' + JSON.stringify(e));
        if (e.code =="5"){
          console.log("Error, so Loading DB Again")
          this.loadDBData();
        }
      });


  }

  getRecipeMaster() {
    console.log('Inside getRecipeMaster DB Service');
    console.log(JSON.stringify(this.dbo));
    this.dbo.executeSql("select r.* from recipe_ingredients ri,ingredient_master i,recipe_master r where ri.ingredient_id=i.ingredient_id and ri.recipe_id=r.recipe_id and i.ingredient_name like '%potato%' LIMIT 5;", [])
      .then((res) => {
        console.log('Executed SQL');
        console.log(JSON.stringify(res.rows.length));

        for (var i = 0; i < res.rows.length; i++) {
          console.log(res.rows.item(i));
        }

      })
      .catch((e) => {
        console.log('Error while selecting from DB ' + JSON.stringify(e));
      });
  }

  getRecipesByIngredients(ingredientList: any) {
    console.log('Inside getRecipesByIngredients');
    console.log(ingredientList);
    this.recipe_name_list = [];
    let recipe_cnt = 0;
    let input: string = '';
    let re: string = '[^0-9A-Za-z]+'
    let sql = "with ingr_data as ( " +
      "  select  distinct substr(recipe_name,1,1) letr ,r.recipe_total_time,r.recipe_name, r.recipe_url," +
      "  'https://tarladalal.com/'||r.recipe_img_url recipe_img_url, r.recipe_id," +
      "  group_concat(i.ingredient_name,',')  " +
      "  over (partition by r.recipe_name ) con_ingr " +
      "  from recipe_ingredients ri,ingredient_master i,recipe_master r " +
      "  where ri.ingredient_id=i.ingredient_id " +
      "  and ri.recipe_id=r.recipe_id  " +
      ") " +
      "  SELECT i.recipe_url,unicode(i.letr) asciiletr,i.recipe_total_time,i.recipe_name, "+
      "  ifnull(f.recipe_id,0) fav_recipe,i.recipe_id , "+
      "  i.recipe_img_url,sum(1) over () total_recipes_cnt " +
      "  from ingr_data i left outer join favorites f"  +
      "  on  i.recipe_id= f.recipe_id " +
      "  where ";

    // this.presentToast('Counting Recipes ');
    for (let i = 0; i < ingredientList.length; i++) {
      input.replace(re, "");
      sql = sql + " i.con_ingr like  '%" + ingredientList[i] + "%'"
      if (i + 1 != ingredientList.length) {
        sql = sql + " and ";
      }
    }
    // this.presentToast('Counting Recipes Done ');

    sql = sql + '  order by recipe_name limit 100;'
    console.log(sql);

    return this.dbo.executeSql(sql, [])
      .then((res) => {
        console.log('Executed SQL');
        console.log(JSON.stringify(res.rows.length));
        this.recipe_name_list=[];
        for (var i = 0; i < res.rows.length; i++) {
          // console.log("-------------------");
          // console.log(res.rows.item(i));
          this.recipe_name_list.push(res.rows.item(i));
        }
        if (res.rows.length == 0) {
          this.recipe_name_list=[];
            this.presentToast('No Recipes Found,please change search criteria');
        }
        else {
          this.presentToast(res.rows.item(0).total_recipes_cnt + ' Recipes Found');
        }
        this.$recipe_list.next(this.recipe_name_list);

      })
      .catch((e) => {
        console.log('Error while selecting from DB ' + JSON.stringify(e));
      });
  }

  getRecipesByName(recipeName: any) {
    console.log('Inside getRecipesByName');
    this.recipe_name_list = [];
    let recipe_cnt = 0;
    let input: string = '';
    let re: string = '[^0-9A-Za-z]+'
    let sql="select recipe_url,substr(recipe_name,1,1) asciiletr,recipe_total_time,"+
            "recipe_name,'https://tarladalal.com/'||r.recipe_img_url recipe_img_url," +
            "recipe_id,sum(1) over () total_recipes_cnt"+
            "from recipe_master " +
            " where recipe_name like '%"+recipeName+"%'";


    // let sql = "with ingr_data as ( " +
    //   "  select  distinct substr(recipe_name,1,1) letr ,r.recipe_total_time,r.recipe_name, r.recipe_url," +
    //   "  'https://tarladalal.com/'||r.recipe_img_url recipe_img_url, r.recipe_id," +
    //   "  group_concat(i.ingredient_name,',')  " +
    //   "  over (partition by r.recipe_name ) con_ingr " +
    //   "  from recipe_ingredients ri,ingredient_master i,recipe_master r " +
    //   "  where ri.ingredient_id=i.ingredient_id " +
    //   "  and ri.recipe_id=r.recipe_id  " +
    //   ") " +
    //   "  SELECT i.recipe_url,unicode(i.letr) asciiletr,i.recipe_total_time,i.recipe_name, "+
    //   "  ifnull(f.recipe_id,0) fav_recipe,i.recipe_id , "+
    //   "  i.recipe_img_url,sum(1) over () total_recipes_cnt " +
    //   "  from ingr_data i left outer join favorites f"  +
    //   "  on  i.recipe_id= f.recipe_id " +
    //   "  where ";

    // // this.presentToast('Counting Recipes ');
    // for (let i = 0; i < ingredientList.length; i++) {
    //   input.replace(re, "");
    //   sql = sql + " i.con_ingr like  '%" + ingredientList[i] + "%'"
    //   if (i + 1 != ingredientList.length) {
    //     sql = sql + " and ";
    //   }
    // }
    // this.presentToast('Counting Recipes Done ');

    sql = sql + '  order by recipe_name limit 100;'
    console.log(sql);

    return this.dbo.executeSql(sql, [])
      .then((res) => {
        console.log('Executed SQL');
        console.log(JSON.stringify(res.rows.length));
        this.recipe_name_list=[];
        for (var i = 0; i < res.rows.length; i++) {
          // console.log("-------------------");
          // console.log(res.rows.item(i));
          this.recipe_name_list.push(res.rows.item(i));
        }
        if (res.rows.length == 0) {
          this.recipe_name_list=[];
            this.presentToast('No Recipes Found,please change search criteria');
        }
        else {
          this.presentToast(res.rows.item(0).total_recipes_cnt + ' Recipes Found');
        }
        this.$recipe_list.next(this.recipe_name_list);

      })
      .catch((e) => {
        console.log('Error while selecting from DB ' + JSON.stringify(e));
      });
  }

  getFavoriteRecipes() {
    console.log('Inside getFavoriteRecipes');
    this.favRecipeNameList = [];
    let sql = "with ingr_data as ( " +
      "  select  distinct substr(recipe_name,1,1) letr ,r.recipe_total_time,r.recipe_name, r.recipe_url," +
      "  'https://tarladalal.com/'||r.recipe_img_url recipe_img_url, r.recipe_id," +
      "  group_concat(i.ingredient_name,',')  " +
      "  over (partition by r.recipe_name ) con_ingr " +
      "  from recipe_ingredients ri,ingredient_master i,recipe_master r " +
      "  where ri.ingredient_id=i.ingredient_id " +
      "  and ri.recipe_id=r.recipe_id  " +
      ") " +
      "  SELECT i.recipe_url,unicode(i.letr) asciiletr,i.recipe_total_time,i.recipe_name, "+
      "  ifnull(f.recipe_id,0) fav_recipe,i.recipe_id , "+
      "  i.recipe_img_url,sum(1) over () total_recipes_cnt " +
      "  from ingr_data i inner join favorites f"  +
      "  on  i.recipe_id= f.recipe_id ";


    sql = sql + '  order by recipe_name;'
    console.log(sql);

    return this.dbo.executeSql(sql, [])
      .then((res) => {
        console.log('Executed Favorite SQL');
        console.log(JSON.stringify(res.rows.length));
        this.favRecipeNameList=[];
        for (var i = 0; i < res.rows.length; i++) {
          console.log("-------------------");
          console.log(res.rows.item(i));
          this.favRecipeNameList.push(res.rows.item(i));
        }
        if (res.rows.length == 0) {
          this.favRecipeNameList=[];
            this.presentToast('No Favorite Recipe(s) Found');
        }
        else {
          this.presentToast(res.rows.item(0).total_recipes_cnt + ' Favorite Recipe(s) Found');
        }
        this.$favRecipeList.next(this.favRecipeNameList);

      })
      .catch((e) => {
        console.log('Error while selecting from DB For Favorites :' + JSON.stringify(e));
      });
  }


  getRecipesAsObservable(): Observable<any[]> {
    return this.$recipe_list.asObservable()
  }

  getIngredientsForAutoComp(ingrName: string) {
    this.ingredientList = [];
    console.log("getIngredientsForAutoComp " + ingrName);

    let re: string = '[^0-9A-Za-z]+'
    let inp: string = ingrName.replace(re, "");
    let recipeNameSql = " Select distinct ingredient_name from ingredient_master " +
      " Where ingredient_name like '%" + ingrName + "%' LIMIT 7;";

    console.log(recipeNameSql);

    return this.dbo.executeSql(recipeNameSql, [])
      .then((res) => {
        console.log('Executed ingredientList SQL');
        console.log(JSON.stringify(res.rows.length));

        for (let i = 0; i < res.rows.length; i++) {
          console.log(res.rows.item(i));
          this.ingredientList.push(res.rows.item(i));
        }
        this.$ingListAutoComp.next(this.ingredientList);
      })
      .catch((e) => {
        console.log('Error while selecting ingredientList from DB ' + JSON.stringify(e));
      });

  }

  getRecipeNameForAutoComp(recipeName: string) {
    this.recipeNameList = [];
    console.log("getRecipeNameForAutoComp " + recipeName);

    let re: string = '[^0-9A-Za-z]+'
    let inp: string = recipeName.replace(re, "");
    let recipeNameSql = " Select distinct recipe_name,recipe_url from recipe_master " +
      " Where recipe_name like '%" + recipeName + "%' LIMIT 12;";

    console.log(recipeNameSql);

    return this.dbo.executeSql(recipeNameSql, [])
      .then((res) => {
        console.log('Executed Recipe Name SQL');
        console.log(JSON.stringify(res.rows.length));

        for (let i = 0; i < res.rows.length; i++) {
          console.log(res.rows.item(i));
          this.recipeNameList.push(res.rows.item(i));
        }
        this.$recipeNameAutoComp.next(this.recipeNameList);
      })
      .catch((e) => {
        console.log('Error while selecting Recipe Name from DB ' + JSON.stringify(e));
      });

  }


  getIngredientAsObservable(): Observable<any[]> {
    return this.$ingListAutoComp.asObservable()
  }

  async presentLoading(msg) {
    this.isLoading = true;
    return await this.loadingController.create({
      // duration: 5000,
      message: msg
    }).then(a => {
      a.present().then(() => {
        console.log('presented');
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort presenting'));
        }
      });
    });
  }

  addToFavorites(recipeId){
    this.ingredientList = [];
    console.log("addToFavorites recipeId " + recipeId);

    let favsql = "INSERT INTO favorites Values ("+recipeId+")";

    console.log(favsql);

    return this.dbo.executeSql(favsql, [])
      .then((res) => {
        console.log('Favorite Added Successfuly.');
      })
      .catch((e) => {
        console.log('Error while Adding to Favorites ' + JSON.stringify(e));
      });
  }

  removeFromFavorites(recipeId){
    this.ingredientList = [];
    console.log("removeFromFavorites recipeId " + recipeId);

    let favsql = "DELETE FROM favorites where recipe_id="+recipeId;

    console.log(favsql);

    return this.dbo.executeSql(favsql, [])
      .then((res) => {
        console.log('Favorite Removed Successfuly');
      })
      .catch((e) => {
        console.log('Error while Removing to Favorites ' + JSON.stringify(e));
      });
  }


  async dismissLoading() {
    this.isLoading = false;
    return await this.loadingController.dismiss().then(() => console.log('dismissed'));
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
}
