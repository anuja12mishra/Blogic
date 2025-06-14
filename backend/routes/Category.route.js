import express from 'express';
import {
    AddCategory,
    DeleteCategory,
    EditCategory,
    GetAllCategory
} from '../controllers/Category.controller.js';

const CategoryRoute = express.Router();

CategoryRoute.post('/add', AddCategory);
CategoryRoute.put('/edit/:categoryId', EditCategory);
CategoryRoute.delete('/delete/:categoryId', DeleteCategory);
CategoryRoute.get('/get-all-category', GetAllCategory);

export default CategoryRoute;