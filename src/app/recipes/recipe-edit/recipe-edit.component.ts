import { ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { RecipeService } from '../recipe.service';

@Component({
    selector: 'app-recipe-edit',
    templateUrl: './recipe-edit.component.html',
    styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
    id: number;
    editMode = false;
    recipeForm: FormGroup;

    // retrieve our recipe service 
    constructor(private route: ActivatedRoute, private recipeService: RecipeService) { }
    ngOnInit() {
        this.route.params.subscribe(
            (params: Params) => {
                this.id = +params['id'];

                this.editMode = params['id'] !== null; // if the id is null, then we are not in editMode
                this.initForm(); // call method on page change 
            }
        );
    }

    // initialize the form with data depending on if in editMode or not
    private initForm() {
        let recipeName = '';
        let recipeImagePath = '';
        let recipeDescription = '';
        let recipeIngredients = new FormArray([]);

        // if in editMode, populate the above variables with data from the recipe service
        if (this.editMode) {
            const recipe = this.recipeService.getRecipe(this.id); // use service to get recipe name from id
            recipeName = recipe.name;
            recipeImagePath = recipe.imagePath;
            recipeDescription = recipe.description;

            // does the recipe have ingredients defined
            if (recipe['ingredients']) {
                for (const ingredient of recipe.ingredients) {
                    recipeIngredients.push(
                        new FormGroup({
                            'name': new FormControl(ingredient.name),
                            'amount': new FormControl(ingredient.amount)
                        })
                    );
                }
            }
        }

        // base form is created 
        this.recipeForm = new FormGroup({
            'name': new FormControl(recipeName),
            'imagePath': new FormControl(recipeImagePath),
            'description': new FormControl(recipeDescription),
            'ingredients': recipeIngredients
        });
    }

    onSubmit() {
        console.log(this.recipeForm);
    }

    // add a new control to the array of ingredient controls
    onAddIngredient() {
        (<FormArray>this.recipeForm.get('ingredients')).push(
            new FormGroup({
                'name': new FormControl(),
                'amount': new FormControl()
            })
        );
    }
}
